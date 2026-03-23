import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { Footer } from "../components/Footer";
import { siteContent } from "../data/mockData";
import { quizCatalog, quizPresets } from "../data/quizCatalog";
import {
  adminEmail,
  firebaseAuth,
  isAdminEmailConfigured,
  isFirebaseConfigured,
} from "../lib/firebase";
import {
  clearQuizAttempts,
  ensureQuizSeeded,
  getQuizControl,
  getQuizQuestions,
  getQuizSettings,
  saveQuizControl,
  saveQuizQuestions,
  saveQuizSettings,
  subscribeAttemptLog,
  subscribeQuizControl,
} from "../lib/quizRepository";
import type {
  QuizAttempt,
  QuizControl,
  QuizId,
  QuizQuestion,
  QuizSettings,
} from "../types/quiz";
import { defaultQuizControl } from "../types/quiz";

function downloadAttemptsCsv(attempts: readonly QuizAttempt[]) {
  const header = [
    "Quiz",
    "Name",
    "PRN",
    "Status",
    "Score",
    "Answered",
    "Total Questions",
    "Time Taken (seconds)",
    "Started At",
    "Finished At",
  ];

  const rows = attempts.map((attempt) => [
    attempt.quizTitle,
    attempt.name,
    attempt.prn,
    attempt.status,
    attempt.score.toString(),
    attempt.answersCount.toString(),
    attempt.totalQuestions.toString(),
    attempt.timeTakenSeconds.toString(),
    new Date(attempt.startedAt).toISOString(),
    attempt.finishedAt ? new Date(attempt.finishedAt).toISOString() : "",
  ]);

  const csv = [header, ...rows]
    .map((row) =>
      row.map((cell) => `"${cell.split('"').join('""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = "gfg-dypiu-quiz-attempts.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

function FirebaseSetupNotice() {
  return (
    <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-primary/10 bg-white/80 p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)] backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
        Firebase Setup Needed
      </p>
      <h1 className="mt-4 font-headline text-3xl font-extrabold text-on-surface sm:text-4xl">
        Connect Firebase before using the admin console.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
        Add your Firebase web configuration to `.env.local` so the admin page
        can save both quizzes, store all 40 MCQs, and export participant data.
      </p>
    </div>
  );
}

function AdminEmailSetupNotice() {
  return (
    <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-amber-200 bg-amber-50 p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
        Admin Access Setup Needed
      </p>
      <h1 className="mt-4 font-headline text-3xl font-extrabold text-on-surface sm:text-4xl">
        Add an allowed admin email before opening the console.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
        Set <code>VITE_ADMIN_EMAIL</code> in <code>.env.local</code> to the
        Firebase Authentication email address that should be allowed into the
        admin portal.
      </p>
    </div>
  );
}

interface AdminLoginCardProps {
  readonly email: string;
  readonly password: string;
  readonly error: string | null;
  readonly submitting: boolean;
  readonly onEmailChange: (value: string) => void;
  readonly onPasswordChange: (value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function AdminLoginCard({
  email,
  password,
  error,
  submitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Readonly<AdminLoginCardProps>) {
  return (
    <div className="mx-auto max-w-md rounded-[1.75rem] border border-black/10 bg-white p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)] sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
        Protected Admin Portal
      </p>
      <h1 className="mt-4 font-headline text-3xl font-extrabold text-on-surface sm:text-4xl">
        Sign in to continue.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
        Use your Firebase Authentication admin account to unlock quiz controls,
        question editing, and exports.
      </p>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-on-surface">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            autoComplete="email"
            className="rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-primary"
            placeholder="admin@example.com"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-on-surface">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            autoComplete="current-password"
            className="rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-primary"
            placeholder="Enter your password"
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-primary px-5 py-3 font-semibold text-on-primary disabled:opacity-60"
        >
          {submitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

interface UnauthorizedAdminNoticeProps {
  readonly signedInEmail: string;
  readonly onSignOut: () => void;
}

function UnauthorizedAdminNotice({
  signedInEmail,
  onSignOut,
}: Readonly<UnauthorizedAdminNoticeProps>) {
  return (
    <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-red-200 bg-red-50 p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-700">
        Access Denied
      </p>
      <h1 className="mt-4 font-headline text-3xl font-extrabold text-on-surface sm:text-4xl">
        This account cannot open the admin console.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
        Signed in as <strong>{signedInEmail}</strong>. Only the configured admin
        email can access this route.
      </p>
      <button
        type="button"
        onClick={onSignOut}
        className="mt-6 rounded-2xl border border-zinc-300 px-5 py-3 font-semibold text-on-surface"
      >
        Sign Out
      </button>
    </div>
  );
}

export function AdminPage() {
  const [authReady, setAuthReady] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState(adminEmail);
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [selectedQuizId, setSelectedQuizId] =
    useState<QuizId>("architects-gambit");
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [control, setControl] = useState<QuizControl>({
    activeQuizId: null,
    updatedAt: Date.now(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingQuestions, setSavingQuestions] = useState(false);
  const [updatingControl, setUpdatingControl] = useState(false);
  const [clearingLeaderboard, setClearingLeaderboard] = useState(false);

  const selectedQuiz =
    quizCatalog.find((quiz) => quiz.id === selectedQuizId) ?? quizCatalog[0];

  const completedAttempts = useMemo(
    () => attempts.filter((attempt) => attempt.status === "completed"),
    [attempts],
  );
  const normalizedUserEmail = adminUser?.email?.trim().toLowerCase() ?? "";
  const isAuthorizedAdmin =
    isAdminEmailConfigured &&
    Boolean(adminUser) &&
    normalizedUserEmail === adminEmail;

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setAdminUser(nextUser);
      setAuthError(null);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !isAuthorizedAdmin) {
      setSettings(null);
      setQuestions([]);
      setAttempts([]);
      setControl(defaultQuizControl);
      setLoading(false);
      setError(null);
      setSaveMessage(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setSaveMessage(null);
    setError(null);

    async function loadAdminData() {
      try {
        await Promise.all(
          quizCatalog.map((quiz) => ensureQuizSeeded(quiz.id)),
        );

        const [loadedSettings, loadedQuestions, loadedControl] = await Promise.all([
          getQuizSettings(selectedQuizId),
          getQuizQuestions(selectedQuizId),
          getQuizControl(),
        ]);

        if (!isMounted) {
          return;
        }

        setSettings(loadedSettings);
        setQuestions(loadedQuestions);
        setControl(loadedControl);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load admin data.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadAdminData();

    const unsubscribeAttempts = subscribeAttemptLog(selectedQuizId, setAttempts);
    const unsubscribeControl = subscribeQuizControl(setControl);

    return () => {
      isMounted = false;
      unsubscribeAttempts();
      unsubscribeControl();
    };
  }, [isAuthorizedAdmin, selectedQuizId]);

  async function handleAdminSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firebaseAuth) {
      setAuthError("Firebase Authentication is not available.");
      return;
    }

    const nextEmail = loginEmail.trim();
    const nextPassword = loginPassword;

    if (!nextEmail || !nextPassword) {
      setAuthError("Enter both the admin email and password.");
      return;
    }

    if (nextEmail.toLowerCase() !== adminEmail) {
      setAuthError(`Use the configured admin account (${adminEmail}).`);
      return;
    }

    try {
      setSigningIn(true);
      setAuthError(null);
      await signInWithEmailAndPassword(firebaseAuth, nextEmail, nextPassword);
      setLoginPassword("");
    } catch (signInError) {
      setAuthError(
        signInError instanceof Error
          ? signInError.message
          : "Unable to sign in to the admin portal.",
      );
    } finally {
      setSigningIn(false);
    }
  }

  async function handleAdminSignOut() {
    if (!firebaseAuth) {
      return;
    }

    try {
      setAuthError(null);
      await signOut(firebaseAuth);
      setLoginEmail(adminEmail);
      setLoginPassword("");
    } catch (signOutError) {
      setAuthError(
        signOutError instanceof Error
          ? signOutError.message
          : "Unable to sign out right now.",
      );
    }
  }

  function handleSettingChange<K extends keyof QuizSettings>(
    key: K,
    value: QuizSettings[K],
  ) {
    setSaveMessage(null);
    setSettings((previousSettings) => {
      if (!previousSettings) {
        return previousSettings;
      }

      return {
        ...previousSettings,
        [key]: value,
        updatedAt: Date.now(),
      };
    });
  }

  function handleQuestionPromptChange(questionIndex: number, prompt: string) {
    setSaveMessage(null);
    setQuestions((previousQuestions) =>
      previousQuestions.map((question, index) =>
        index === questionIndex
          ? { ...question, prompt, updatedAt: Date.now() }
          : question,
      ),
    );
  }

  function handleOptionChange(
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) {
    setSaveMessage(null);
    setQuestions((previousQuestions) =>
      previousQuestions.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const nextOptions = [...question.options];
        nextOptions[optionIndex] = value;

        return {
          ...question,
          options: nextOptions,
          updatedAt: Date.now(),
        };
      }),
    );
  }

  function handleCorrectOptionChange(questionIndex: number, optionIndex: number) {
    setSaveMessage(null);
    setQuestions((previousQuestions) =>
      previousQuestions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              correctOptionIndex: optionIndex,
              updatedAt: Date.now(),
            }
          : question,
      ),
    );
  }

  async function handleSaveSettings() {
    if (!settings) {
      return;
    }

    try {
      setSavingSettings(true);
      setError(null);
      await saveQuizSettings({
        ...settings,
        updatedAt: Date.now(),
      });
      setSaveMessage(`${settings.title} settings saved to Firebase.`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save quiz settings.",
      );
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleSaveQuestions() {
    if (!settings) {
      return;
    }

    try {
      setSavingQuestions(true);
      setError(null);

      const nextQuestions = questions.map((question) => ({
        ...question,
        quizId: selectedQuizId,
        updatedAt: Date.now(),
      }));

      await saveQuizQuestions(selectedQuizId, nextQuestions);
      setQuestions(nextQuestions);
      setSaveMessage(`${settings.title} questions saved to Firebase.`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save questions.",
      );
    } finally {
      setSavingQuestions(false);
    }
  }

  async function handleStartSelectedQuiz() {
    if (!settings) {
      return;
    }

    if (!settings.isLive) {
      setError("Turn on 'Quiz Live' for this quiz before starting it.");
      return;
    }

    try {
      setUpdatingControl(true);
      setError(null);
      await clearQuizAttempts(selectedQuizId);
      await saveQuizControl({
        activeQuizId: selectedQuizId,
        updatedAt: Date.now(),
      });
      setSaveMessage(`${settings.title} is now live for players, and its leaderboard has been reset for a fresh round.`);
    } catch (controlError) {
      setError(
        controlError instanceof Error
          ? controlError.message
          : "Unable to start the quiz.",
      );
    } finally {
      setUpdatingControl(false);
    }
  }

  async function handleStopQuiz() {
    try {
      setUpdatingControl(true);
      setError(null);
      await saveQuizControl({
        activeQuizId: null,
        updatedAt: Date.now(),
      });
      setSaveMessage("Live quiz stopped for players.");
    } catch (controlError) {
      setError(
        controlError instanceof Error
          ? controlError.message
          : "Unable to stop the quiz.",
      );
    } finally {
      setUpdatingControl(false);
    }
  }

  async function handleClearLeaderboard() {
    const confirmed = window.confirm(
      `Clear all attempts and leaderboard entries for ${selectedQuiz.title}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setClearingLeaderboard(true);
      setError(null);
      await clearQuizAttempts(selectedQuizId);
      setSaveMessage(`${selectedQuiz.title} leaderboard cleared.`);
    } catch (clearError) {
      setError(
        clearError instanceof Error
          ? clearError.message
          : "Unable to clear leaderboard.",
      );
    } finally {
      setClearingLeaderboard(false);
    }
  }

  function handleResetToPreset() {
    const preset = quizPresets[selectedQuizId];
    setSettings({
      ...preset.settings,
      updatedAt: Date.now(),
    });
    setQuestions(
      preset.questions.map((question) => ({
        ...question,
        updatedAt: Date.now(),
      })),
    );
    setSaveMessage(`${preset.settings.title} restored from preset locally.`);
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-background pt-28 sm:pt-32">
        <div className="px-4 pb-16 sm:px-6">
          <FirebaseSetupNotice />
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

  if (!isAdminEmailConfigured) {
    return (
      <div className="min-h-screen bg-background pt-28 sm:pt-32">
        <div className="px-4 pb-16 sm:px-6">
          <AdminEmailSetupNotice />
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

  if (!authReady) {
    return (
      <div className="min-h-screen bg-background pt-28 sm:pt-32">
        <div className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-[1.75rem] bg-white p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
            Checking admin access...
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

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-background pt-28 sm:pt-32">
        <div className="px-4 pb-16 sm:px-6">
          <AdminLoginCard
            email={loginEmail}
            password={loginPassword}
            error={authError}
            submitting={signingIn}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onSubmit={handleAdminSignIn}
          />
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

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-background pt-28 sm:pt-32">
        <div className="px-4 pb-16 sm:px-6">
          <UnauthorizedAdminNotice
            signedInEmail={adminUser.email ?? "unknown"}
            onSignOut={() => void handleAdminSignOut()}
          />
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
    <div className="min-h-screen bg-background pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-16 sm:px-6">
        <section className="rounded-[1.75rem] bg-[linear-gradient(135deg,#09141a_0%,#13232a_100%)] p-8 text-white shadow-[0_24px_60px_rgba(21,28,39,0.14)] sm:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-fixed-dim">
                Admin Console
              </p>
              <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">
                Manage both quizzes from one place.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/72 sm:text-lg">
                Architect&apos;s Gambit and Hack&apos;n&apos;Crack are both
                preloaded. You can edit the 20 MCQs for either track and save
                them straight to Firebase.
              </p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-fixed-dim">
                {control.activeQuizId
                  ? `Currently live: ${quizCatalog.find((quiz) => quiz.id === control.activeQuizId)?.title ?? "Unknown Quiz"}`
                  : "Currently live: none"}
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => void handleAdminSignOut()}
                  className="rounded-2xl border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/12"
                >
                  Sign Out
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                    Quizzes
                  </p>
                  <p className="mt-2 font-headline text-3xl font-bold">2</p>
                </div>
                <div className="rounded-2xl bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                    Questions
                  </p>
                  <p className="mt-2 font-headline text-3xl font-bold">40</p>
                </div>
                <div className="rounded-2xl bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                    Attempts
                  </p>
                  <p className="mt-2 font-headline text-3xl font-bold">
                    {attempts.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {quizCatalog.map((quiz) => {
            const isSelected = quiz.id === selectedQuizId;

            return (
              <button
                key={quiz.id}
                type="button"
                onClick={() => setSelectedQuizId(quiz.id)}
                className={
                  isSelected
                    ? "rounded-[1.5rem] border border-primary bg-primary/10 p-5 text-left shadow-[0_16px_40px_rgba(21,28,39,0.08)]"
                    : "rounded-[1.5rem] border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-primary/30"
                }
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  Quiz Track
                </p>
                <h2 className="mt-3 font-headline text-2xl font-extrabold text-on-surface">
                  {quiz.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  {quiz.description}
                </p>
              </button>
            );
          })}
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {saveMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {saveMessage}
          </div>
        ) : null}

        {loading || !settings ? (
          <div className="rounded-[1.5rem] bg-white p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
            Loading admin console...
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-8">
              <section className="rounded-[1.5rem] bg-white p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)] sm:p-10">
                <div className="flex flex-col gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                      Quiz Setup
                    </p>
                    <h2 className="mt-3 font-headline text-3xl font-extrabold text-on-surface">
                      {selectedQuiz.title}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void handleStartSelectedQuiz()}
                      disabled={updatingControl}
                      className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
                    >
                      {control.activeQuizId === selectedQuizId
                        ? "Quiz Running"
                        : updatingControl
                          ? "Updating..."
                          : "Start Quiz"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleStopQuiz()}
                      disabled={updatingControl || control.activeQuizId === null}
                      className="rounded-2xl border border-zinc-200 px-5 py-3 font-semibold text-on-surface disabled:opacity-50"
                    >
                      Stop Quiz
                    </button>
                    <button
                      type="button"
                      onClick={handleResetToPreset}
                      className="rounded-2xl border border-zinc-200 px-5 py-3 font-semibold text-on-surface"
                    >
                      Reset to Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSaveSettings()}
                      disabled={savingSettings}
                      className="rounded-2xl bg-primary px-6 py-3 font-semibold text-on-primary disabled:opacity-60"
                    >
                      {savingSettings ? "Saving..." : "Save Settings"}
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-on-surface">
                      Quiz Title
                    </span>
                    <input
                      value={settings.title}
                      onChange={(event) =>
                        handleSettingChange("title", event.target.value)
                      }
                      className="rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-primary"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-on-surface">
                      Duration (minutes)
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={settings.durationMinutes}
                      onChange={(event) =>
                        handleSettingChange(
                          "durationMinutes",
                          Number(event.target.value) || 1,
                        )
                      }
                      className="rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-primary"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-on-surface">
                      Question Count
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={settings.questionCount}
                      onChange={(event) =>
                        handleSettingChange(
                          "questionCount",
                          Number(event.target.value) || 1,
                        )
                      }
                      className="rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3">
                    <div>
                      <span className="block text-sm font-semibold text-on-surface">
                        Quiz Live
                      </span>
                      <span className="mt-1 block text-xs text-on-surface-variant">
                        Toggle public access for this quiz track.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.isLive}
                      onChange={(event) =>
                        handleSettingChange("isLive", event.target.checked)
                      }
                      className="h-5 w-5 accent-[var(--color-primary)]"
                    />
                  </label>

                  <label className="md:col-span-2 flex flex-col gap-2">
                    <span className="text-sm font-semibold text-on-surface">
                      Description
                    </span>
                    <textarea
                      value={settings.description}
                      onChange={(event) =>
                        handleSettingChange("description", event.target.value)
                      }
                      rows={4}
                      className="rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-primary"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-[1.5rem] bg-white p-8 shadow-[0_24px_60px_rgba(21,28,39,0.08)] sm:p-10">
                <div className="flex flex-col gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                      Questions Bank
                    </p>
                    <h2 className="mt-3 font-headline text-3xl font-extrabold text-on-surface">
                      20 questions for {selectedQuiz.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSaveQuestions()}
                    disabled={savingQuestions}
                    className="rounded-2xl bg-black px-6 py-3 font-semibold text-white disabled:opacity-60"
                  >
                    {savingQuestions ? "Saving..." : "Save Questions"}
                  </button>
                </div>

                <div className="mt-8 space-y-6">
                  {questions.map((question, questionIndex) => (
                    <article
                      key={question.id}
                      className="rounded-[1.5rem] border border-zinc-100 bg-surface-container-low p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                            Question {question.order}
                          </p>
                          <p className="mt-2 text-sm text-on-surface-variant">
                            Four options only. Select the correct answer below.
                          </p>
                        </div>
                        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-on-surface">
                          Correct: {String.fromCharCode(65 + question.correctOptionIndex)}
                        </div>
                      </div>

                      <div className="mt-5">
                        <textarea
                          value={question.prompt}
                          onChange={(event) =>
                            handleQuestionPromptChange(
                              questionIndex,
                              event.target.value,
                            )
                          }
                          rows={3}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none transition-colors focus:border-primary"
                        />
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {question.options.map((option, optionIndex) => {
                          const optionLabel = String.fromCharCode(65 + optionIndex);

                          return (
                            <div
                              key={`${question.id}-${optionLabel}`}
                              className="rounded-2xl border border-zinc-200 bg-white p-4"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-sm font-bold text-primary">
                                  Option {optionLabel}
                                </span>
                                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                                  Correct
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={
                                      question.correctOptionIndex === optionIndex
                                    }
                                    onChange={() =>
                                      handleCorrectOptionChange(
                                        questionIndex,
                                        optionIndex,
                                      )
                                    }
                                    className="h-4 w-4 accent-[var(--color-primary)]"
                                  />
                                </label>
                              </div>
                              <input
                                value={option}
                                onChange={(event) =>
                                  handleOptionChange(
                                    questionIndex,
                                    optionIndex,
                                    event.target.value,
                                  )
                                }
                                className="mt-3 w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-primary"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Attempts
                </p>
                <h2 className="mt-2 font-headline text-2xl font-extrabold text-on-surface">
                  {selectedQuiz.title}
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-surface-container-low p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                      Joined
                    </p>
                    <p className="mt-2 font-headline text-3xl font-bold text-on-surface">
                      {attempts.length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-surface-container-low p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                      Submitted
                    </p>
                    <p className="mt-2 font-headline text-3xl font-bold text-on-surface">
                      {completedAttempts.length}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => downloadAttemptsCsv(attempts)}
                  disabled={attempts.length === 0}
                  className="mt-6 w-full rounded-2xl bg-primary px-5 py-3 font-semibold text-on-primary disabled:opacity-50"
                >
                  Export CSV for Excel
                </button>
                <button
                  type="button"
                  onClick={() => void handleClearLeaderboard()}
                  disabled={clearingLeaderboard || attempts.length === 0}
                  className="mt-3 w-full rounded-2xl border border-red-200 px-5 py-3 font-semibold text-red-600 disabled:opacity-50"
                >
                  {clearingLeaderboard ? "Clearing..." : "Clear Leaderboard"}
                </button>
              </section>

              <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                      Live Leaderboard
                    </p>
                    <h2 className="mt-2 font-headline text-2xl font-extrabold text-on-surface">
                      {selectedQuiz.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Real Time
                  </span>
                </div>
                <a
                  href="#/leaderboard"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-black px-5 py-3 font-semibold text-white"
                >
                  Open Presentation Window
                </a>
                <div className="mt-5 space-y-3">
                  {attempts.length === 0 ? (
                    <div className="rounded-2xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                      No live attempt data yet for this quiz.
                    </div>
                  ) : (
                    attempts.slice(0, 10).map((attempt, index) => (
                      <div
                        key={attempt.id}
                        className="rounded-2xl border border-zinc-100 bg-surface-container-low px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-on-surface">
                                #{index + 1} {attempt.name}
                              </p>
                              <span
                                className={
                                  attempt.status === "completed"
                                    ? "rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700"
                                    : "rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700"
                                }
                              >
                                {attempt.status === "completed" ? "Finished" : "Live"}
                              </span>
                            </div>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                              {attempt.prn}
                            </p>
                            <p className="mt-1 text-xs text-on-surface-variant">
                              {attempt.answersCount}/{attempt.totalQuestions} answered
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-headline text-2xl font-extrabold text-primary">
                              {attempt.score}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {attempt.timeTakenSeconds}s
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Recent Participants
                </p>
                <div className="mt-5 space-y-3">
                  {attempts.length === 0 ? (
                    <div className="rounded-2xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                      No participants yet for this quiz.
                    </div>
                  ) : (
                    attempts.slice(0, 12).map((attempt) => (
                      <div
                        key={attempt.id}
                        className="rounded-2xl border border-zinc-100 bg-surface-container-low px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-on-surface">
                              {attempt.name}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                              {attempt.prn}
                            </p>
                          </div>
                          <span
                            className={
                              attempt.status === "completed"
                                ? "rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700"
                                : "rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700"
                            }
                          >
                            {attempt.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_rgba(21,28,39,0.08)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Workflow
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-on-surface-variant">
                  <li>Switch between Architect&apos;s Gambit and Hack&apos;n&apos;Crack.</li>
                  <li>Each quiz already starts with the 20 questions you gave.</li>
                  <li>Edit any prompt, option, or correct answer as needed.</li>
                  <li>Save the selected quiz back to Firebase.</li>
                  <li>Export the selected quiz attendance/results CSV anytime.</li>
                </ul>
              </section>
            </aside>
          </div>
        )}
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
