export const sections = {
  about: { name: "About", hindi: "परिचय" },
  work: { name: "Work", hindi: "कार्य" },
  projects: { name: "Projects", hindi: "रचना" },
  contact: { name: "Contact", hindi: "संपर्क" },
  ps: { name: "P.S.", hindi: "पुनश्च" },
} as const;

export const name = { latin: "Adishwar Rishi", devanagari: "आदीश्वर ऋषि" } as const;

export const place = "Sydney, Australia";

/** When the letter was last rewritten. Change it with the copy. */
export const written = { dateTime: "2026-11", label: "November 2026" } as const;

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

export const employers = [
  {
    company: "Airwallex",
    href: "https://www.airwallex.com",
    dateTime: "2024",
    when: "2024–now",
    where: "Sydney",
    story:
      "I started on the cards team, which builds card issuing and spend management. I'm now on Yield, where a business can put its spare cash into money market funds and take it out again when it needs it. On both teams I've worked across the backend, the web app and the mobile app. I also set up the coding agents in our codebases and build the tooling around them.",
    roles: [{ title: "Senior Software Engineer", when: "2024–now" }],
  },
  {
    company: "Freelancer",
    href: "https://www.freelancer.com",
    dateTime: "2016",
    when: "2016–2024",
    where: "Sydney",
    story:
      "I joined as an intern and stayed eight years. As a software engineer I rebuilt the internal escalation system from front to back. In 2019 I spent eight months managing ten engineers across two regions and taking the first call when production broke. After that I led engineering for Escrow.com for five years. Escrow.com holds a buyer's money until the seller delivers, and I owned its backend services, its React front end and its AWS infrastructure.",
    roles: [
      { title: "Senior Software Engineer, Tech Lead for Escrow.com", when: "2019–2024" },
      { title: "Engineering Team Lead", when: "2019" },
      { title: "Software Engineer", when: "2017–2019" },
      { title: "Intern", when: "2016" },
    ],
  },
] as const;

export const projects = [
  {
    name: "Turborepo remote cache",
    packageName: "turborepo-remote-cache-cloudflare",
    href: "https://adirishi.github.io/turborepo-remote-cache-cloudflare/",
    source: "https://github.com/AdiRishi/turborepo-remote-cache-cloudflare",
    description:
      "A Turborepo remote cache you host yourself, so your build artefacts stay in your own storage. It began on Cloudflare Workers and now runs on Lambda, Vercel, Node and a few others. It's my most used project, with about 250 stars, and every repository of my own builds with it.",
  },
  {
    name: "dotagents",
    href: "https://github.com/AdiRishi/dotagents",
    source: "https://github.com/AdiRishi/dotagents",
    description:
      "How I like software built, written down for my coding agents. It holds the rules and skills that Claude Code, Codex and Cursor start from on every machine I use, and I change it constantly. Take whatever is useful.",
  },
  {
    name: "Moss",
    href: "https://github.com/AdiRishi/moss-meditation",
    source: "https://github.com/AdiRishi/moss-meditation",
    description:
      "A meditation timer for iOS and Android. I wanted one that was simple and peaceful, didn't like anything on the market, and started making my own. It's still in development.",
  },
  {
    name: "RenderMD",
    href: "https://www.render-md.com",
    source: "https://github.com/AdiRishi/render-md",
    description:
      'Paste markdown or a GitHub link and read it typeset, with maths, Mermaid diagrams and highlighted code. I built it because I disliked every result for "render markdown online". Your documents never leave the browser.',
  },
  {
    name: "promptrc",
    href: "https://promptrc.app",
    source: "https://github.com/AdiRishi/promptrc",
    description:
      "Where I keep the prompts and patterns that worked. I started it while I was learning to work with AI agents and needed somewhere to save them. You drive it from the keyboard, like a terminal app.",
  },
  {
    name: "cachified KV adapter",
    packageName: "cachified-adapter-cloudflare-kv",
    href: "https://www.npmjs.com/package/cachified-adapter-cloudflare-kv",
    source: "https://github.com/AdiRishi/cachified-adapter-cloudflare-kv",
    description:
      "The official Cloudflare KV adapter for @epic-web/cachified. One didn't exist and I wanted one. It gets about 2,000 downloads a month on npm.",
  },
] as const;

export const starters = [
  {
    name: "a Cloudflare application platform",
    href: "https://github.com/AdiRishi/application-platform-starter",
  },
  { name: "Electron with Effect", href: "https://github.com/AdiRishi/electron-effect-starter" },
  { name: "Expo with Uniwind", href: "https://github.com/AdiRishi/expo-uniwind-starter" },
  { name: "TanStack Start", href: "https://github.com/AdiRishi/tanstack-start-starter" },
  {
    name: "TanStack Start with SpacetimeDB",
    href: "https://github.com/AdiRishi/tanstack-spacetimedb-starter",
  },
] as const;
