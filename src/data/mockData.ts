export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export interface CallToAction {
  readonly label: string;
  readonly href: string;
}

export interface ImageAsset {
  readonly src: string;
  readonly alt: string;
}

export interface CarouselSlide {
  readonly src: string;
  readonly alt: string;
}

export interface StatCard {
  readonly icon: string;
  readonly eyebrow: string;
  readonly value: string;
  readonly description: string;
}

export interface HighlightCard {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly tone:
    | "emerald"
    | "teal"
    | "blue"
    | "violet"
    | "rose"
    | "amber"
    | "slate"
    | "indigo";
}

export interface EventItem {
  readonly day: string;
  readonly month: string;
  readonly title: string;
  readonly description: string;
  readonly time: string;
}

export interface TeamAction {
  readonly label: string;
  readonly href: string;
}

export interface TeamSocialLink {
  readonly icon: string;
  readonly href: string;
  readonly label: string;
}

export interface TeamMentor {
  readonly name: string;
  readonly role: string;
  readonly quote: string;
  readonly image: ImageAsset;
  readonly links: readonly TeamSocialLink[];
}

export interface TeamLeader {
  readonly name: string;
  readonly role: string;
  readonly description: string;
  readonly image: ImageAsset;
}

export interface TeamDomainLead {
  readonly name: string;
  readonly role: string;
  readonly image: ImageAsset;
}

export const siteContent = {
  brand: "GFG DYPIU",
  navigationLinks: [
    { label: "Team", href: "#/team" },
    { label: "Quiz", href: "#/quiz" },
    { label: "Perks", href: "#/perks" },
  ] satisfies readonly NavLink[],
  navbarItems: [
    { label: "DYPIU", href: "#/" },
    { label: "Team", href: "#/team" },
    { label: "Quiz", href: "#/quiz" },
    { label: "Perks", href: "#/perks" },
  ] satisfies readonly NavLink[],
  hero: {
    eyebrow: "Established at DY Patil International University",
    title: "The Future of Engineering is Collaborative.",
    highlightedWord: "Engineering",
    description:
      "GeeksforGeeks Student Chapter at DYPIU is where technical mastery meets professional excellence. Join a community of architects building the next generation of tech.",
    primaryAction: { label: "Join Now", href: "#" },
    secondaryAction: { label: "View Perks", href: "#/perks" },
    image: {
      src: "/dypiu-campus-about.jpg",
      alt: "DY Patil International University Pune entrance gate",
    },
    statCard: {
      icon: "terminal",
      eyebrow: "Active Members",
      value: "500+",
      description: "Students actively contributing to open source.",
    },
  },
  platformIntro: {
    title: "GEEKS FOR GEEKS",
    subtitle: "Platform Power",
    description:
      "Access a vast repository of data structures, algorithms, and technical tutorials. GeeksforGeeks is the world's most trusted resource for computer science enthusiasts. From DSA to Machine Learning, we bring the best of GFG straight to our campus.",
    slides: [
      {
        src: "/screenshots/slide-1.jpeg",
        alt: "GeeksforGeeks screenshot 1",
      },
      {
        src: "/screenshots/slide-2.jpeg",
        alt: "GeeksforGeeks screenshot 2",
      },
      {
        src: "/screenshots/slide-3.jpeg",
        alt: "GeeksforGeeks screenshot 3",
      },
      {
        src: "/screenshots/slide-4.jpeg",
        alt: "GeeksforGeeks screenshot 4",
      },
      {
        src: "/screenshots/slide-5.jpeg",
        alt: "GeeksforGeeks screenshot 5",
      },
    ] satisfies readonly CarouselSlide[],
    cta: {
      label: "Explore GeeksforGeeks",
      href: "https://geeksforgeeks.org",
    },
  },
  highlights: {
    title: "GFG Course Highlight",
    cards: [
      {
        title: "GFG Classroom Program",
        description:
          "Structured offline-first learning tracks for students who want guided classroom support.",
        href: "https://www.geeksforgeeks.org/courses/offline-courses?_gl=1*syc9f8*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwve7NBhC-ARIsALZy9HUjFTkaOxhvojtrJ7nE9G7-OcdDdTTPrHEZUQetA36CHgHfmn3PdvoaAttUEALw_wcB&gbraid=0AAAAAC9yBkAL7Dwu0QLy1Eq9ly3VLxjxA",
        tone: "emerald",
      },
      {
        title: "DSA / Placements",
        description:
          "Interview-focused DSA and placement preparation courses built for coding rounds and hiring success.",
        href: "https://www.geeksforgeeks.org/courses/category/dsa-placements?_gl=1*syc9f8*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwve7NBhC-ARIsALZy9HUjFTkaOxhvojtrJ7nE9G7-OcdDdTTPrHEZUQetA36CHgHfmn3PdvoaAttUEALw_wcB&gbraid=0AAAAAC9yBkAL7Dwu0QLy1Eq9ly3VLxjxA",
        tone: "teal",
      },
      {
        title: "GATE Prep",
        description:
          "Goal-driven preparation resources for competitive exams with technical depth and practice support.",
        href: "https://www.geeksforgeeks.org/courses/category/gate?_gl=1*1h71ofg*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwve7NBhC-ARIsALZy9HUjFTkaOxhvojtrJ7nE9G7-OcdDdTTPrHEZUQetA36CHgHfmn3PdvoaAttUEALw_wcB&gbraid=0AAAAAC9yBkAL7Dwu0QLy1Eq9ly3VLxjxA",
        tone: "indigo",
      },
      {
        title: "Data Analytics / Data Science",
        description:
          "Learn analytics, visualization, statistics, and modern data science workflows in one category.",
        href: "https://www.geeksforgeeks.org/courses/category/data-analytics-data-science?_gl=1*1h71ofg*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwve7NBhC-ARIsALZy9HUjFTkaOxhvojtrJ7nE9G7-OcdDdTTPrHEZUQetA36CHgHfmn3PdvoaAttUEALw_wcB&gbraid=0AAAAAC9yBkAL7Dwu0QLy1Eq9ly3VLxjxA",
        tone: "blue",
      },
      {
        title: "Development",
        description:
          "Explore development and testing pathways across web, backend, and software engineering workflows.",
        href: "https://www.geeksforgeeks.org/courses/category/development-testing?_gl=1*1h71ofg*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwve7NBhC-ARIsALZy9HUjFTkaOxhvojtrJ7nE9G7-OcdDdTTPrHEZUQetA36CHgHfmn3PdvoaAttUEALw_wcB&gbraid=0AAAAAC9yBkAL7Dwu0QLy1Eq9ly3VLxjxA",
        tone: "rose",
      },
      {
        title: "Cloud / DevOps",
        description:
          "Master deployment pipelines, cloud systems, automation, and production-oriented engineering skills.",
        href: "https://www.geeksforgeeks.org/courses/category/cloud-devops?_gl=1*yn0xd1*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwve7NBhC-ARIsALZy9HUjFTkaOxhvojtrJ7nE9G7-OcdDdTTPrHEZUQetA36CHgHfmn3PdvoaAttUEALw_wcB&gbraid=0AAAAAC9yBkAL7Dwu0QLy1Eq9ly3VLxjxA",
        tone: "amber",
      },
      {
        title: "Programming Languages",
        description:
          "Build strong fundamentals across languages with guided tracks for syntax, problem solving, and practice.",
        href: "https://www.geeksforgeeks.org/courses/category/programming-languages?_gl=1*1h71ofg*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwve7NBhC-ARIsALZy9HUjFTkaOxhvojtrJ7nE9G7-OcdDdTTPrHEZUQetA36CHgHfmn3PdvoaAttUEALw_wcB&gbraid=0AAAAAC9yBkAL7Dwu0QLy1Eq9ly3VLxjxA",
        tone: "slate",
      },
      {
        title: "All Courses",
        description:
          "Browse the full GeeksforGeeks course catalog and explore every learning path from one place.",
        href: "https://www.geeksforgeeks.org/courses?_gl=1*1h71ofg*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwve7NBhC-ARIsALZy9HUjFTkaOxhvojtrJ7nE9G7-OcdDdTTPrHEZUQetA36CHgHfmn3PdvoaAttUEALw_wcB&gbraid=0AAAAAC9yBkAL7Dwu0QLy1Eq9ly3VLxjxA",
        tone: "violet",
      },
    ] satisfies readonly HighlightCard[],
  },
  connect: {
    title: "GEEKS FOR GEEKS CONNECT",
    description:
      "Stay updated with our community's heartbeat. Access resources, find project partners, and engage with technical discussions globally. The portal connects every DYPIU geek to the broader GFG ecosystem.",
    cta: {
      label: "CONNECT PORTAL",
      href: "https://www.geeksforgeeks.org/connect",
    },
    update: {
      heading: "LATEST UPDATE",
      icon: "campaign",
      message: 'New "Tech Roadmap 2026" released on the GFG portal.',
      activeUsers: "2,401 users active now",
    },
  },
  events: {
    title: "Upcoming Events",
    description: "Mark your calendars for technical growth.",
    viewAllLabel: "See All Events",
    items: [
      {
        day: "24",
        month: "OCT",
        title: "Web Architecture & Scalability",
        description: "Tech Talk by Industry Experts from Google.",
        time: "14:00 IST",
      },
      {
        day: "02",
        month: "NOV",
        title: "The Logic Puzzle: DSA Quiz",
        description: "A competitive coding sprint for beginners.",
        time: "10:30 IST",
      },
    ] satisfies readonly EventItem[],
  },
  footer: {
    brand: "GFG DYPIU",
    copyright:
      "(c) 2026 GFG Student Chapter DYPIU. Built for the Architect.",
    links: [
      { label: "GFG Main", href: "#" },
      { label: "DYPIU Portal", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Terms", href: "#" },
    ] satisfies readonly NavLink[],
    socialIcons: ["share", "mail"] as const,
  },
  teamPage: {
    eyebrow: "The Architects",
    title: "Meet the Visionaries.",
    highlightedWord: "Visionaries",
    description:
      "Our team is a diverse collective of student developers, designers, and strategists at DYPIU dedicated to bridging the gap between academic theory and industry reality.",
    mentor: {
      name: "Ms. Mrunmayee Rahate",
      role: "Faculty Coordinator & Mentor",
      quote:
        '"Guiding the next generation of engineers to solve real-world problems with elegance and efficiency."',
      image: {
        src: "/team/mrunmayee-placeholder.svg",
        alt: "Mrunmayee Rahate portrait placeholder",
      },
      links: [
        {
          icon: "school",
          href: "https://www.dypiu.ac.in/",
          label: "DYPIU",
        },
        {
          icon: "link",
          href: "https://www.geeksforgeeks.org/",
          label: "GeeksforGeeks",
        },
      ] satisfies readonly TeamSocialLink[],
    } satisfies TeamMentor,
    leadership: [
      {
        name: "Yash Kumar",
        role: "GFG Club Lead",
        description:
          "Full-stack architect overseeing chapter growth and technical vision.",
        image: {
          src: "/team/yash-kumar.jpeg",
          alt: "Yash Kumar portrait",
        },
      },
      {
        name: "Harsh Barot",
        role: "Club Co-Lead",
        description:
          "Competitive programming lead managing operations and internal training.",
        image: {
          src: "/team/harsh.jpeg",
          alt: "Harsh Barot portrait",
        },
      },
    ] satisfies readonly TeamLeader[],
    domainLeads: [
      {
        name: "Yogita Kanwar",
        role: "AI/ML Lead",
        image: {
          src: "/team/yogita.jpeg",
          alt: "Yogita Kanwar portrait",
        },
      },
      {
        name: "Azka Kaleem",
        role: "WebDev Frontend Lead",
        image: {
          src: "/team/azka.jpeg",
          alt: "Azka Kaleem portrait",
        },
      },
      {
        name: "Yash Tripathi",
        role: "WebDev Fullstack Lead",
        image: {
          src: "/team/yash-tripathi.jpeg",
          alt: "Yash Tripathi portrait",
        },
      },
      {
        name: "Mohinish Kashyap",
        role: "Cloud Computing",
        image: {
          src: "/team/mohinish.jpeg",
          alt: "Mohinish Kashyap portrait",
        },
      },
      {
        name: "Yashika Verma",
        role: "Data Analytics",
        image: {
          src: "/team/yashika.jpeg",
          alt: "Yashika Verma portrait",
        },
      },
      {
        name: "Mohit Prashant Patil",
        role: "DSA & CP Lead",
        image: {
          src: "/team/mohit.jpeg",
          alt: "Mohit Prashant Patil portrait",
        },
      },
    ] satisfies readonly TeamDomainLead[],
    cta: {
      title: "Want to build something great together?",
      description:
        "We are always looking for passionate individuals to join our core team or contribute as volunteers. Whether you code, design, or organize, there's a place for you.",
      primaryAction: {
        label: "Apply for Core Team",
        href: "https://www.geeksforgeeks.org/connect",
      },
      secondaryAction: {
        label: "Become a Volunteer",
        href: "https://www.geeksforgeeks.org/",
      },
    },
    footerLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Code of Conduct", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Archive", href: "#" },
    ] satisfies readonly NavLink[],
  },
} as const;
