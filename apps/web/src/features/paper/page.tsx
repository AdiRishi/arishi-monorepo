import { useEffect, useRef } from "react";

import { startPaper } from "./start-paper";

const projects = [
  {
    number: "01",
    name: "turborepo-remote-cache-cloudflare",
    href: "https://adirishi.github.io/turborepo-remote-cache-cloudflare/",
    source: "https://github.com/AdiRishi/turborepo-remote-cache-cloudflare",
    description:
      "A Turborepo remote cache that runs on Cloudflare Workers with R2 or KV behind it. Deploy it once and your whole team and CI share build artefacts.",
  },
  {
    number: "02",
    name: "cachified-adapter-cloudflare-kv",
    href: "https://www.npmjs.com/package/cachified-adapter-cloudflare-kv",
    source: "https://github.com/AdiRishi/cachified-adapter-cloudflare-kv",
    description:
      "The Cloudflare KV adapter for @epic-web/cachified. Stale-while-revalidate caching at the edge, on npm.",
  },
  {
    number: "03",
    name: "application-platform-starter",
    href: "https://github.com/AdiRishi/application-platform-starter",
    source: "https://github.com/AdiRishi/application-platform-starter",
    description:
      "A TypeScript monorepo for Cloudflare: web apps, Workers and shared resources, with Alchemy owning the infrastructure and Effect services doing the work. This site runs on it.",
  },
  {
    number: "04",
    name: "tanstack-start-starter",
    href: "https://github.com/AdiRishi/tanstack-start-starter",
    source: "https://github.com/AdiRishi/tanstack-start-starter",
    description:
      "A TanStack Start template with type-safe routing, Tailwind v4 and shadcn, strict TypeScript, and the lint setup I actually use.",
  },
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
      <div className="toast" id="toast"></div>

      <main>
        <section className="hero wrap" id="top">
          <p className="eyebrow">Senior software engineer · Airwallex · Sydney</p>
          <div id="inkbox">
            <h1>Adishwar Rishi</h1>
          </div>
          <div className="letterhead">
            <p className="lede">
              I build complex systems with the{" "}
              <b>simplest design that fits the real requirements.</b> Nine years of payments, escrow
              and cards, where correctness is the product.
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
            <span>Keep reading. The pen keeps going.</span>
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
                Engineer by trade, <em>beach person</em> by weekend.
              </h2>
              <div className="prose">
                <p>
                  I&apos;m Adi, a senior engineer at Airwallex in Sydney. I spent my first year
                  there on Cards and spend management and now work on Yield. Before that I led
                  engineering for Escrow.com at Freelancer, running the systems that move money
                  between people who have agreed not to trust each other.
                </p>
                <p>
                  Nine years of that teaches one thing. A system should be exactly as complex as the
                  problem, and not one layer more. The elegant answer and the correct answer are
                  usually the same answer, and when they aren&apos;t, the correct one wins.
                </p>
                <p>
                  I like serverless and the edge, TypeScript that makes the wrong thing hard to
                  type, and deleting code. Away from the desk I&apos;m at the beach, deep in a long
                  game, or two episodes past the point where I said &quot;just one more&quot;.
                </p>
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
                <div>
                  <dt>Weekends</dt>
                  <dd>A beach, any beach</dd>
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
                Work, in <em>order of appearance.</em>
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
                    <p>A year on the Cards and spend management team, then Yield.</p>
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
                      Led engineering for Escrow.com for five years: the services, the databases,
                      the front end and the AWS underneath, and the dates the business planned
                      around.
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
                      Ran a team of ten across two regions, and took first call when production
                      broke.
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
                      Rebuilt the internal escalation system end to end. Started as an intern the
                      year before and learned the codebase, the people and the on-call rota, in that
                      order.
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
                Things I built because <em>I wanted them to exist.</em>
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
                Three things I&apos;d talk about <em>for longer than you&apos;d like.</em>
              </h2>
              <div className="three">
                <div>
                  <div className="draw sm" data-draw="controller" aria-hidden="true"></div>
                  <h3>
                    Gaming<span className="dv">खेल</span>
                  </h3>
                  <p className="lead">Big worlds, long stories, no hurry.</p>
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
                  <p className="lead">Long arcs that earn their endings.</p>
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
                  <p className="lead">Salt water, sand, nowhere to be.</p>
                  <p className="lead">
                    Sydney&apos;s one unfair advantage. Any beach, any season, and the week resets.
                  </p>
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
                Write <em>back.</em>
              </h2>
              <p className="prose" style={{ margin: "0 0 28px" }}>
                I read everything. Interesting problems get a fast reply.
              </p>
              <div className="mail">
                <span id="mail">adishwar.rishi@gmail.com</span>
                <button id="copy" type="button">
                  Copy
                </button>
              </div>
              <div className="links">
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
              </div>
              <div className="signoff">
                <p>Yours,</p>
                <div className="draw sig" data-draw="signature" aria-hidden="true"></div>
                <p className="k">
                  Adishwar Rishi · Sydney · <a href="#top">Back to the top ↑</a>
                </p>
              </div>
            </div>
            <div className="draw" data-draw="envelope" aria-hidden="true"></div>
          </div>
          <footer>
            <span>
              Paper, ink and drawings rendered live · <b id="renderer">…</b> · no images
            </span>
            <span>Set in Newsreader and Tiro Devanagari Sanskrit</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
