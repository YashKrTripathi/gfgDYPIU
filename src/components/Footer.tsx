import type { NavLink } from "../data/mockData";

interface FooterProps {
  readonly brand: string;
  readonly copyright: string;
  readonly credit: string;
  readonly presentationLink: NavLink;
}

export function Footer({
  brand,
  copyright,
  credit,
  presentationLink,
}: Readonly<FooterProps>) {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 py-10 font-body">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 text-center sm:px-6 md:px-8">
        <span className="font-headline text-lg font-black text-zinc-900">
          {brand}
        </span>
        <p className="text-sm text-zinc-600">{copyright}</p>
        <a
          href={presentationLink.href}
          target={presentationLink.target}
          rel={presentationLink.rel}
          className="text-sm font-semibold text-primary transition-colors hover:text-green-700"
        >
          {presentationLink.label}
        </a>
        <p className="text-sm text-zinc-600">{credit}</p>
      </div>
    </footer>
  );
}
