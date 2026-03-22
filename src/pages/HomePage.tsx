import { ConnectSection } from "../components/ConnectSection";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { HighlightsSection } from "../components/HighlightsSection";
import { PlatformIntroSection } from "../components/PlatformIntroSection";
import { siteContent } from "../data/mockData";

export function HomePage() {
  return (
    <div className="bg-background text-on-background">
      <main>
        <HeroSection
          eyebrow={siteContent.hero.eyebrow}
          title={siteContent.hero.title}
          highlightedWord={siteContent.hero.highlightedWord}
          description={siteContent.hero.description}
          primaryAction={siteContent.hero.primaryAction}
          secondaryAction={siteContent.hero.secondaryAction}
          image={siteContent.hero.image}
          statCard={siteContent.hero.statCard}
        />
        <PlatformIntroSection
          title={siteContent.platformIntro.title}
          subtitle={siteContent.platformIntro.subtitle}
          description={siteContent.platformIntro.description}
          slides={siteContent.platformIntro.slides}
          cta={siteContent.platformIntro.cta}
        />
        <HighlightsSection
          title={siteContent.highlights.title}
          cards={siteContent.highlights.cards}
        />
        <ConnectSection
          title={siteContent.connect.title}
          description={siteContent.connect.description}
          cta={siteContent.connect.cta}
          update={siteContent.connect.update}
        />
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
