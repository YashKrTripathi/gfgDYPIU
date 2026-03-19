import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { TeamPage } from "./pages/TeamPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { siteContent } from "./data/mockData";

type AppPage = "home" | "team" | "quiz" | "perks";

function getCurrentPageFromHash(hash: string): AppPage {
  if (hash.startsWith("#/team")) {
    return "team";
  }

  if (hash.startsWith("#/quiz")) {
    return "quiz";
  }

  if (hash.startsWith("#/perks")) {
    return "perks";
  }

  return "home";
}

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() =>
    getCurrentPageFromHash(window.location.hash),
  );

  useEffect(() => {
    const syncPageWithHash = () => {
      setCurrentPage(getCurrentPageFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", syncPageWithHash);

    return () => window.removeEventListener("hashchange", syncPageWithHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [currentPage]);

  return (
    <div className="overflow-x-hidden antialiased">
      <Navbar links={siteContent.navbarItems} currentPage={currentPage} />
      {currentPage === "team" ? (
        <TeamPage footerBrand={siteContent.footer.brand} />
      ) : currentPage === "quiz" ? (
        <ComingSoonPage pageName="quiz" />
      ) : currentPage === "perks" ? (
        <ComingSoonPage pageName="perks" />
      ) : (
        <HomePage />
      )}
    </div>
  );
}

export default App;
