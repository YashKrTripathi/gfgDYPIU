import { Footer } from "../components/Footer";
import { useTouchFlipCard } from "../hooks/useTouchFlipCard";
import { siteContent } from "../data/mockData";

const featuredPerkBenefits = [
  {
    icon: "all_inclusive",
    title: "Lifetime access",
    description: "Learn at your own pace",
  },
  {
    icon: "verified",
    title: "Certificate",
    description: "Official completion credentials",
  },
  {
    icon: "terminal",
    title: "Hands-on projects",
    description: "Real-world implementation",
  },
  {
    icon: "group",
    title: "Expert Support",
    description: "GFG mentor community",
  },
] as const;

export function PerksPage() {
  const {
    isTouchDevice,
    isFlipped,
    showHint,
    toggleFlip,
    handleTouchEnd,
    handleKeyDown,
  } = useTouchFlipCard();

  return (
    <div className="bg-surface font-body text-on-surface">
      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,107,42,0.08),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(39,133,63,0.08),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-6">
              <span className="mb-4 block font-label text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Exclusive Membership Benefits
              </span>
              <h1 className="mb-6 font-headline text-4xl font-extrabold leading-none tracking-[-0.05em] text-on-surface sm:text-6xl md:mb-8 md:text-7xl">
                The{" "}
                <span className="bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent">
                  Architect&apos;s
                </span>{" "}
                <br />
                Toolkit
              </h1>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg md:mb-10 md:text-xl">
                Access industry-leading resources, premium GeeksforGeeks
                courses, and career-defining opportunities curated specifically
                for the DYPIU technical community.
              </p>
              <a
                href="https://www.geeksforgeeks.org/courses/mongodb-overview"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full justify-center rounded-lg bg-gradient-to-br from-primary to-primary-container px-6 py-4 text-center font-headline text-base font-bold text-on-primary shadow-lg transition-opacity hover:opacity-90 sm:w-auto sm:px-8"
              >
                Explore Perk
              </a>
            </div>

            <div className="md:col-span-6">
              <div
                className={`perks-flip-card relative mx-auto aspect-[16/10] max-w-xl sm:aspect-[16/9] md:mx-0 md:max-w-none md:aspect-[1.65/1] ${isFlipped ? "touch-flipped" : ""} ${showHint ? "flip-hint" : ""} ${isTouchDevice ? "cursor-pointer" : ""}`}
                onClick={isTouchDevice ? undefined : toggleFlip}
                onTouchEnd={handleTouchEnd}
                onKeyDown={handleKeyDown}
                role={isTouchDevice ? "button" : undefined}
                tabIndex={isTouchDevice ? 0 : undefined}
                aria-label={isTouchDevice ? "Flip MongoDB perk card" : undefined}
              >
                <div className="perks-flip-card-inner rounded-[1.75rem] shadow-[0_30px_80px_rgba(21,28,39,0.12)]">
                  <div className="perks-flip-face perks-flip-front overflow-hidden rounded-[1.75rem]">
                    <img
                      src="/perks-hero-mongodb.webp"
                      alt="MongoDB partner thumbnail"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="perks-flip-face perks-flip-back overflow-hidden rounded-[1.75rem]">
                    <img
                      src="/perks-hero-hover.jfif"
                      alt="MongoDB partner hover preview"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="featured"
          className="bg-surface-container-low px-4 py-16 sm:px-6 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 md:mb-16">
              <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                Featured Perk
              </h2>
              <div className="mt-4 h-1.5 w-20 rounded-full bg-primary" />
            </div>

            <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl shadow-on-surface/5">
              <div className="flex flex-col justify-center p-6 sm:p-8 md:p-16 lg:p-20">
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-primary">
                    Available Now
                  </span>
                  <span className="text-xs text-on-surface-variant/40">
                    &bull;
                  </span>
                  <span className="text-sm font-medium text-on-surface-variant">
                    GeeksforGeeks Academic Partner
                  </span>
                </div>

                <h3 className="mb-5 font-headline text-3xl font-extrabold leading-tight text-on-surface sm:text-4xl md:mb-6 md:text-5xl">
                  MongoDB Self-Paced Course
                </h3>

                <p className="mb-8 text-base leading-relaxed text-on-surface-variant sm:text-lg md:mb-10">
                  Master MongoDB, the leading NoSQL database, with this
                  comprehensive self-paced course designed by industry experts
                  at GeeksforGeeks. Build scalable, high-performance
                  applications with ease.
                </p>

                <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:mb-12 md:gap-6">
                  {featuredPerkBenefits.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="flex items-start gap-4 rounded-xl bg-surface-container-low p-4 sm:p-5"
                    >
                      <span className="material-symbols-outlined rounded-lg bg-primary-fixed-dim/20 p-2 text-primary">
                        {benefit.icon}
                      </span>
                      <div>
                        <p className="font-headline text-sm font-bold text-on-surface">
                          {benefit.title}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <a
                    href="https://www.geeksforgeeks.org/courses/category/mongodb?courseFeeType=free"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full rounded-lg bg-gradient-to-br from-primary to-primary-container px-8 py-4 text-center font-headline text-base font-extrabold text-on-primary shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02] sm:w-auto sm:px-10 sm:py-5 sm:text-lg"
                  >
                    Claim More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        brand={siteContent.footer.brand}
        copyright={siteContent.footer.copyright}
        credit={siteContent.footer.credit}
        presentationLink={siteContent.footer.presentationLink}
      />
    </div>
  );
}
