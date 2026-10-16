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
          <path d="M4 116 L10 100 L96 14 Q104 6 110 12 Q116 18 108 26 L22 112 Z" fill="#6b4a2e" />
          <path d="M4 116 L10 100 L22 112 Z" fill="#2b241f" />
          <path d="M12 100 L96 16 L104 22 L20 108 Z" fill="#8a6540" opacity=".9" />
          <path d="M4 116 L8 104 L16 110 Z" fill="#17161c" />
        </g>
      </svg>
      <div className="toast" id="toast"></div>

      <main>
        <section className="hero wrap" id="top">
          <p className="eyebrow">Senior software engineer · Airwallex · Sydney</p>
          <div id="inkbox">
            <span className="sr">
              Adishwar Rishi, written by hand, with the name in Devanagari beneath
            </span>
          </div>
          <h1 className="sr">Adishwar Rishi</h1>
          <p className="lede">
            I build complex systems with the <b>simplest design that fits the real requirements.</b>{" "}
            Nine years of payments, escrow and cards, where correctness is the product.
          </p>
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
                Engineer by trade, <em>naturalist</em> by weekend.
              </h2>
              <div className="prose">
                <p>
                  I&apos;m Adi, a senior engineer at Airwallex in Sydney. I spent my first year
                  there on Cards and spend management and now work on Yield. Before that I led
                  engineering for Escrow.com at Freelancer, running the systems that move money
                  between people who have agreed not to trust each other.
                </p>
                <p>
                  Nine years of that teaches one thing. A system should be exactly as complex as
                  the problem, and not one layer more. The elegant answer and the correct answer
                  are usually the same answer, and when they aren&apos;t, the correct one wins.
                </p>
                <p>
                  I like serverless and the edge, TypeScript that makes the wrong thing hard to
                  type, and deleting code. Away from the desk I&apos;m on a trail, in a raid, or
                  two episodes deep into something I promised to watch &quot;just one
                  episode&quot; of.
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
                  <dt>Now playing</dt>
                  <dd>
                    <mark className="ph">Hollow Knight: Silksong</mark>
                  </dd>
                </div>
                <div>
                  <dt>Watching</dt>
                  <dd>
                    <mark className="ph">Frieren: Beyond Journey&apos;s End</mark>
                  </dd>
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
                    <p>
                      A year on the Cards and spend management team, then Yield.{" "}
                      <mark className="ph">
                        One concrete thing from each team goes here once you tell me what you
                        are proudest of.
                      </mark>
                    </p>
                    <ul className="tags">
                      <li>Cards</li>
                      <li>Yield</li>
                      <li>
                        <mark className="ph">Stack to confirm</mark>
                      </li>
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
                      Owned the technical direction of Escrow.com for five years: twenty-odd Python
                      services, their databases, a React front end and the AWS underneath, held to a
                      99.9% uptime SLA. Set the architecture, took the risky reviews, and shipped on
                      dates the business could plan around.
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
                      Ran a team of ten across two regions. Turned the product roadmap into work the
                      team could deliver, coached three engineers to their next level, and took first
                      call for production incidents.
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
                      Rebuilt the internal escalation system end to end, SQL to screen, and cut the
                      time it took support to close a case. Started as an intern the year before and
                      learned the codebase, the people and the on-call rota, in that order.
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
                  <p className="lead">Mostly the kind with a map you fill in slowly.</p>
                  <ol>
                    <li>
                      <i>01</i>
                      <span>
                        <mark className="ph">Elden Ring</mark>
                        <small>Still the benchmark</small>
                      </span>
                    </li>
                    <li>
                      <i>02</i>
                      <span>
                        <mark className="ph">Outer Wilds</mark>
                        <small>Finished once. Can&apos;t again.</small>
                      </span>
                    </li>
                    <li>
                      <i>03</i>
                      <span>
                        <mark className="ph">Hades II</mark>
                        <small>Current obsession</small>
                      </span>
                    </li>
                  </ol>
                </div>
                <div>
                  <div className="draw sm" data-draw="cat" aria-hidden="true"></div>
                  <h3>
                    Anime<span className="dv">कथा</span>
                  </h3>
                  <p className="lead">Give me a good sky and a quiet episode.</p>
                  <ol>
                    <li>
                      <i>01</i>
                      <span>
                        <mark className="ph">Mushishi</mark>
                        <small>Rewatch every winter</small>
                      </span>
                    </li>
                    <li>
                      <i>02</i>
                      <span>
                        <mark className="ph">Your Name</mark>
                        <small>The sky, every time</small>
                      </span>
                    </li>
                    <li>
                      <i>03</i>
                      <span>
                        <mark className="ph">Vinland Saga</mark>
                        <small>Season 2 especially</small>
                      </span>
                    </li>
                  </ol>
                </div>
                <div>
                  <div className="draw sm" data-draw="fern" aria-hidden="true"></div>
                  <h3>
                    Nature<span className="dv">वन</span>
                  </h3>
                  <p className="lead">Long walks, early starts, no signal.</p>
                  <ol>
                    <li>
                      <i>01</i>
                      <span>
                        <mark className="ph">Overland Track</mark>
                        <small>6 days, Tasmania</small>
                      </span>
                    </li>
                    <li>
                      <i>02</i>
                      <span>
                        <mark className="ph">Blue Mountains</mark>
                        <small>The regular</small>
                      </span>
                    </li>
                    <li>
                      <i>03</i>
                      <span>
                        <mark className="ph">Next: Milford Track</mark>
                        <small>Booked</small>
                      </span>
                    </li>
                  </ol>
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
                <a href="#top">Back to the top ↑</a>
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
