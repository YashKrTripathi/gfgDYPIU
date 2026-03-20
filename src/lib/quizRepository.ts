import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { quizPresets } from "../data/quizCatalog";
import {
  defaultQuizControl,
  type QuizAttempt,
  type QuizAttemptDraft,
  type QuizAttemptSubmission,
  type QuizControl,
  type QuizId,
  type QuizQuestion,
  type QuizSettings,
} from "../types/quiz";
import { db, isFirebaseConfigured } from "./firebase";

const SETTINGS_COLLECTION = "quizSettings";
const QUESTIONS_COLLECTION = "quizQuestions";
const ATTEMPTS_COLLECTION = "quizAttempts";
const CONTROL_COLLECTION = "quizControl";
const CONTROL_DOC = "main";

function requireDb() {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase is not configured.");
  }

  return db;
}

function sortQuestions(questions: readonly QuizQuestion[]) {
  return [...questions].sort((left, right) => left.order - right.order);
}

function sortAttempts(attempts: readonly QuizAttempt[]) {
  return [...attempts].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    if (right.answersCount !== left.answersCount) {
      return right.answersCount - left.answersCount;
    }

    if (left.timeTakenSeconds !== right.timeTakenSeconds) {
      return left.timeTakenSeconds - right.timeTakenSeconds;
    }

    return left.startedAt - right.startedAt;
  });
}

export async function getQuizSettings(quizId: QuizId): Promise<QuizSettings> {
  const firestore = requireDb();
  const settingsSnapshot = await getDoc(doc(firestore, SETTINGS_COLLECTION, quizId));

  if (!settingsSnapshot.exists()) {
    return {
      ...quizPresets[quizId].settings,
      updatedAt: Date.now(),
    };
  }

  return settingsSnapshot.data() as QuizSettings;
}

export async function saveQuizSettings(settings: QuizSettings): Promise<void> {
  const firestore = requireDb();
  await setDoc(doc(firestore, SETTINGS_COLLECTION, settings.quizId), settings);
}

export async function getQuizControl(): Promise<QuizControl> {
  const firestore = requireDb();
  const controlSnapshot = await getDoc(doc(firestore, CONTROL_COLLECTION, CONTROL_DOC));

  if (!controlSnapshot.exists()) {
    return defaultQuizControl;
  }

  return controlSnapshot.data() as QuizControl;
}

export async function saveQuizControl(control: QuizControl): Promise<void> {
  const firestore = requireDb();
  await setDoc(doc(firestore, CONTROL_COLLECTION, CONTROL_DOC), control);
}

export async function getQuizQuestions(quizId: QuizId): Promise<QuizQuestion[]> {
  const firestore = requireDb();
  const questionSnapshots = await getDocs(collection(firestore, QUESTIONS_COLLECTION));

  const questions = questionSnapshots.docs
    .map((questionSnapshot) => ({
      id: questionSnapshot.id,
      ...(questionSnapshot.data() as Omit<QuizQuestion, "id">),
    }))
    .filter((question) => question.quizId === quizId);

  if (questions.length === 0) {
    return quizPresets[quizId].questions.map((question) => ({
      ...question,
      updatedAt: Date.now(),
    }));
  }

  return sortQuestions(questions);
}

export async function saveQuizQuestions(
  quizId: QuizId,
  questions: readonly QuizQuestion[],
): Promise<void> {
  const firestore = requireDb();
  const batch = writeBatch(firestore);
  const questionCollection = collection(firestore, QUESTIONS_COLLECTION);
  const existingSnapshots = await getDocs(questionCollection);
  const incomingIds = new Set(questions.map((question) => question.id));

  existingSnapshots.docs.forEach((snapshot) => {
    const data = snapshot.data() as QuizQuestion;
    if (data.quizId === quizId && !incomingIds.has(snapshot.id)) {
      batch.delete(doc(firestore, QUESTIONS_COLLECTION, snapshot.id));
    }
  });

  questions.forEach((question) => {
    batch.set(doc(firestore, QUESTIONS_COLLECTION, question.id), question);
  });

  await batch.commit();
}

export async function ensureQuizSeeded(quizId: QuizId): Promise<void> {
  const firestore = requireDb();
  const preset = quizPresets[quizId];
  const settingsRef = doc(firestore, SETTINGS_COLLECTION, quizId);
  const settingsSnapshot = await getDoc(settingsRef);

  if (!settingsSnapshot.exists()) {
    await setDoc(settingsRef, {
      ...preset.settings,
      updatedAt: Date.now(),
    });
  }

  const questionSnapshots = await getDocs(collection(firestore, QUESTIONS_COLLECTION));
  const existingQuestions = questionSnapshots.docs.filter((snapshot) => {
    const data = snapshot.data() as QuizQuestion;
    return data.quizId === quizId;
  });

  if (existingQuestions.length === 0) {
    await saveQuizQuestions(
      quizId,
      preset.questions.map((question) => ({
        ...question,
        updatedAt: Date.now(),
      })),
    );
  }

  const controlRef = doc(firestore, CONTROL_COLLECTION, CONTROL_DOC);
  const controlSnapshot = await getDoc(controlRef);
  if (!controlSnapshot.exists()) {
    await setDoc(controlRef, defaultQuizControl);
  }
}

export async function createQuizAttempt(
  draft: QuizAttemptDraft,
): Promise<QuizAttempt> {
  const firestore = requireDb();
  const createdAt = Date.now();
  const attemptRef = doc(collection(firestore, ATTEMPTS_COLLECTION));

  const attempt: QuizAttempt = {
    id: attemptRef.id,
    quizId: draft.quizId,
    quizTitle: draft.quizTitle,
    name: draft.name,
    prn: draft.prn,
    status: "in_progress",
    score: 0,
    answersCount: 0,
    totalQuestions: draft.totalQuestions,
    timeTakenSeconds: 0,
    startedAt: createdAt,
    finishedAt: null,
    answers: {},
    updatedAt: createdAt,
  };

  await setDoc(attemptRef, attempt);
  return attempt;
}

export async function submitQuizAttempt(
  attemptId: string,
  submission: QuizAttemptSubmission,
): Promise<void> {
  const firestore = requireDb();
  const completedAt = Date.now();

  await setDoc(
    doc(firestore, ATTEMPTS_COLLECTION, attemptId),
    {
      status: "completed",
      score: submission.score,
      answersCount: submission.answersCount,
      totalQuestions: submission.totalQuestions,
      timeTakenSeconds: submission.timeTakenSeconds,
      finishedAt: completedAt,
      answers: submission.answers,
      updatedAt: completedAt,
    },
    { merge: true },
  );
}

export async function updateQuizAttemptProgress(
  attemptId: string,
  progress: Pick<
    QuizAttemptSubmission,
    "score" | "answersCount" | "timeTakenSeconds" | "answers"
  >,
): Promise<void> {
  const firestore = requireDb();

  await setDoc(
    doc(firestore, ATTEMPTS_COLLECTION, attemptId),
    {
      score: progress.score,
      answersCount: progress.answersCount,
      timeTakenSeconds: progress.timeTakenSeconds,
      answers: progress.answers,
      updatedAt: Date.now(),
    },
    { merge: true },
  );
}

export async function clearQuizAttempts(quizId: QuizId): Promise<void> {
  const firestore = requireDb();
  const attemptSnapshots = await getDocs(collection(firestore, ATTEMPTS_COLLECTION));
  const batch = writeBatch(firestore);

  attemptSnapshots.docs.forEach((snapshot) => {
    const data = snapshot.data() as QuizAttempt;
    if (data.quizId === quizId) {
      batch.delete(doc(firestore, ATTEMPTS_COLLECTION, snapshot.id));
    }
  });

  await batch.commit();
}

export function subscribeLeaderboard(
  quizId: QuizId,
  onUpdate: (attempts: QuizAttempt[]) => void,
): () => void {
  const firestore = requireDb();
  const attemptsQuery = query(collection(firestore, ATTEMPTS_COLLECTION));

  return onSnapshot(attemptsQuery, (snapshot) => {
    const attempts = snapshot.docs
      .map((attemptSnapshot) => attemptSnapshot.data() as QuizAttempt)
      .filter((attempt) => attempt.quizId === quizId);

    onUpdate(sortAttempts(attempts));
  });
}

export function subscribeAttemptLog(
  quizId: QuizId | "all",
  onUpdate: (attempts: QuizAttempt[]) => void,
): () => void {
  const firestore = requireDb();
  const attemptsQuery = query(collection(firestore, ATTEMPTS_COLLECTION));

  return onSnapshot(attemptsQuery, (snapshot) => {
    const attempts = snapshot.docs
      .map((attemptSnapshot) => attemptSnapshot.data() as QuizAttempt)
      .filter((attempt) => quizId === "all" || attempt.quizId === quizId);

    onUpdate(sortAttempts(attempts));
  });
}

export function subscribeQuizControl(
  onUpdate: (control: QuizControl) => void,
): () => void {
  const firestore = requireDb();
  const controlRef = doc(firestore, CONTROL_COLLECTION, CONTROL_DOC);

  return onSnapshot(controlRef, (snapshot) => {
    if (!snapshot.exists()) {
      onUpdate(defaultQuizControl);
      return;
    }

    onUpdate(snapshot.data() as QuizControl);
  });
}
