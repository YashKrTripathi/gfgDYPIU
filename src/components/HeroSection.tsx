import type { CallToAction, ImageAsset, StatCard } from "../data/mockData";

interface HeroSectionProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly highlightedWord: string;
  readonly description: string;
  readonly primaryAction: CallToAction;
  readonly secondaryAction: CallToAction;
  readonly image: ImageAsset;
  readonly statCard: StatCard;
}

export function HeroSection({
  eyebrow,
  title,
  highlightedWord,
  description,
  primaryAction,
  secondaryAction,
  image,
}: Readonly<HeroSectionProps>) {
  const [beforeHighlight, afterHighlight] = title.split(highlightedWord);

  return (
    <section className="relative flex min-h-[720px] items-center overflow-hidden px-4 pb-14 pt-28 sm:min-h-[780px] sm:px-6 sm:pt-32 lg:min-h-[921px] lg:px-20">
      <div className="absolute inset-0 z-0">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover object-[58%_center] grayscale sm:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.56)_36%,rgba(0,0,0,0.3)_68%,rgba(0,0,0,0.18)_100%)]" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-center">
        <div className="flex w-full max-w-6xl flex-col items-center justify-center text-center">
          <div className="w-full">
            <h1 className="mb-6 font-headline text-[2.8rem] font-extrabold leading-[0.98] tracking-tighter text-white sm:mb-8 sm:text-6xl md:text-7xl">
              {beforeHighlight}
              <span className="mr-[0.18em] inline-block text-primary-fixed italic">
                {highlightedWord}
              </span>
              <span>{afterHighlight.trimStart()}</span>
            </h1>
            <p className="mx-auto mb-8 max-w-4xl rounded-[1.25rem] border border-primary-fixed/20 bg-black/22 px-4 py-4 font-body text-base leading-relaxed text-primary-fixed shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-lg sm:mb-10 sm:rounded-[1.5rem] sm:px-6 sm:py-5 sm:text-lg md:px-8">
              {description}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href={primaryAction.href}
                className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-6 py-3.5 text-base font-semibold text-on-primary transition-all active:scale-95 sm:px-8 sm:py-4"
              >
                {primaryAction.label}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </a>
              <a
                href={secondaryAction.href}
                className="rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-center text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/18 sm:px-8 sm:py-4"
              >
                {secondaryAction.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
