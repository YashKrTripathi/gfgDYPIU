export type QuizId = "architects-gambit" | "hack-n-crack";

export interface QuizSettings {
  readonly quizId: QuizId;
  readonly title: string;
  readonly description: string;
  readonly durationMinutes: number;
  readonly questionCount: number;
  readonly isLive: boolean;
  readonly updatedAt: number;
}

export interface QuizQuestion {
  readonly id: string;
  readonly quizId: QuizId;
  readonly order: number;
  readonly prompt: string;
  readonly options: readonly string[];
  readonly correctOptionIndex: number;
  readonly updatedAt: number;
}

export type QuizAttemptStatus = "in_progress" | "completed";

export interface QuizAttempt {
  readonly id: string;
  readonly quizId: QuizId;
  readonly quizTitle: string;
  readonly name: string;
  readonly prn: string;
  readonly status: QuizAttemptStatus;
  readonly score: number;
  readonly answersCount: number;
  readonly totalQuestions: number;
  readonly timeTakenSeconds: number;
  readonly startedAt: number;
  readonly finishedAt: number | null;
  readonly answers: Record<string, number>;
  readonly updatedAt: number;
}

export interface QuizAttemptDraft {
  readonly quizId: QuizId;
  readonly quizTitle: string;
  readonly name: string;
  readonly prn: string;
  readonly totalQuestions: number;
}

export interface QuizAttemptSubmission {
  readonly score: number;
  readonly answersCount: number;
  readonly totalQuestions: number;
  readonly timeTakenSeconds: number;
  readonly answers: Record<string, number>;
}

export interface QuizDefinition {
  readonly id: QuizId;
  readonly label: string;
  readonly title: string;
  readonly description: string;
}

export interface QuizControl {
  readonly activeQuizId: QuizId | null;
  readonly updatedAt: number;
}

export const defaultQuizControl: QuizControl = {
  activeQuizId: null,
  updatedAt: Date.now(),
};
