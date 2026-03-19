interface ConnectUpdate {
  readonly heading: string;
  readonly icon: string;
  readonly message: string;
  readonly activeUsers: string;
}

interface ConnectSectionProps {
  readonly title: string;
  readonly description: string;
  readonly cta: {
    readonly label: string;
    readonly href: string;
  };
  readonly update: ConnectUpdate;
}

export function ConnectSection({
  title,
  description,
  cta,
  update,
}: Readonly<ConnectSectionProps>) {
  return (
    <section className="relative overflow-hidden bg-inverse-surface py-16 text-inverse-on-surface sm:py-20 lg:py-24">
      <div className="absolute right-0 top-0 h-full w-1/3 translate-x-20 skew-x-12 bg-primary/10" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-10 sm:gap-12 md:flex-row">
          <div className="max-w-2xl">
            <h2 className="mb-5 font-headline text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mb-7 text-base leading-relaxed text-zinc-400 sm:mb-8 sm:text-lg">
              {description}
            </p>
            <a
              href={cta.href}
              className="inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-on-primary transition-all hover:bg-surface-tint sm:gap-4 sm:px-8 sm:py-4 sm:text-base"
            >
              {cta.label}
              <span className="material-symbols-outlined">hub</span>
            </a>
          </div>
          <div className="w-full max-w-[520px] md:w-[400px]">
            <div className="overflow-hidden rounded-[1.5rem] border border-zinc-700/50 bg-zinc-800 shadow-2xl backdrop-blur-sm">
              <div className="relative bg-[#161b22]">
                <img
                  src="/connect-image.png"
                  alt="GeeksforGeeks Connect showcase"
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
