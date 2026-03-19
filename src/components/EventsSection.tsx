import type { EventItem } from "../data/mockData";

interface EventsSectionProps {
  readonly title: string;
  readonly description: string;
  readonly viewAllLabel: string;
  readonly events: readonly EventItem[];
}

export function EventsSection({
  title,
  description,
  viewAllLabel,
  events,
}: Readonly<EventsSectionProps>) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-on-surface-variant">{description}</p>
          </div>
          <button
            type="button"
            className="hidden border-b-2 border-primary/20 pb-1 font-bold text-primary transition-all hover:border-primary md:block"
          >
            {viewAllLabel}
          </button>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={`${event.day}-${event.title}`}
              className="group flex flex-col items-center gap-6 rounded-2xl border-b border-outline-variant/30 p-6 transition-all hover:bg-surface-container-low md:flex-row md:border-b-0"
            >
              <div className="flex w-20 shrink-0 flex-col text-center">
                <span className="font-headline text-3xl font-black text-primary">
                  {event.day}
                </span>
                <span className="font-label text-xs font-bold uppercase text-on-surface-variant">
                  {event.month}
                </span>
              </div>
              <div className="grow">
                <h4 className="mb-1 font-headline text-xl font-bold">
                  {event.title}
                </h4>
                <p className="text-sm text-on-surface-variant">
                  {event.description}
                </p>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-lg">
                    schedule
                  </span>
                  {event.time}
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-surface-container-highest px-6 py-2 font-bold text-on-surface-variant transition-all group-hover:bg-primary group-hover:text-on-primary"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
