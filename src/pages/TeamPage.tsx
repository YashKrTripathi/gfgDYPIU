import type { NavLink, TeamDomainLead, TeamLeader, TeamMentor } from "../data/mockData";
import { siteContent } from "../data/mockData";

interface TeamPageProps {
  readonly footerBrand: string;
}

interface TeamFooterProps {
  readonly brand: string;
  readonly links: readonly NavLink[];
}

function TeamFooter({ brand, links }: Readonly<TeamFooterProps>) {
  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface-container-lowest px-4 py-10 sm:px-6 sm:py-12 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
        <div className="flex flex-col text-center md:text-left">
          <span className="mb-4 block font-headline text-lg font-bold text-primary">
            {brand}
          </span>
          <p className="text-sm text-on-surface-variant">
            (c) 2026 GFG DYPIU Student Chapter. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:col-span-2 md:justify-end md:gap-x-12 md:gap-y-6">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-on-surface-variant md:justify-end md:gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function MentorCard({ mentor }: Readonly<{ mentor: TeamMentor }>) {
  return (
    <div className="group w-full max-w-4xl overflow-hidden rounded-xl border border-black/10 bg-[#161b22] text-white shadow-[0_18px_50px_rgba(21,28,39,0.12)]">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-72 overflow-hidden sm:h-80 md:h-96 md:w-1/2">
          <img
            src={mentor.image.src}
            alt={mentor.image.alt}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e141c]/55 to-transparent md:bg-gradient-to-r" />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8 md:w-1/2 md:p-10">
          <h3 className="mb-2 font-headline text-2xl font-bold text-white sm:text-3xl">
            {mentor.name}
          </h3>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:mb-6 sm:text-sm">
            {mentor.role}
          </p>
          <p className="mb-7 text-base italic leading-relaxed text-white/72 sm:mb-8 sm:text-lg">
            {mentor.quote}
          </p>
          <div className="flex space-x-4">
            {mentor.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-primary transition-all hover:bg-primary hover:text-on-primary"
              >
                <span className="material-symbols-outlined">{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadershipCard({ leader }: Readonly<{ leader: TeamLeader }>) {
  return (
    <div className="team-flip-card min-h-[360px]">
      <div className="team-flip-card-inner">
        <div className="team-flip-face team-flip-front flex flex-col items-center justify-center rounded-xl border border-black/10 bg-[#161b22] p-6 text-center text-white shadow-[0_18px_50px_rgba(21,28,39,0.08)] sm:p-8">
          <div className="mb-5 h-36 w-36 overflow-hidden rounded-full border-4 border-primary/15 p-1 sm:mb-6 sm:h-40 sm:w-40">
            <img
              src={leader.image.src}
              alt={leader.image.alt}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <h3 className="font-headline text-xl font-bold text-white sm:text-2xl">
            {leader.name}
          </h3>
          <p className="mb-4 mt-2 text-xs font-medium uppercase tracking-widest text-primary">
            {leader.role}
          </p>
          <p className="max-w-xs text-sm text-white/72">{leader.description}</p>
        </div>
        <div className="team-flip-face team-flip-back overflow-hidden rounded-xl border border-black/10 bg-[#161b22] shadow-[0_18px_50px_rgba(21,28,39,0.08)]">
          <div className="relative h-full w-full">
            <img
              src={leader.image.src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-35 blur-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/28 to-black/32" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={leader.image.src}
                alt={leader.image.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-left text-white">
              <h3 className="font-headline text-2xl font-bold">{leader.name}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-fixed">
                {leader.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DomainLeadCard({ lead }: Readonly<{ lead: TeamDomainLead }>) {
  return (
    <div className="team-flip-card min-h-[250px]">
      <div className="team-flip-card-inner">
        <div className="team-flip-face team-flip-front flex h-full flex-col items-center justify-center rounded-xl border border-black/10 bg-[#161b22] p-5 text-center text-white transition-colors hover:border-primary/30 hover:bg-[#1d242d] sm:p-6">
          <div className="mb-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border border-primary/15 p-1 sm:h-28 sm:w-28">
            <img
              src={lead.image.src}
              alt={lead.image.alt}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <h4 className="text-base font-bold text-white">{lead.name}</h4>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
            {lead.role}
          </p>
        </div>
        <div className="team-flip-face team-flip-back overflow-hidden rounded-xl border border-black/10 bg-[#161b22]">
          <div className="relative h-full w-full">
            <img
              src={lead.image.src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-35 blur-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/28 to-black/35" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={lead.image.src}
                alt={lead.image.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
              <h4 className="font-headline text-lg font-bold">{lead.name}</h4>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-fixed">
                {lead.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamPage({ footerBrand }: Readonly<TeamPageProps>) {
  const { teamPage } = siteContent;

  return (
    <div className="min-h-screen bg-background font-body text-on-surface">
      <main className="pb-16 pt-28 sm:pb-20 sm:pt-32">
        <section className="mx-auto mb-16 max-w-7xl px-4 sm:mb-20 sm:px-6 md:mb-24">
          <div className="grid grid-cols-1 items-end gap-6 sm:gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-primary">
                {teamPage.eyebrow}
              </span>
              <h1 className="mb-5 font-headline text-4xl font-extrabold leading-none tracking-tighter text-on-surface sm:mb-6 sm:text-5xl md:text-7xl">
                Meet the <span className="text-primary">Visionaries</span>.
              </h1>
            </div>
            <div className="border-l-2 border-primary pb-1 pl-4 sm:pb-2 sm:pl-6 md:col-span-5">
              <p className="text-base leading-relaxed text-on-surface-variant sm:text-lg">
                {teamPage.description}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-16 px-4 sm:space-y-20 sm:px-6 md:space-y-24">
          <div className="flex flex-col items-center">
            <h2 className="mb-8 inline-flex min-w-[210px] items-center justify-center rounded-lg bg-black px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#00c853] shadow-[0_10px_24px_rgba(21,28,39,0.14)]">
              Faculty Mentor
            </h2>
            <MentorCard mentor={teamPage.mentor} />
          </div>

          <div>
            <div className="mb-10 flex justify-center">
              <h2 className="inline-flex min-w-[240px] items-center justify-center rounded-lg bg-black px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#00c853] shadow-[0_10px_24px_rgba(21,28,39,0.14)]">
                Chapter Leadership
              </h2>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {teamPage.leadership.map((leader) => (
                <LeadershipCard key={leader.name} leader={leader} />
              ))}
            </div>
          </div>

          <div className="pb-12 sm:pb-16 md:pb-20">
            <div className="mb-10 flex justify-center">
              <h2 className="inline-flex min-w-[210px] items-center justify-center rounded-lg bg-black px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#00c853] shadow-[0_10px_24px_rgba(21,28,39,0.14)]">
                Domain Leads
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamPage.domainLeads.map((lead) => (
                <DomainLeadCard key={lead.name} lead={lead} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <TeamFooter brand={footerBrand} links={teamPage.footerLinks} />
    </div>
  );
}
