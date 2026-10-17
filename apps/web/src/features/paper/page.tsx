import { useEffect, useRef } from "react";

import { startPaper } from "./start-paper";

const projects = [
  {
    number: "01",
    name: "Moss",
    href: "https://github.com/AdiRishi/moss-meditation",
    source: "https://github.com/AdiRishi/moss-meditation",
    description:
      "A meditation timer for iOS and Android, in development. Sessions end with a soft sound instead of an alarm, and your history stays on the phone.",
  },
  {
    number: "02",
    name: "turborepo-remote-cache-cloudflare",
    href: "https://adirishi.github.io/turborepo-remote-cache-cloudflare/",
    source: "https://github.com/AdiRishi/turborepo-remote-cache-cloudflare",
    description:
      "A Turborepo remote cache you deploy to your own Cloudflare account. It stores artefacts in R2 or KV. This is my most-used project, with about 250 stars.",
  },
  {
    number: "03",
    name: "cachified-adapter-cloudflare-kv",
    href: "https://www.npmjs.com/package/cachified-adapter-cloudflare-kv",
    source: "https://github.com/AdiRishi/cachified-adapter-cloudflare-kv",
    description:
      "The official Cloudflare KV adapter for @epic-web/cachified. It gets about 1,600 npm downloads a month.",
  },
  {
    number: "04",
    name: "RenderMD",
    href: "https://www.render-md.com",
    source: "https://github.com/AdiRishi/render-md",
    description:
      "Paste markdown or a GitHub link and read it typeset, with math, Mermaid diagrams and code highlighting. Your documents never leave the browser.",
  },
  {
    number: "05",
    name: "promptrc",
    href: "https://promptrc.app",
    source: "https://github.com/AdiRishi/promptrc",
    description:
      "A library for the AI prompts that worked, driven from the keyboard like a terminal app. Prompts can have fill-in blanks, and benchmarks record which models pass.",
  },
] as const;

const channels = [
  {
    name: "LinkedIn",
    handle: "Adishwar Rishi",
    href: "https://www.linkedin.com/in/adishwar-rishi-8a832498",
  },
  { name: "X", handle: "@AdishwarR", href: "https://x.com/AdishwarR" },
  { name: "GitHub", handle: "AdiRishi", href: "https://github.com/AdiRishi" },
  { name: "Email", handle: "adishwar.rishi@gmail.com", href: "mailto:adishwar.rishi@gmail.com" },
] as const;

export function PaperPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    return startPaper(rootRef.current);
  }, []);

  return (
    <div ref={rootRef} data-state="boot">
      <canvas id="scene" aria-hidden="true"></canvas>
      <div className="rule" aria-hidden="true"></div>
      <div className="brand">
        <b>Adishwar Rishi</b>
        <span className="dv">कलम</span>
      </div>
      <nav className="top" aria-label="Sections">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#projects">Projects</a>
        <a href="#offclock">Off the clock</a>
        <a href="#contact">Contact</a>
      </nav>
      <svg id="nib" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <filter id="nibShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation="2.5"
              floodColor="#17161c"
              floodOpacity=".35"
            />
          </filter>
        </defs>
        <g filter="url(#nibShadow)">
          <path d="M46.5 82.1 L38.7 74.3 L108.2 8.1 L113.8 13.9 Z" fill="#2a2320" />
          <path d="M42.5 77 L109 11" stroke="#6a584c" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M41 88.1 L32.6 79.5 L38.4 73.9 L46.8 82.5 Z" fill="#b9b2a6" />
          <path d="M4 116 L31 101 L40 94 L30 84 L21 91 Z" fill="#d8c38a" />
          <path d="M4 116 L24 96.4" stroke="#6b5a2e" strokeWidth="1" strokeLinecap="round" />
          <circle cx="25.5" cy="94.5" r="1.8" fill="#6b5a2e" />
        </g>
      </svg>

      <main>
        <section className="hero wrap" id="top">
          <p className="eyebrow">Senior software engineer · Airwallex · Sydney</p>
          <div id="inkbox">
            <h1>Adishwar Rishi</h1>
          </div>
          <div className="letterhead">
            <p className="lede">
              I&apos;ve written payments software for nine years. Five of those were at Escrow.com,
              and I&apos;ve been at Airwallex since 2024.
            </p>
            <p className="from">
              <a href="mailto:adishwar.rishi@gmail.com">adishwar.rishi@gmail.com</a>
              <a href="https://github.com/AdiRishi" target="_blank" rel="noopener">
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/adishwar-rishi-8a832498"
                target="_blank"
                rel="noopener"
              >
                LinkedIn
              </a>
              <a href="https://x.com/AdishwarR" target="_blank" rel="noopener">
                X
              </a>
            </p>
          </div>
          <p className="cue">
            <i></i>
            <span>Scroll for the rest</span>
          </p>
        </section>

        <section className="sec wrap rv" id="about">
          <div className="grid">
            <div className="side">
              <p className="vj">परिचय</p>
              <p className="k">About</p>
            </div>
            <div className="body">
              <h2 className="write">
                Hi, I&apos;m <em>Adi.</em>
              </h2>
              <div className="prose">
                <p>
                  I&apos;m a senior engineer at Airwallex. I spent my first year on the Cards and
                  spend management team and now work on Yield. Before that I was at Freelancer for
                  eight years. I started there as an intern, and for my last five years I led
                  engineering for Escrow.com, which holds a buyer&apos;s money until the seller
                  delivers.
                </p>
                <p>In my spare time I build a lot of things with AI.</p>
              </div>
              <dl className="ledger">
                <div>
                  <dt>Based in</dt>
                  <dd>Sydney, Australia</dd>
                </div>
                <div>
                  <dt>Studied</dt>
                  <dd>
                    Software Engineering, UNSW<small>2014 – 2017</small>
                  </dd>
                </div>
                <div>
                  <dt>Working on</dt>
                  <dd>Yield, at Airwallex</dd>
                </div>
              </dl>
            </div>
            <div className="draw" data-draw="mountains" aria-hidden="true"></div>
          </div>
        </section>

        <section className="sec wrap rv" id="work">
          <div className="grid">
            <div className="side">
              <p className="vj">कार्य</p>
              <p className="k">Work</p>
            </div>
            <div className="body">
              <h2 className="write">
                Work, <em>newest first.</em>
              </h2>
              <ul className="roles">
                <li className="role">
                  <div className="when">
                    <b>2024 — now</b>Sydney
                  </div>
                  <div>
                    <h3>
                      Senior Software Engineer{" "}
                      <span>
                        at{" "}
                        <a href="https://www.airwallex.com" target="_blank" rel="noopener">
                          Airwallex
                        </a>
                      </span>
                    </h3>
                    <p>One year on Cards and spend management, then Yield.</p>
                    <ul className="tags">
                      <li>Cards</li>
                      <li>Yield</li>
                    </ul>
                  </div>
                </li>
                <li className="role">
                  <div className="when">
                    <b>2019 — 2024</b>Sydney
                  </div>
                  <div>
                    <h3>
                      Senior Software Engineer, Tech Lead for Escrow.com{" "}
                      <span>
                        at{" "}
                        <a href="https://www.freelancer.com" target="_blank" rel="noopener">
                          Freelancer
                        </a>
                      </span>
                    </h3>
                    <p>
                      Led the engineering team for Escrow.com. I owned the backend services, the
                      React front end and the AWS infrastructure.
                    </p>
                    <ul className="tags">
                      <li>Python</li>
                      <li>React</li>
                      <li>AWS</li>
                      <li>Postgres</li>
                    </ul>
                  </div>
                </li>
                <li className="role">
                  <div className="when">
                    <b>2019</b>Feb — Sep
                  </div>
                  <div>
                    <h3>
                      Engineering Team Lead{" "}
                      <span>
                        at{" "}
                        <a href="https://www.freelancer.com" target="_blank" rel="noopener">
                          Freelancer
                        </a>
                      </span>
                    </h3>
                    <p>
                      Managed ten engineers across two regions and took first call on production
                      incidents.
                    </p>
                    <ul className="tags">
                      <li>Leadership</li>
                      <li>On-call</li>
                    </ul>
                  </div>
                </li>
                <li className="role">
                  <div className="when">
                    <b>2017 — 2019</b>Sydney
                  </div>
                  <div>
                    <h3>
                      Software Engineer{" "}
                      <span>
                        at{" "}
                        <a href="https://www.freelancer.com" target="_blank" rel="noopener">
                          Freelancer
                        </a>
                      </span>
                    </h3>
                    <p>
                      Rebuilt the internal escalation system end to end. I&apos;d joined as an
                      intern the year before.
                    </p>
                    <ul className="tags">
                      <li>Python</li>
                      <li>SQL</li>
                      <li>React</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="draw" data-draw="scales" aria-hidden="true"></div>
          </div>
        </section>

        <section className="sec wrap rv" id="projects">
          <div className="grid">
            <div className="side">
              <p className="vj">रचना</p>
              <p className="k">Projects</p>
            </div>
            <div className="body">
              <h2 className="write">
                Side projects, <em>all on GitHub.</em>
              </h2>
              <ul className="projects">
                {projects.map((project) => (
                  <li className="proj" key={project.name}>
                    <span className="k">{project.number}</span>
                    <div>
                      <h3>
                        <a href={project.href} target="_blank" rel="noopener">
                          {project.name}
                        </a>
                      </h3>
                      <p>{project.description}</p>
                    </div>
                    <a className="go" href={project.source} target="_blank" rel="noopener">
                      Source →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="draw" data-draw="cube" aria-hidden="true"></div>
          </div>
        </section>

        <section className="sec wrap rv" id="offclock">
          <div className="grid">
            <div className="side">
              <p className="vj">शौक</p>
              <p className="k">Off the clock</p>
            </div>
            <div className="body wide">
              <h2 className="write">
                Games, anime <em>and the beach.</em>
              </h2>
              <div className="three">
                <div>
                  <div className="draw sm" data-draw="controller" aria-hidden="true"></div>
                  <h3>
                    Gaming<span className="dv">खेल</span>
                  </h3>
                  <p className="lead">Single-player games with a long story.</p>
                  <ol>
                    <li>
                      <i>01</i>
                      <span>
                        The Witcher 3<small>CD Projekt Red, 2015</small>
                      </span>
                    </li>
                    <li>
                      <i>02</i>
                      <span>
                        Red Dead Redemption 2<small>Rockstar, 2018</small>
                      </span>
                    </li>
                    <li>
                      <i>03</i>
                      <span>
                        God of War<small>Santa Monica Studio, 2018</small>
                      </span>
                    </li>
                  </ol>
                </div>
                <div>
                  <div className="draw sm" data-draw="cat" aria-hidden="true"></div>
                  <h3>
                    Anime<span className="dv">कथा</span>
                  </h3>
                  <p className="lead">Two I&apos;d recommend.</p>
                  <ol>
                    <li>
                      <i>01</i>
                      <span>
                        Vinland Saga<small>Wit Studio and MAPPA, 2019</small>
                      </span>
                    </li>
                    <li>
                      <i>02</i>
                      <span>
                        Attack on Titan<small>Wit Studio and MAPPA, 2013</small>
                      </span>
                    </li>
                  </ol>
                </div>
                <div>
                  <div className="draw sm" data-draw="beach" aria-hidden="true"></div>
                  <h3>
                    The beach<span className="dv">तट</span>
                  </h3>
                  <p className="lead">Most weekends I&apos;m at a beach.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sec wrap rv contact" id="contact">
          <div className="grid">
            <div className="side">
              <p className="vj">संपर्क</p>
              <p className="k">Contact</p>
            </div>
            <div className="body">
              <h2 className="write">
                Get in <em>touch.</em>
              </h2>
              <p className="prose" style={{ margin: "0 0 28px" }}>
                Any of these will reach me.
              </p>
              <ul className="reach">
                {channels.map((channel) => (
                  <li key={channel.name}>
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener"
                    >
                      <span className="name">{channel.name}</span>
                      <span className="handle">{channel.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="signoff">
                <p>Yours,</p>
                <div className="draw sig" data-draw="signature" aria-hidden="true"></div>
                <p className="k">
                  Adishwar Rishi · Sydney · <a href="#top">Back to the top ↑</a>
                </p>
              </div>
            </div>
            <div className="draw" data-draw="plane" aria-hidden="true"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
