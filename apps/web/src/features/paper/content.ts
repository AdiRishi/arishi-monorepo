export const sections = {
  about: "About",
  work: "Work",
  projects: "Projects",
  offclock: "Off the clock",
  contact: "Contact",
} as const;

export const email = "adishwar.rishi@gmail.com";

export const profiles = [
  { name: "GitHub", handle: "AdiRishi", href: "https://github.com/AdiRishi" },
  {
    name: "LinkedIn",
    handle: "Adishwar Rishi",
    href: "https://www.linkedin.com/in/adishwar-rishi-8a832498",
  },
  { name: "X", handle: "@AdishwarR", href: "https://x.com/AdishwarR" },
] as const;

export const roles = [
  {
    title: "Senior Software Engineer",
    company: "Airwallex",
    companyHref: "https://www.airwallex.com",
    dateTime: "2024",
    when: "2024 — now",
    where: "Sydney",
    description: "One year on Cards and spend management, then Yield.",
    tags: ["Cards", "Yield"],
  },
  {
    title: "Senior Software Engineer, Tech Lead for Escrow.com",
    company: "Freelancer",
    companyHref: "https://www.freelancer.com",
    dateTime: "2019",
    when: "2019 — 2024",
    where: "Sydney",
    description:
      "Led the engineering team for Escrow.com. I owned the backend services, the React front end and the AWS infrastructure.",
    tags: ["Python", "React", "AWS", "Postgres"],
  },
  {
    title: "Engineering Team Lead",
    company: "Freelancer",
    companyHref: "https://www.freelancer.com",
    dateTime: "2019-02",
    when: "2019",
    where: "Feb — Sep",
    description:
      "Managed ten engineers across two regions and took first call on production incidents.",
    tags: ["Leadership", "On-call"],
  },
  {
    title: "Software Engineer",
    company: "Freelancer",
    companyHref: "https://www.freelancer.com",
    dateTime: "2017",
    when: "2017 — 2019",
    where: "Sydney",
    description:
      "Rebuilt the internal escalation system end to end. I'd joined as an intern the year before.",
    tags: ["Python", "SQL", "React"],
  },
] as const;

export const projects = [
  {
    name: "Moss",
    href: "https://github.com/AdiRishi/moss-meditation",
    source: "https://github.com/AdiRishi/moss-meditation",
    description:
      "A meditation timer for iOS and Android, in development. Sessions end with a soft sound instead of an alarm, and your history stays on the phone.",
  },
  {
    name: "turborepo-remote-cache-cloudflare",
    href: "https://adirishi.github.io/turborepo-remote-cache-cloudflare/",
    source: "https://github.com/AdiRishi/turborepo-remote-cache-cloudflare",
    description:
      "A Turborepo remote cache you deploy to your own Cloudflare account. It stores artefacts in R2 or KV. This is my most-used project, with about 250 stars.",
  },
  {
    name: "cachified-adapter-cloudflare-kv",
    href: "https://www.npmjs.com/package/cachified-adapter-cloudflare-kv",
    source: "https://github.com/AdiRishi/cachified-adapter-cloudflare-kv",
    description:
      "The official Cloudflare KV adapter for @epic-web/cachified. It gets about 1,600 npm downloads a month.",
  },
  {
    name: "RenderMD",
    href: "https://www.render-md.com",
    source: "https://github.com/AdiRishi/render-md",
    description:
      "Paste markdown or a GitHub link and read it typeset, with math, Mermaid diagrams and code highlighting. Your documents never leave the browser.",
  },
  {
    name: "promptrc",
    href: "https://promptrc.app",
    source: "https://github.com/AdiRishi/promptrc",
    description:
      "A library for the AI prompts that worked, driven from the keyboard like a terminal app. Prompts can have fill-in blanks, and benchmarks record which models pass.",
  },
] as const;

export const pastimes = [
  {
    name: "Gaming",
    hindi: "खेल",
    drawing: "controller",
    lead: "Single-player games with a long story.",
    favourites: [
      { title: "The Witcher 3", credit: "CD Projekt Red, 2015" },
      { title: "Red Dead Redemption 2", credit: "Rockstar, 2018" },
      { title: "God of War", credit: "Santa Monica Studio, 2018" },
    ],
  },
  {
    name: "Anime",
    hindi: "कथा",
    drawing: "cat",
    lead: "Two I'd recommend.",
    favourites: [
      { title: "Vinland Saga", credit: "Wit Studio and MAPPA, 2019" },
      { title: "Attack on Titan", credit: "Wit Studio and MAPPA, 2013" },
    ],
  },
  {
    name: "The beach",
    hindi: "तट",
    drawing: "beach",
    lead: "Most weekends I'm at a beach.",
    favourites: [],
  },
] as const;
