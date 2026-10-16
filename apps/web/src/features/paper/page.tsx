import { useEffect, useRef } from "react";

import { startPaper } from "./start-paper";

const projects = [
  { number: "01", name: "panorama" },
  { number: "02", name: "pakshi" },
  { number: "03", name: "ironcage" },
  { number: "04", name: "savings-analyser" },
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
          <p className="eyebrow">
            Senior software engineer · Fintech · <mark className="ph">City</mark>
          </p>
          <div id="inkbox">
            <span className="sr">
              Adishwar Rishi, written by hand, with the name in Devanagari beneath
            </span>
          </div>
          <h1 className="sr">Adishwar Rishi</h1>
          <p className="lede">
            I build complex systems with the <b>simplest design that fits the real requirements.</b>{" "}
            Eight years in fintech, where correctness is the product.
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
                  I&apos;m Adi. For the last eight-plus years I&apos;ve built the parts of financial
                  software that nobody sees until they break:{" "}
                  <mark className="ph">
                    ledgers, settlement, reconciliation, the systems that get audited later
                  </mark>
                  . The work taught me one thing I now apply everywhere. A system should be exactly
                  as complex as the problem, and not one layer more.
                </p>
                <p>
                  I like the kind of engineering where the elegant answer and the correct answer
                  turn out to be the same thing. I&apos;m happiest when a design survives contact
                  with a real requirement, and I&apos;m quick to delete anything that doesn&apos;t.
                </p>
                <p>
                  Away from the desk I&apos;m on a trail, in a raid, or two episodes deep into
                  something I promised to watch &quot;just one episode&quot; of.
                </p>
              </div>
              <dl className="ledger">
                <div>
                  <dt>Now playing</dt>
                  <dd>
                    <mark className="ph">Hollow Knight: Silksong</mark>
                    <small>97 h</small>
                  </dd>
                </div>
                <div>
                  <dt>Watching</dt>
                  <dd>
                    <mark className="ph">Frieren: Beyond Journey&apos;s End</mark>
                    <small>S2</small>
                  </dd>
                </div>
                <div>
                  <dt>Last summit</dt>
                  <dd>
                    <mark className="ph">Mount Kosciuszko</mark>
                    <small>2,228 m</small>
                  </dd>
                </div>
                <div>
                  <dt>Reading</dt>
                  <dd>
                    <mark className="ph">A Philosophy of Software Design</mark>
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
                    <b>2022 — now</b>3 yr 9 mo
                  </div>
                  <div>
                    <h3>
                      Senior Software Engineer{" "}
                      <span>
                        at <mark className="ph">Company</mark>
                      </span>
                    </h3>
                    <p>
                      <mark className="ph">
                        Led the redesign of the settlement pipeline so a day&apos;s books close in
                        minutes instead of hours. Cut the on-call page rate by half by removing two
                        services that only existed to talk to each other.
                      </mark>
                    </p>
                    <ul className="tags">
                      <li>TypeScript</li>
                      <li>Postgres</li>
                      <li>Event sourcing</li>
                      <li>AWS</li>
                    </ul>
                  </div>
                </li>
                <li className="role">
                  <div className="when">
                    <b>2019 — 2022</b>3 yr
                  </div>
                  <div>
                    <h3>
                      Software Engineer{" "}
                      <span>
                        at <mark className="ph">Company</mark>
                      </span>
                    </h3>
                    <p>
                      <mark className="ph">
                        Built and owned the ledger service behind consumer payments. Designed the
                        double-entry model that the rest of the platform still runs on.
                      </mark>
                    </p>
                    <ul className="tags">
                      <li>Kotlin</li>
                      <li>Kafka</li>
                      <li>Kubernetes</li>
                    </ul>
                  </div>
                </li>
                <li className="role">
                  <div className="when">
                    <b>2017 — 2019</b>2 yr
                  </div>
                  <div>
                    <h3>
                      Engineer{" "}
                      <span>
                        at <mark className="ph">Company</mark>
                      </span>
                    </h3>
                    <p>
                      <mark className="ph">
                        First real job. Shipped the onboarding flow, learned what production means,
                        and discovered that the best code review comment is &quot;do we need
                        this?&quot;
                      </mark>
                    </p>
                    <ul className="tags">
                      <li>React</li>
                      <li>Node</li>
                      <li>GraphQL</li>
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
                  <li className="proj" key={project.number}>
                    <span className="k">{project.number}</span>
                    <div>
                      <h3>
                        <a href="https://github.com/" target="_blank" rel="noopener">
                          {project.name}
                        </a>
                      </h3>
                      <p>
                        <mark className="ph">What it does, in one line.</mark>
                      </p>
                    </div>
                    <a className="go" href="https://github.com/" target="_blank" rel="noopener">
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
                <span id="mail">
                  hello@<mark className="ph">yourdomain.com</mark>
                </span>
                <button id="copy" type="button">
                  Copy
                </button>
              </div>
              <div className="links">
                <a href="https://github.com/" target="_blank" rel="noopener">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener">
                  LinkedIn
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
