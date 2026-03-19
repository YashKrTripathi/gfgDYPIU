import type { HighlightCard } from "../data/mockData";

interface HighlightsSectionProps {
  readonly title: string;
  readonly cards: readonly HighlightCard[];
}

const toneClasses: Record<HighlightCard["tone"], string> = {
  emerald:
    "from-emerald-500/20 via-emerald-400/10 to-white bg-white border-emerald-500/20",
  teal:
    "from-teal-500/20 via-cyan-400/10 to-white bg-white border-teal-500/20",
  blue: "from-sky-500/20 via-blue-400/10 to-white bg-white border-sky-500/20",
  violet:
    "from-violet-500/20 via-fuchsia-400/10 to-white bg-white border-violet-500/20",
  rose: "from-rose-500/20 via-orange-300/10 to-white bg-white border-rose-500/20",
  amber:
    "from-amber-400/25 via-yellow-200/10 to-white bg-white border-amber-400/20",
  slate:
    "from-slate-400/25 via-slate-300/10 to-white bg-white border-slate-400/25",
  indigo:
    "from-indigo-500/20 via-indigo-300/10 to-white bg-white border-indigo-500/20",
};

export function HighlightsSection({ title, cards }: Readonly<HighlightsSectionProps>) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-20">
        <div className="mb-10 sm:mb-16">
          <h2 className="mb-4 font-headline text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <div className="h-1 w-20 bg-primary" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`group flex min-h-[220px] flex-col justify-between rounded-[1.5rem] border bg-gradient-to-br p-5 shadow-[0_18px_45px_rgba(21,28,39,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(21,28,39,0.12)] sm:min-h-[250px] sm:rounded-[1.75rem] sm:p-7 ${toneClasses[card.tone]}`}
            >
              <div>
                <div className="mb-4 inline-flex rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:mb-6 sm:text-[11px]">
                  GFG Course
                </div>
                <h4 className="mb-3 font-headline text-xl font-bold leading-tight text-on-surface sm:text-2xl">
                  {card.title}
                </h4>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {card.description}
                </p>
              </div>
              <a
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 font-bold text-primary transition-transform group-hover:translate-x-1 sm:mt-8"
              >
                Explore Now
                <span className="material-symbols-outlined text-base">
                  open_in_new
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
