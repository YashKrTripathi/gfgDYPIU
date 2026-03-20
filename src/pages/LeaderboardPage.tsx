import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { quizCatalog } from "../data/quizCatalog";
import { isFirebaseConfigured } from "../lib/firebase";
import {
  ensureQuizSeeded,
  subscribeLeaderboard,
  subscribeQuizControl,
} from "../lib/quizRepository";
import type { QuizAttempt, QuizControl } from "../types/quiz";

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.max(totalSeconds % 60, 0)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function LeaderboardPage() {
  const [control, setControl] = useState<QuizControl>({
    activeQuizId: null,
    updatedAt: Date.now(),
  });
  const [leaderboard, setLeaderboard] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeQuiz = useMemo(
    () =>
      quizCatalog.find((quiz) => quiz.id === control.activeQuizId) ?? null,
    [control.activeQuizId],
  );

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function initialize() {
      try {
        await Promise.all(quizCatalog.map((quiz) => ensureQuizSeeded(quiz.id)));
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to initialize leaderboard.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void initialize();

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

    if (!control.activeQuizId) {
      setLeaderboard([]);
      return;
    }

    const unsubscribe = subscribeLeaderboard(control.activeQuizId, setLeaderboard);
    return () => unsubscribe();
  }, [control.activeQuizId]);

  if (!isFirebaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#081117] px-6 text-white">
        <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary-fixed-dim">
            Firebase Setup Needed
          </p>
          <h1 className="mt-4 font-headline text-4xl font-extrabold">
            Connect Firebase to show the live leaderboard.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#16303a_0%,#081117_55%,#050a0f_100%)] px-6 py-10 text-white sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary-fixed-dim">
            GFG DYPIU Live Leaderboard
          </p>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-6xl">
                {activeQuiz ? activeQuiz.title : "Waiting For The Next Round"}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/72 sm:text-xl">
                {activeQuiz
                  ? "Realtime rankings update automatically as participants submit. When the admin switches to the next quiz, this screen follows instantly."
                  : "This screen will switch automatically as soon as the admin starts a quiz."}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                Status
              </p>
              <p className="mt-2 font-headline text-2xl font-bold text-primary-fixed-dim">
                {activeQuiz ? "Live" : loading ? "Loading" : "Standby"}
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mt-8 rounded-[1.5rem] border border-red-400/30 bg-red-500/10 px-6 py-5 text-base text-red-100">
            {error}
          </div>
        ) : null}

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-8">
            <div className="grid grid-cols-[80px_minmax(0,1fr)_120px_120px] gap-4 border-b border-white/10 px-4 pb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/45">
              <div>Rank</div>
              <div>Player</div>
              <div className="text-right">Score</div>
              <div className="text-right">Time</div>
            </div>

            <div className="mt-4 space-y-4">
                {!activeQuiz ? (
                  <div className="rounded-[1.5rem] bg-white/6 px-6 py-10 text-center text-xl text-white/65">
                    No quiz is live right now.
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="rounded-[1.5rem] bg-white/6 px-6 py-10 text-center text-xl text-white/65">
                    No submissions yet. Rankings will appear here in real time.
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {leaderboard.map((attempt, index) => (
                      <motion.div
                        key={attempt.id}
                        layout
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -24, scale: 0.98 }}
                        transition={{
                          layout: {
                            type: "spring",
                            stiffness: 320,
                            damping: 28,
                          },
                          duration: 0.35,
                        }}
                        className={
                          index === 0
                            ? "grid grid-cols-[80px_minmax(0,1fr)_120px_120px] items-center gap-4 rounded-[1.75rem] border border-primary-fixed-dim/30 bg-[linear-gradient(135deg,rgba(126,219,138,0.18),rgba(255,255,255,0.05))] px-4 py-5"
                            : "grid grid-cols-[80px_minmax(0,1fr)_120px_120px] items-center gap-4 rounded-[1.75rem] border border-white/8 bg-white/6 px-4 py-5"
                        }
                      >
                        <div className="font-headline text-3xl font-extrabold text-primary-fixed-dim">
                          #{index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <p className="truncate font-headline text-2xl font-bold">
                              {attempt.name}
                            </p>
                            <span
                              className={
                                attempt.status === "completed"
                                  ? "rounded-full bg-emerald-400/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200"
                                  : "rounded-full bg-amber-400/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100"
                              }
                            >
                              {attempt.status === "completed" ? "Finished" : "Live"}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-sm uppercase tracking-[0.18em] text-white/50">
                            {attempt.prn}
                          </p>
                          <p className="mt-2 text-sm text-white/60">
                            {attempt.answersCount}/{attempt.totalQuestions} answered
                          </p>
                        </div>
                        <div className="text-right font-headline text-4xl font-extrabold text-primary-fixed-dim">
                          {attempt.score}
                        </div>
                        <div className="text-right font-headline text-3xl font-bold text-white">
                          {formatDuration(attempt.timeTakenSeconds)}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-fixed-dim">
                Live Stats
              </p>
              <div className="mt-5 grid gap-4">
                <div className="rounded-[1.5rem] bg-white/6 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Active Quiz
                  </p>
                  <p className="mt-2 font-headline text-2xl font-bold">
                    {activeQuiz ? activeQuiz.title : "None"}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-white/6 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Ranked Players
                  </p>
                  <p className="mt-2 font-headline text-4xl font-extrabold text-primary-fixed-dim">
                    {leaderboard.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-fixed-dim">
                Presentation Note
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                Keep this page open on the projector. It will automatically
                follow whichever quiz the admin starts next.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
