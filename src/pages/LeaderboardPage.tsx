import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Footer } from "../components/Footer";
import { siteContent } from "../data/mockData";
import { quizCatalog } from "../data/quizCatalog";
import { isFirebaseConfigured } from "../lib/firebase";
import {
  ensureQuizSeeded,
  subscribeLeaderboard,
  subscribeQuizControl,
} from "../lib/quizRepository";
import type { QuizAttempt, QuizControl, QuizId } from "../types/quiz";

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.max(totalSeconds % 60, 0)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function rankLabel(index: number) {
  if (index === 0) {
    return "1st";
  }

  if (index === 1) {
    return "2nd";
  }

  return "3rd";
}

export function LeaderboardPage() {
  const [control, setControl] = useState<QuizControl>({
    activeQuizId: null,
    updatedAt: Date.now(),
  });
  const [displayQuizId, setDisplayQuizId] = useState<QuizId | null>(null);
  const [leaderboard, setLeaderboard] = useState<QuizAttempt[]>([]);
  const [podiumWinners, setPodiumWinners] = useState<QuizAttempt[]>([]);
  const [showPodium, setShowPodium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const previousActiveQuizIdRef = useRef<QuizId | null>(null);
  const lastPodiumSignatureRef = useRef<string | null>(null);

  const displayQuiz = useMemo(
    () => quizCatalog.find((quiz) => quiz.id === displayQuizId) ?? null,
    [displayQuizId],
  );
  const completedLeaderboard = useMemo(
    () => leaderboard.filter((attempt) => attempt.status === "completed"),
    [leaderboard],
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
    const previousQuizId = previousActiveQuizIdRef.current;

    if (control.activeQuizId) {
      setLeaderboard([]);
      setDisplayQuizId(control.activeQuizId);
      setShowPodium(false);
      setPodiumWinners([]);
    } else if (previousQuizId) {
      setDisplayQuizId(previousQuizId);
    }

    previousActiveQuizIdRef.current = control.activeQuizId;
  }, [control.activeQuizId]);

  useEffect(() => {
    if (!isFirebaseConfigured || !displayQuizId) {
      if (!displayQuizId) {
        setLeaderboard([]);
      }

      return;
    }

    const unsubscribe = subscribeLeaderboard(displayQuizId, setLeaderboard);
    return () => unsubscribe();
  }, [displayQuizId]);

  useEffect(() => {
    if (control.activeQuizId || !displayQuizId || completedLeaderboard.length === 0) {
      return;
    }

    const nextPodiumSignature = `${displayQuizId}:${completedLeaderboard
      .slice(0, 3)
      .map((attempt) => attempt.id)
      .join("|")}`;

    if (lastPodiumSignatureRef.current === nextPodiumSignature) {
      return;
    }

    const winners = completedLeaderboard.slice(0, 3);
    if (winners.length === 0) {
      return;
    }

    lastPodiumSignatureRef.current = nextPodiumSignature;
    setPodiumWinners(winners);
    setShowPodium(true);
  }, [completedLeaderboard, control.activeQuizId, displayQuizId]);

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-[#081117] text-white">
        <div className="flex items-center justify-center px-6 py-10">
          <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary-fixed-dim">
              Firebase Setup Needed
            </p>
            <h1 className="mt-4 font-headline text-4xl font-extrabold">
              Connect Firebase to show the live leaderboard.
            </h1>
          </div>
        </div>
        <Footer
          brand={siteContent.footer.brand}
          copyright={siteContent.footer.copyright}
          credit={siteContent.footer.credit}
          presentationLink={siteContent.footer.presentationLink}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#16303a_0%,#081117_55%,#050a0f_100%)] text-white">
      <div className="px-6 py-10 sm:px-10 lg:px-14">
      <AnimatePresence>
        {showPodium ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#041016]/84 px-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: -24 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="w-full max-w-5xl rounded-[2.5rem] border border-primary-fixed-dim/20 bg-[linear-gradient(135deg,rgba(14,31,38,0.96),rgba(7,16,22,0.96))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.38)] sm:p-12"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPodium(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-2xl text-white/82 transition-colors hover:bg-white/12"
                  aria-label="Close winner declaration"
                >
                  ×
                </button>
              </div>
              <p className="text-center text-sm font-bold uppercase tracking-[0.28em] text-primary-fixed-dim">
                Winner Declaration
              </p>
              <h2 className="mt-4 text-center font-headline text-4xl font-extrabold tracking-tight sm:text-6xl">
                {displayQuiz?.title ?? "Quiz Complete"}
              </h2>
              <p className="mt-4 text-center text-base text-white/68 sm:text-lg">
                Top 3 finishers of the round.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {podiumWinners.map((winner, index) => (
                  <motion.div
                    key={winner.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.14 }}
                    className={
                      index === 0
                        ? "rounded-[2rem] border border-primary-fixed-dim/30 bg-[linear-gradient(135deg,rgba(126,219,138,0.18),rgba(255,255,255,0.06))] p-6 text-center md:-translate-y-4"
                        : "rounded-[2rem] border border-white/10 bg-white/6 p-6 text-center"
                    }
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-fixed-dim">
                      {rankLabel(index)}
                    </p>
                    <h3 className="mt-3 font-headline text-3xl font-extrabold">
                      {winner.name}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/50">
                      {winner.prn}
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                          Score
                        </p>
                        <p className="mt-2 font-headline text-4xl font-extrabold text-primary-fixed-dim">
                          {winner.score}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                          Time
                        </p>
                        <p className="mt-2 font-headline text-3xl font-bold">
                          {formatDuration(winner.timeTakenSeconds)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary-fixed-dim">
            GFG DYPIU Live Leaderboard
          </p>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-6xl">
                {displayQuiz ? displayQuiz.title : "Waiting For The Next Round"}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/72 sm:text-xl">
                {control.activeQuizId
                  ? "Realtime rankings update automatically as participants answer and submit. When the admin switches to the next quiz, this screen follows instantly."
                  : displayQuiz
                    ? "This round has ended. Final standings stay on screen until the next quiz starts."
                    : "This screen will switch automatically as soon as the admin starts a quiz."}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                Status
              </p>
              <p className="mt-2 font-headline text-2xl font-bold text-primary-fixed-dim">
                {control.activeQuizId
                  ? "Live"
                  : displayQuiz
                    ? "Final Results"
                    : loading
                      ? "Loading"
                      : "Standby"}
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
              {!displayQuiz ? (
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
                    {displayQuiz ? displayQuiz.title : "None"}
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
                follow whichever quiz the admin starts next and declare the top
                3 when a round ends.
              </p>
            </div>
          </aside>
        </section>
      </div>
      </div>
      <Footer
        brand={siteContent.footer.brand}
        copyright={siteContent.footer.copyright}
        credit={siteContent.footer.credit}
        presentationLink={siteContent.footer.presentationLink}
      />
    </div>
  );
}
