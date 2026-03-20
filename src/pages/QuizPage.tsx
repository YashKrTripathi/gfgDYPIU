import { useEffect, useMemo, useRef, useState } from "react";

import { quizCatalog } from "../data/quizCatalog";
import { isFirebaseConfigured } from "../lib/firebase";
import {
  createQuizAttempt,
  ensureQuizSeeded,
  getQuizQuestions,
  getQuizSettings,
  submitQuizAttempt,
  subscribeQuizControl,
  updateQuizAttemptProgress,
} from "../lib/quizRepository";
import type {
  QuizControl,
  QuizId,
  QuizQuestion,
  QuizSettings,
} from "../types/quiz";

interface ActiveAttemptState {
  readonly quizId: QuizId;
  readonly attemptId: string;
  readonly name: string;
  readonly prn: string;
  readonly startedAt: number;
  readonly answers: Record<string, number>;
  readonly currentQuestionIndex: number;
}

interface SubmittedRoundState {
  readonly quizId: QuizId;
  readonly name: string;
  readonly prn: string;
  readonly submittedAt: number;
}

function getStorageKey(quizId: QuizId) {
  return `gfg_dypiu_active_quiz_attempt_${quizId}`;
}

const SUBMITTED_ROUND_STORAGE_KEY = "gfg_dypiu_submitted_round";

function findStoredAttempt(): ActiveAttemptState | null {
  for (const quiz of quizCatalog) {
    const rawValue = localStorage.getItem(getStorageKey(quiz.id));
    if (!rawValue) {
      continue;
    }

    try {
      return JSON.parse(rawValue) as ActiveAttemptState;
    } catch {
      localStorage.removeItem(getStorageKey(quiz.id));
    }
  }

  return null;
}

function saveActiveAttemptToStorage(attempt: ActiveAttemptState) {
  localStorage.setItem(getStorageKey(attempt.quizId), JSON.stringify(attempt));
}

function clearActiveAttemptFromStorage(quizId: QuizId) {
  localStorage.removeItem(getStorageKey(quizId));
}

function findSubmittedRound(): SubmittedRoundState | null {
  const rawValue = localStorage.getItem(SUBMITTED_ROUND_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as SubmittedRoundState;
  } catch {
    localStorage.removeItem(SUBMITTED_ROUND_STORAGE_KEY);
    return null;
  }
}

function saveSubmittedRound(submittedRound: SubmittedRoundState) {
  localStorage.setItem(
    SUBMITTED_ROUND_STORAGE_KEY,
    JSON.stringify(submittedRound),
  );
}

function clearSubmittedRound() {
  localStorage.removeItem(SUBMITTED_ROUND_STORAGE_KEY);
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.max(totalSeconds % 60, 0)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function calculateScore(
  questions: readonly QuizQuestion[],
  answers: Record<string, number>,
) {
  return questions.reduce((totalScore, question) => {
    return answers[question.id] === question.correctOptionIndex
      ? totalScore + 1
      : totalScore;
  }, 0);
}

function FirebaseSetupNotice() {
  return (
    <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-primary/10 bg-white/80 p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)] backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
        Firebase Setup Needed
      </p>
      <h1 className="mt-4 font-headline text-3xl font-extrabold text-on-surface sm:text-4xl">
        Connect Firebase to run the live quiz.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
        The quiz system is ready, but it needs your Firebase web config in
        `.env.local` before it can load questions, save participant names and
        PRNs, and publish the live leaderboard.
      </p>
    </div>
  );
}

export function QuizPage() {
  const [control, setControl] = useState<QuizControl>({
    activeQuizId: null,
    updatedAt: Date.now(),
  });
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [prn, setPrn] = useState("");
  const [activeAttempt, setActiveAttempt] = useState<ActiveAttemptState | null>(
    null,
  );
  const [submittedRound, setSubmittedRound] = useState<SubmittedRoundState | null>(
    null,
  );
  const [remainingSeconds, setRemainingSeconds] = useState(10 * 60);
  const [result, setResult] = useState<{
    readonly score: number;
    readonly totalQuestions: number;
    readonly timeTakenSeconds: number;
  } | null>(null);

  const autoSubmittingRef = useRef(false);
  const currentQuizId = activeAttempt?.quizId ?? control.activeQuizId;
  const currentQuiz = useMemo(
    () => quizCatalog.find((quiz) => quiz.id === currentQuizId) ?? null,
    [currentQuizId],
  );
  const activeQuestions = useMemo(() => {
    if (!settings) {
      return [];
    }

    return questions.slice(0, settings.questionCount);
  }, [questions, settings]);
  const currentQuestion = activeAttempt
    ? activeQuestions[activeAttempt.currentQuestionIndex] ?? null
    : null;

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function initializeQuiz() {
      try {
        await Promise.all(quizCatalog.map((quiz) => ensureQuizSeeded(quiz.id)));

        if (!isMounted) {
          return;
        }

        const storedAttempt = findStoredAttempt();
        if (storedAttempt) {
          setActiveAttempt(storedAttempt);
          setName(storedAttempt.name);
          setPrn(storedAttempt.prn);
        }

        const storedSubmission = findSubmittedRound();
        if (storedSubmission) {
          setSubmittedRound(storedSubmission);
          setName(storedSubmission.name);
          setPrn(storedSubmission.prn);
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to initialize the quiz.",
        );
      }
    }

    void initializeQuiz();

    const unsubscribe = subscribeQuizControl((nextControl) => {
      if (!isMounted) {
        return;
      }

      setControl(nextControl);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    const quizId = currentQuizId;

    if (!quizId) {
      setSettings(null);
      setQuestions([]);
      setLoading(false);
      return;
    }

    const resolvedQuizId: QuizId = quizId;

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadQuizData() {
      try {
        const [loadedSettings, loadedQuestions] = await Promise.all([
          getQuizSettings(resolvedQuizId),
          getQuizQuestions(resolvedQuizId),
        ]);

        if (!isMounted) {
          return;
        }

        setSettings(loadedSettings);
        setQuestions(loadedQuestions);
        if (!activeAttempt) {
          setRemainingSeconds(loadedSettings.durationMinutes * 60);
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load quiz data.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadQuizData();

    return () => {
      isMounted = false;
    };
  }, [currentQuizId]);

  useEffect(() => {
    if (!activeAttempt || !settings) {
      setRemainingSeconds(settings?.durationMinutes ? settings.durationMinutes * 60 : 600);
      autoSubmittingRef.current = false;
      return;
    }

    const updateTimer = () => {
      const elapsedSeconds = Math.floor(
        (Date.now() - activeAttempt.startedAt) / 1000,
      );
      const nextRemaining = Math.max(
        settings.durationMinutes * 60 - elapsedSeconds,
        0,
      );

      setRemainingSeconds(nextRemaining);

      if (nextRemaining === 0 && !autoSubmittingRef.current && !result) {
        autoSubmittingRef.current = true;
        void handleSubmit(true);
      }
    };

    updateTimer();
    const intervalId = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeAttempt, result, settings]);

  useEffect(() => {
    if (submittedRound && control.activeQuizId !== submittedRound.quizId) {
      clearSubmittedRound();
      setSubmittedRound(null);
    }
  }, [control.activeQuizId, submittedRound]);

  useEffect(() => {
    if (!activeAttempt) {
      return;
    }

    if (control.activeQuizId === activeAttempt.quizId) {
      return;
    }

    clearActiveAttemptFromStorage(activeAttempt.quizId);
    setActiveAttempt(null);
    setResult(null);
    setName("");
    setPrn("");
    clearSubmittedRound();
    setSubmittedRound(null);
    autoSubmittingRef.current = false;
  }, [activeAttempt, control.activeQuizId]);

  function updateActiveAttempt(partial: Partial<ActiveAttemptState>) {
    setActiveAttempt((previousAttempt) => {
      if (!previousAttempt) {
        return previousAttempt;
      }

      const nextAttempt = { ...previousAttempt, ...partial };
      saveActiveAttemptToStorage(nextAttempt);
      return nextAttempt;
    });
  }

  async function handleStartQuiz() {
    if (!settings || !currentQuizId || !currentQuiz) {
      setError("The admin has not started a quiz yet.");
      return;
    }

    if (!name.trim() || !prn.trim()) {
      setError("Please enter both your name and PRN before starting.");
      return;
    }

    if (!settings.isLive || control.activeQuizId !== currentQuizId) {
      setError("Please wait until the admin starts the quiz.");
      return;
    }

    if (submittedRound?.quizId === currentQuizId) {
      setError(
        "You have already submitted this round. Wait for the admin to start the next quiz.",
      );
      return;
    }

    if (activeQuestions.length < settings.questionCount) {
      setError(
        `Only ${activeQuestions.length} questions are configured for ${settings.title}.`,
      );
      return;
    }

    try {
      setError(null);
      const createdAttempt = await createQuizAttempt({
        quizId: currentQuizId,
        quizTitle: currentQuiz.title,
        name: name.trim(),
        prn: prn.trim(),
        totalQuestions: activeQuestions.length,
      });

      const nextAttempt: ActiveAttemptState = {
        quizId: currentQuizId,
        attemptId: createdAttempt.id,
        name: createdAttempt.name,
        prn: createdAttempt.prn,
        startedAt: createdAttempt.startedAt,
        answers: {},
        currentQuestionIndex: 0,
      };

      setResult(null);
      setActiveAttempt(nextAttempt);
      saveActiveAttemptToStorage(nextAttempt);
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to start the quiz.",
      );
    }
  }

  function handleAnswerSelect(questionId: string, optionIndex: number) {
    if (!activeAttempt) {
      return;
    }

    const nextAnswers = {
      ...activeAttempt.answers,
      [questionId]: optionIndex,
    };

    updateActiveAttempt({
      answers: nextAnswers,
    });

    if (!settings) {
      return;
    }

    const nextScore = calculateScore(activeQuestions, nextAnswers);
    const timeTakenSeconds = settings.durationMinutes * 60 - remainingSeconds;

    void updateQuizAttemptProgress(activeAttempt.attemptId, {
      score: nextScore,
      answersCount: Object.keys(nextAnswers).length,
      timeTakenSeconds,
      answers: nextAnswers,
    });
  }

  async function handleSubmit(force = false) {
    if (!activeAttempt || !settings || submitting) {
      return;
    }

    const answeredCount = Object.keys(activeAttempt.answers).length;
    const remainingQuestionCount = activeQuestions.length - answeredCount;

    if (!force && remainingQuestionCount > 0) {
      setError(
        `${remainingQuestionCount} question${remainingQuestionCount === 1 ? "" : "s"} remaining. Answer all questions before submitting.`,
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const score = calculateScore(activeQuestions, activeAttempt.answers);

      const timeTakenSeconds = settings.durationMinutes * 60 - remainingSeconds;

      await submitQuizAttempt(activeAttempt.attemptId, {
        score,
        answersCount: Object.keys(activeAttempt.answers).length,
        totalQuestions: activeQuestions.length,
        timeTakenSeconds,
        answers: activeAttempt.answers,
      });

      setResult({
        score,
        totalQuestions: activeQuestions.length,
        timeTakenSeconds,
      });
      const completedRound: SubmittedRoundState = {
        quizId: activeAttempt.quizId,
        name: activeAttempt.name,
        prn: activeAttempt.prn,
        submittedAt: Date.now(),
      };
      setSubmittedRound(completedRound);
      saveSubmittedRound(completedRound);
      setActiveAttempt(null);
      clearActiveAttemptFromStorage(activeAttempt.quizId);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your quiz.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-background px-4 pb-16 pt-24 sm:px-6 sm:pt-32">
        <FirebaseSetupNotice />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-16 pt-24 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div className="space-y-6 sm:space-y-8">
            <section className="rounded-[1.75rem] bg-[linear-gradient(135deg,#09141a_0%,#13232a_100%)] p-6 text-white shadow-[0_24px_60px_rgba(21,28,39,0.14)] sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-fixed-dim">
                Live Quiz Arena
              </p>
              <h1 className="mt-4 font-headline text-3xl font-extrabold tracking-tight sm:text-5xl">
                {currentQuiz ? currentQuiz.title : "Waiting for the admin to start the quiz."}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/72 sm:text-lg">
                {currentQuiz
                  ? `${currentQuiz.description} Log in with your name and PRN, then begin as soon as the admin opens the round.`
                  : "The next quiz will appear here automatically. Players only need their name and PRN. As soon as the admin starts a round, the quiz will unlock."}
              </p>
            </section>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {loading ? (
              <div className="rounded-[1.5rem] bg-white p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
                Loading quiz...
              </div>
            ) : result ? (
              <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_rgba(21,28,39,0.08)] sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Submitted
                </p>
                <h2 className="mt-4 font-headline text-3xl font-extrabold text-on-surface">
                  {settings?.title}: {result.score} / {result.totalQuestions}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
                  Time taken: {formatDuration(result.timeTakenSeconds)}. Your
                  result is now part of the live leaderboard.
                </p>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setResult(null)}
                    className="inline-flex rounded-2xl bg-primary px-6 py-3 font-semibold text-on-primary"
                  >
                    Return to Lobby
                  </button>
                </div>
              </section>
            ) : submittedRound?.quizId === currentQuizId ? (
              <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_rgba(21,28,39,0.08)] sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Submission Received
                </p>
                <h2 className="mt-4 font-headline text-2xl font-extrabold text-on-surface sm:text-3xl">
                  You have already finished this round.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  Your attempt is already locked for {settings?.title}. Wait for
                  the admin to stop this quiz and start the next round.
                </p>
                <div className="mt-8 rounded-2xl bg-surface-container-low px-5 py-4">
                  <p className="text-sm font-semibold text-on-surface">
                    {submittedRound.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                    {submittedRound.prn}
                  </p>
                </div>
              </section>
            ) : activeAttempt ? (
              <section className="rounded-[1.5rem] bg-white p-4 shadow-[0_24px_60px_rgba(21,28,39,0.08)] sm:p-8">
                <div className="flex flex-col gap-5 border-b border-zinc-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                      {settings?.title}
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      {activeAttempt.name}
                      <span className="mx-2">•</span>
                      {activeAttempt.prn}
                    </p>
                    <h2 className="mt-3 font-headline text-xl font-extrabold text-on-surface sm:text-3xl">
                      Question {activeAttempt.currentQuestionIndex + 1} of{" "}
                      {activeQuestions.length}
                    </h2>
                  </div>
                  <div className="w-full rounded-2xl bg-surface-container-low px-5 py-4 sm:w-auto">
                    <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                      Time Left
                    </p>
                    <p className="mt-1 font-headline text-3xl font-extrabold text-primary">
                      {formatDuration(remainingSeconds)}
                    </p>
                  </div>
                </div>

                {currentQuestion ? (
                  <>
                    <div className="mt-8">
                      <p className="text-base font-semibold leading-relaxed text-on-surface sm:text-xl">
                        {currentQuestion.prompt}
                      </p>
                      <div className="mt-6 grid gap-3">
                        {currentQuestion.options.map((option, optionIndex) => {
                          const isSelected =
                            activeAttempt.answers[currentQuestion.id] === optionIndex;

                          return (
                            <button
                              key={`${currentQuestion.id}-${optionIndex}`}
                              type="button"
                              onClick={() =>
                                handleAnswerSelect(currentQuestion.id, optionIndex)
                              }
                              className={
                                isSelected
                                  ? "rounded-2xl border border-primary bg-primary/10 px-4 py-4 text-left text-sm font-medium text-primary shadow-[0_12px_32px_rgba(0,107,42,0.08)] active:scale-[0.99] sm:px-5 sm:text-base"
                                  : "rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-left text-sm font-medium text-on-surface transition-colors hover:border-primary/30 hover:bg-surface-container-low active:scale-[0.99] sm:px-5 sm:text-base"
                              }
                            >
                              <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-low font-semibold text-on-surface-variant">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="grid w-full grid-cols-5 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                        {activeQuestions.map((question, index) => {
                          const isAnswered =
                            typeof activeAttempt.answers[question.id] === "number";
                          const isCurrent =
                            index === activeAttempt.currentQuestionIndex;

                          return (
                            <button
                              key={question.id}
                              type="button"
                              onClick={() =>
                                updateActiveAttempt({ currentQuestionIndex: index })
                              }
                              className={
                                isCurrent
                                  ? "h-11 w-full rounded-full bg-primary font-semibold text-on-primary sm:h-10 sm:w-10"
                                  : isAnswered
                                    ? "h-11 w-full rounded-full bg-primary/12 font-semibold text-primary sm:h-10 sm:w-10"
                                    : "h-11 w-full rounded-full bg-surface-container-low font-semibold text-on-surface-variant sm:h-10 sm:w-10"
                              }
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
                        <button
                          type="button"
                          onClick={() =>
                            updateActiveAttempt({
                              currentQuestionIndex: Math.max(
                                activeAttempt.currentQuestionIndex - 1,
                                0,
                              ),
                            })
                          }
                          disabled={activeAttempt.currentQuestionIndex === 0}
                          className="rounded-2xl border border-zinc-200 px-5 py-3 font-semibold text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {activeAttempt.currentQuestionIndex < activeQuestions.length - 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              updateActiveAttempt({
                                currentQuestionIndex:
                                  activeAttempt.currentQuestionIndex + 1,
                              })
                            }
                            className="rounded-2xl bg-primary px-5 py-3 font-semibold text-on-primary"
                          >
                            Next
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => void handleSubmit()}
                          disabled={submitting}
                          className="rounded-2xl bg-black px-5 py-3 font-semibold text-white disabled:opacity-60"
                        >
                          {submitting ? "Submitting..." : "Submit Quiz"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
              </section>
            ) : (
              <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_rgba(21,28,39,0.08)] sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Participant Entry
                </p>
                <h2 className="mt-4 font-headline text-2xl font-extrabold text-on-surface sm:text-3xl">
                  {currentQuiz ? `Login for ${currentQuiz.title}` : "Login and wait for the quiz to begin"}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  Players do not choose a quiz manually. Once the admin starts a
                  round, the current live quiz unlocks automatically here.
                </p>
                <form
                  autoComplete="off"
                  onSubmit={(event) => event.preventDefault()}
                  className="mt-8 grid gap-4 sm:grid-cols-2"
                >
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-on-surface">
                      Full Name
                    </span>
                    <input
                      name="gfg_quiz_name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className="rounded-2xl border border-zinc-200 px-4 py-3 text-base outline-none transition-colors focus:border-primary"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-on-surface">
                      PRN
                    </span>
                    <input
                      name="gfg_quiz_prn"
                      value={prn}
                      onChange={(event) => setPrn(event.target.value)}
                      placeholder="Enter your PRN"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="rounded-2xl border border-zinc-200 px-4 py-3 text-base outline-none transition-colors focus:border-primary"
                    />
                  </label>
                </form>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => void handleStartQuiz()}
                    disabled={
                      !currentQuiz ||
                      !settings?.isLive ||
                      control.activeQuizId !== currentQuizId ||
                      submittedRound?.quizId === currentQuizId
                    }
                    className="w-full rounded-2xl bg-primary px-6 py-3 font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {submittedRound?.quizId === currentQuizId
                      ? "Already Submitted"
                      : currentQuiz
                        ? "Start Quiz"
                        : "Waiting for Admin"}
                  </button>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4 sm:space-y-6">
            <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Suspense Mode
              </p>
              <h2 className="mt-2 font-headline text-2xl font-extrabold text-on-surface">
                Your score stays hidden while you play.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                Option clicks are saved silently in the background. Players do
                not see whether an answer is correct or where they rank until
                the round is over.
              </p>
            </section>

            <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Quiz Rules
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-on-surface-variant">
                <li>20 multiple-choice questions per round.</li>
                <li>10-minute countdown from the moment you start.</li>
                <li>Leaderboard ranking is based on score, then timing.</li>
                <li>Name and PRN are stored in Firebase for reporting later.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
