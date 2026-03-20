import { useEffect, useState } from "react";

import type { NavLink } from "../data/mockData";

interface NavbarProps {
  readonly links: readonly NavLink[];
  readonly currentPage: "home" | "team" | "quiz" | "perks" | "admin" | "leaderboard";
}

export function Navbar({ links, currentPage }: Readonly<NavbarProps>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPage]);

  const brandLink = links[0];
  const navLinks = links.slice(1);

  return (
    <nav className="fixed inset-x-0 top-4 z-50 px-4 sm:top-5">
      <div className="mx-auto max-w-7xl">
        <div className="md:hidden">
          <div className="rounded-[1.75rem] border border-white/20 bg-black/75 px-5 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <a
                href={brandLink.href}
                className="flex items-center gap-3 text-primary"
              >
                <img
                  src="/gfg-logo.svg"
                  alt="GeeksforGeeks logo"
                  className="h-7 w-auto"
                />
                <span className="font-headline text-lg font-bold tracking-tight text-white">
                  DYPIU
                </span>
              </a>
              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="block h-0.5 w-6 rounded-full bg-current" />
                  <span className="block h-0.5 w-6 rounded-full bg-current" />
                  <span className="block h-0.5 w-6 rounded-full bg-current" />
                </div>
              </button>
            </div>
            {isMobileMenuOpen ? (
              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="flex flex-col gap-2">
                  <a
                    href={brandLink.href}
                    className={
                      currentPage === "home"
                        ? "rounded-2xl bg-white px-4 py-3 font-headline text-sm font-bold tracking-wide text-primary"
                        : "rounded-2xl px-4 py-3 font-headline text-sm font-semibold tracking-wide text-white/80 transition-colors hover:bg-white/8 hover:text-white"
                    }
                  >
                    Home
                  </a>
                  {navLinks.map((link) => {
                    const isActive =
                      (link.label === "Team" && currentPage === "team") ||
                      (link.label === "Quiz" && currentPage === "quiz") ||
                      (link.label === "Perks" && currentPage === "perks");

                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        className={
                          isActive
                            ? "rounded-2xl bg-white px-4 py-3 font-headline text-sm font-bold tracking-wide text-primary"
                            : "rounded-2xl px-4 py-3 font-headline text-sm font-semibold tracking-wide text-white/80 transition-colors hover:bg-white/8 hover:text-white"
                        }
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="hidden justify-center md:flex">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/30 px-3 py-2.5 shadow-[0_18px_48px_rgba(21,28,39,0.12)] backdrop-blur-[22px]">
            {links.map((link, index) => {
              const isBrand = index === 0;
              const isActive =
                (isBrand && currentPage === "home") ||
                (link.label === "Team" && currentPage === "team") ||
                (link.label === "Quiz" && currentPage === "quiz") ||
                (link.label === "Perks" && currentPage === "perks");
              const isBrandSecondary = isBrand && currentPage !== "home";

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={
                    isActive
                      ? "flex items-center gap-2 rounded-full border border-white/65 bg-white/80 px-5 py-3 font-headline text-[0.95rem] font-bold tracking-tight text-primary shadow-[0_10px_24px_rgba(21,28,39,0.1)] transition-all duration-200 hover:scale-[1.02]"
                      : isBrandSecondary
                        ? "flex items-center gap-2 rounded-full border border-white/70 bg-white px-5 py-3 font-headline text-[0.95rem] font-bold tracking-tight text-primary shadow-[0_10px_24px_rgba(21,28,39,0.12)] transition-all duration-200 hover:scale-[1.02]"
                        : isBrand
                          ? "flex items-center gap-2 rounded-full px-5 py-3 font-headline text-[0.95rem] font-bold tracking-tight text-primary transition-all duration-200 hover:bg-white/35 hover:scale-[1.02]"
                          : "rounded-full px-5 py-3 font-headline text-[0.95rem] font-semibold text-zinc-700 transition-all duration-200 hover:bg-white/35 hover:text-primary"
                  }
                >
                  {isBrand ? (
                    <>
                      <img
                        src="/gfg-logo.svg"
                        alt="GeeksforGeeks logo"
                        className="h-6 w-auto"
                      />
                      <span>{link.label}</span>
                    </>
                  ) : (
                    link.label
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
