import { siteContent } from "../data/mockData";

type ComingSoonVariant = "quiz" | "perks";

interface ComingSoonPageProps {
  readonly pageName: ComingSoonVariant;
}

const pageCopy: Record<
  ComingSoonVariant,
  {
    badge: string;
    titleAccent: string;
    description: string;
    ticker: readonly string[];
    primaryIcon: string;
    secondaryIcon: string;
    tertiaryIcon: string;
  }
> = {
  quiz: {
    badge: "Status: Quiz Engine Initializing",
    titleAccent: "Brewing.",
    description:
      "We are building a sharper quiz experience for the GFG DYPIU chapter with timed challenges, fresh problem sets, and a cleaner competitive flow.",
    ticker: [
      "Quiz Engine Booting",
      "Question Bank Syncing",
      "DSA Challenge Pipeline",
      "Leaderboard Calibration",
      "GFG DYPIU Quiz Arena",
      "Coming Soon",
    ],
    primaryIcon: "psychology",
    secondaryIcon: "emoji_objects",
    tertiaryIcon: "code_blocks",
  },
  perks: {
    badge: "Status: Perks Hub Initializing",
    titleAccent: "Brewing.",
    description:
      "We are curating the perks space for GFG DYPIU with chapter opportunities, curated resources, benefits, and exclusive student advantages worth coming back for.",
    ticker: [
      "Perks Hub Loading",
      "Benefits Curation in Progress",
      "Community Rewards Layer",
      "Member Access Pipeline",
      "GFG DYPIU Perks",
      "Coming Soon",
    ],
    primaryIcon: "workspace_premium",
    secondaryIcon: "redeem",
    tertiaryIcon: "auto_awesome",
  },
};

export function ComingSoonPage({ pageName }: Readonly<ComingSoonPageProps>) {
  const copy = pageCopy[pageName];

  return (
    <div className="min-h-screen bg-[#0b1117] text-[#dde3ee]">
      <main className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,219,138,0.16),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(71,163,89,0.14),transparent_28%),linear-gradient(180deg,#0b1117_0%,#0e141c_100%)]" />
        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />

        <section className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_16px_rgba(126,219,138,0.8)]" />
                <span className="font-label text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                  {copy.badge}
                </span>
              </div>

              <div className="mt-8 max-w-4xl">
                <h1 className="font-headline text-5xl font-extrabold leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl lg:text-[5.6rem]">
                  Something Great is{" "}
                  <span className="bg-gradient-to-r from-primary via-[#99f8a4] to-[#52c86a] bg-clip-text italic text-transparent">
                    {copy.titleAccent}
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#becabb] sm:text-lg md:text-xl">
                  {copy.description}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#/"
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-headline text-sm font-bold uppercase tracking-[0.12em] text-[#003913] transition-all duration-200 hover:scale-[1.02] hover:bg-[#99f8a4]"
                >
                  Back To Home
                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </a>
                <a
                  href="#/team"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-headline text-sm font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl transition-colors hover:border-primary/30 hover:text-primary"
                >
                  Meet The Team
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-[28rem]">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/8 bg-white/5 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
                  <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:18px_18px]" />
                  <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[1.6rem] border border-primary/20 bg-[linear-gradient(145deg,rgba(10,16,22,0.96),rgba(20,28,36,0.84))]">
                    <div className="absolute h-[78%] w-[78%] rounded-full border border-primary/15" />
                    <div className="absolute h-[54%] w-[54%] animate-[spin_24s_linear_infinite] rounded-full border border-dashed border-primary/20" />
                    <div className="absolute text-primary/10 animate-[spin_20s_linear_infinite]">
                      <span className="material-symbols-outlined text-[13rem] sm:text-[15rem]">
                        {copy.primaryIcon}
                      </span>
                    </div>
                    <div className="absolute text-primary/15 animate-[spin_34s_linear_infinite_reverse]">
                      <span className="material-symbols-outlined text-[16rem] sm:text-[18rem]">
                        {copy.secondaryIcon}
                      </span>
                    </div>
                    <div className="relative z-10 rounded-[1.4rem] border border-primary/30 bg-[#0e141c]/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontSize: "4rem", fontVariationSettings: "'FILL' 1" }}
                      >
                        {copy.tertiaryIcon}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 top-8 rounded-2xl border border-primary/20 bg-[#1b232d]/90 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:-right-7">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    code
                  </span>
                </div>
                <div className="absolute -left-4 bottom-10 rounded-2xl border border-primary/20 bg-[#1b232d]/90 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:-left-6">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    hub
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto mt-16 w-[calc(100%+2rem)] overflow-hidden border-y border-white/6 bg-black/25 py-5 sm:mt-20">
          <div className="flex min-w-max animate-[pulse_4s_ease-in-out_infinite] gap-10 px-8">
            {[...copy.ticker, ...copy.ticker].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="whitespace-nowrap font-label text-xs uppercase tracking-[0.38em] text-[#becabb]/80 sm:text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/6 bg-[#090f16] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          <div className="font-headline text-lg font-black tracking-[0.24em] text-primary">
            {siteContent.footer.brand}
          </div>
          <div className="text-center font-body text-xs uppercase tracking-[0.28em] text-[#becabb] sm:text-sm md:text-left">
            © 2026 GFG DYPIU Student Chapter. The Emerald Archive.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            <a
              href="#"
              className="text-xs uppercase tracking-[0.24em] text-[#becabb] transition-colors hover:text-primary sm:text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs uppercase tracking-[0.24em] text-[#becabb] transition-colors hover:text-primary sm:text-sm"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-xs uppercase tracking-[0.24em] text-[#becabb] transition-colors hover:text-primary sm:text-sm"
            >
              Guidelines
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
