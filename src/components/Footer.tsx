import type { NavLink } from "../data/mockData";

interface FooterProps {
  readonly brand: string;
  readonly copyright: string;
  readonly links: readonly NavLink[];
  readonly socialIcons: readonly string[];
}

export function Footer({
  brand,
  copyright,
  links,
  socialIcons,
}: Readonly<FooterProps>) {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 py-12 font-body text-xs font-medium uppercase tracking-wide">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <span className="text-lg font-black text-zinc-900">{brand}</span>
          <span className="normal-case tracking-normal text-zinc-500">
            {copyright}
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-zinc-500 transition-colors hover:text-green-600"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex gap-4">
          {socialIcons.map((icon) => (
            <button
              key={icon}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 opacity-80 transition-opacity hover:opacity-100"
            >
              <span className="material-symbols-outlined text-sm">{icon}</span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
