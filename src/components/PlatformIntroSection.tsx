import { useEffect, useState } from "react";
import type { CallToAction, CarouselSlide } from "../data/mockData";

interface PlatformIntroSectionProps {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly slides: readonly CarouselSlide[];
  readonly cta: CallToAction;
}

export function PlatformIntroSection({
  title,
  subtitle,
  description,
  slides,
  cta,
}: Readonly<PlatformIntroSectionProps>) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-surface-container-low py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:flex-row md:gap-16">
          <div className="w-full md:w-1/2">
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-primary-container opacity-20 blur transition duration-1000 group-hover:opacity-40" />
              <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-950 shadow-2xl">
                <div
                  className="flex h-full transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {slides.map((slide) => (
                    <div
                      key={slide.src}
                      className="flex h-full w-full shrink-0 items-center justify-center bg-[#0b0d10] p-2 sm:p-3"
                    >
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent px-3 pb-3 pt-10 sm:px-5 sm:pb-4">
                  <div className="flex gap-2">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.src}
                        type="button"
                        aria-label={`Go to slide ${index + 1}`}
                        onClick={() => setActiveSlide(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activeSlide
                            ? "w-8 bg-primary"
                            : "w-2.5 bg-white/55 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="hidden rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md sm:inline-flex">
                    Auto Scroll
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="mb-2 font-label text-sm font-bold uppercase text-primary">
              {subtitle}
            </h2>
            <h3 className="mb-5 font-headline text-3xl font-extrabold tracking-tight sm:text-4xl">
              {title}
            </h3>
            <p className="mb-7 text-sm leading-relaxed text-on-surface-variant sm:mb-8 sm:text-base">
              {description}
            </p>
            <a
              href={cta.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 font-bold text-primary"
            >
              {cta.label}
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                open_in_new
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
