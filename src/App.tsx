import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { TeamPage } from "./pages/TeamPage";
import { QuizPage } from "./pages/QuizPage";
import { PerksPage } from "./pages/PerksPage";
import { AdminPage } from "./pages/AdminPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { siteContent } from "./data/mockData";

type AppPage = "home" | "team" | "quiz" | "perks" | "admin" | "leaderboard";

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

  if (hash.startsWith("#/admin")) {
    return "admin";
  }

  if (hash.startsWith("#/leaderboard")) {
    return "leaderboard";
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
      {currentPage !== "leaderboard" ? (
        <Navbar links={siteContent.navbarItems} currentPage={currentPage} />
      ) : null}
      {currentPage === "team" ? (
        <TeamPage footerBrand={siteContent.footer.brand} />
      ) : currentPage === "quiz" ? (
        <QuizPage />
      ) : currentPage === "perks" ? (
        <PerksPage />
      ) : currentPage === "admin" ? (
        <AdminPage />
      ) : currentPage === "leaderboard" ? (
        <LeaderboardPage />
      ) : (
        <HomePage />
      )}
    </div>
  );
}

export default App;
