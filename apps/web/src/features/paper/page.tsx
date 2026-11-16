import { useEffect, useRef, useState } from "react";

import { ContactList } from "./contact";
import { email, name, place, projects, starters, written } from "./content";
import { SectionNav } from "./nav";
import {
  Arrow,
  Hindi,
  Section,
  account,
  columns,
  inlineLink,
  label,
  ledgerRow,
  meta,
  wrap,
} from "./section";
import { startPaper } from "./start-paper";
import { WorkHistory } from "./work";

function Header() {
  const [pastName, setPastName] = useState(false);

  useEffect(() => {
    const inkbox = document.getElementById("inkbox");
    if (!inkbox) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastName(entry !== undefined && !entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(inkbox);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="veil fixed inset-x-0 top-0 z-6 pt-[env(safe-area-inset-top,0px)] pb-4">
      <div className={wrap}>
        <div className={`h-14 items-center md:h-16 ${columns}`}>
          <div className="flex items-center justify-between gap-4 md:col-start-2">
            <a
              href="#top"
              className={`hidden font-mono text-label whitespace-nowrap text-ink uppercase transition-[opacity,visibility] duration-300 md:block ${pastName ? "" : "invisible opacity-0"}`}
            >
              {name.latin}
            </a>
            <SectionNav />
          </div>
        </div>
      </div>
    </header>
  );
}

function Letterhead() {
  return (
    <section
      id="top"
      className={`relative pt-[calc(92px+env(safe-area-inset-top,0px))] md:pt-[clamp(104px,15vh,144px)] ${wrap}`}
    >
      <div className={columns}>
        <div className="md:col-start-2">
          <address className={`${meta} not-italic md:text-right`}>
            {place}
            <br />
            <a href={`mailto:${email}`} className={`text-ink ${inlineLink}`}>
              {email}
            </a>
            <br />
            <time dateTime={written.dateTime}>{written.label}</time>
          </address>
          <div id="inkbox" className="@container relative mt-9 w-full md:mt-7">
            <h1 className="penned pt-[0.05em] pl-[0.1em] text-[25.06cqw] leading-[0.92] font-light italic sm:relative sm:top-[0.02em] sm:text-[16.06cqw] sm:whitespace-nowrap">
              {name.latin}
            </h1>
            <Hindi className="penned block pl-[0.07em] text-[8.5cqw] leading-[1.2] sm:relative sm:top-[0.18em] sm:text-[4.82cqw]">
              {name.devanagari}
            </Hindi>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <ul className="border-t border-line">
      {projects.map((project) => (
        <li key={project.name} className={ledgerRow}>
          <div>
            <h3 className="text-title">
              <a href={project.href} target="_blank" rel="noopener" className={inlineLink}>
                {project.name}
              </a>
            </h3>
            {project.href !== project.source && (
              <p className={`${label} mt-1.5`}>
                <a
                  href={project.source}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Source for ${project.name}`}
                  className="py-1 whitespace-nowrap transition-colors hover:text-accent"
                >
                  Source
                  <Arrow glyph="↗" />
                </a>
              </p>
            )}
          </div>
          <p className={account}>{project.description}</p>
        </li>
      ))}
      <li className={ledgerRow}>
        <h3 className="text-title">Starter repos</h3>
        <p className={account}>
          I start a lot of projects, so I keep the setups I’d otherwise rebuild each time. There’s
          one for{" "}
          {starters.map((starter, index) => (
            <span key={starter.href}>
              {index > 0 && (index === starters.length - 1 ? " and " : ", ")}
              <a href={starter.href} target="_blank" rel="noopener" className={inlineLink}>
                {starter.name}
              </a>
            </span>
          ))}
          .
        </p>
      </li>
    </ul>
  );
}

function SignOff() {
  return (
    <div className="mt-12">
      <p className="text-title font-light italic">Yours,</p>
      <p className="draw mt-1 h-[88px] w-[168px]" data-word="Adi">
        <span className="penned block pl-[0.08em] text-[70px] leading-[88px] font-light italic">
          Adi
        </span>
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className={`pt-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))] ${wrap}`}>
      <div className={columns}>
        <p
          className={`${label} flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-line pt-5 md:col-start-2`}
        >
          <span className="text-balance">Set in Newsreader, Geist Mono and Tiro Devanagari</span>
          <a href="#top" className="whitespace-nowrap transition-colors hover:text-accent">
            Back to the top
            <Arrow glyph="↑" />
          </a>
        </p>
      </div>
    </footer>
  );
}

function Pen() {
  return (
    <svg
      id="nib"
      viewBox="0 0 120 120"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-7 size-[120px]"
    >
      <defs>
        <filter id="nibShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="2" dy="4" stdDeviation="2.5" floodColor="#17161c" floodOpacity=".35" />
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
  );
}

export function PaperPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    return startPaper(rootRef.current);
  }, []);

  return (
    <div ref={rootRef} data-state="boot">
      <canvas id="scene" aria-hidden="true" className="fixed inset-0 z-0 block size-full" />
      <Header />
      <Pen />

      <main className="relative z-2">
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${wrap}`}>
          <div className="relative h-full">
            <div className="absolute inset-y-0 -left-5 w-px bg-accent/40 md:left-36" />
          </div>
        </div>

        <Letterhead />
        <Section
          id="about"
          heading={
            <>
              Hi, I’m <em>Adi.</em>
            </>
          }
          intro={
            <>
              <p>
                I’m a product engineer in Sydney, currently at Airwallex. I like to own a whole
                product, so I work on the backend, the web app and the mobile app, and I stay to
                look after it once it ships. I enjoy that part as much as building it.
              </p>
              <p>
                Lately a lot of my time goes to coding agents, at work and at home. I’m slowly
                teaching them to write code I’d approve in review.
              </p>
            </>
          }
          sketch="sydney"
        />
        <Section
          id="work"
          heading={
            <>
              I’ve worked at <em>two companies.</em>
            </>
          }
          intro={<p>Both of them look after other people’s money.</p>}
          sketch="payments"
        >
          <WorkHistory />
          <p className="mt-5 text-note text-pretty text-mute">
            I studied software engineering at UNSW from 2014 to 2017.
          </p>
        </Section>
        <Section
          id="projects"
          heading={
            <>
              I’m always <em>building something.</em>
            </>
          }
          intro={
            <p>
              Outside work I build software for myself, usually because I wanted the thing and
              didn’t like what was already out there. All of it is on GitHub.
            </p>
          }
          sketch="laptop"
        >
          <Projects />
        </Section>
        <Section
          id="contact"
          heading={
            <>
              Write <em>back.</em>
            </>
          }
          intro={<p>Any of these will reach me.</p>}
          sketch="plane"
          beside={
            <>
              <ContactList />
              <SignOff />
            </>
          }
        />
        <Section
          id="ps"
          heading={<em>P.S.</em>}
          intro={
            <>
              <p>
                When I’m not writing code, I’m usually out for a walk in the park or deep in a long
                single-player game. <cite className="whitespace-nowrap">The Witcher 3</cite>,{" "}
                <cite className="whitespace-nowrap">Red Dead Redemption 2</cite> and{" "}
                <cite className="whitespace-nowrap">God of War</cite> are my favourites.
              </p>
              <p>
                I watch anime too. The two I’d recommend are{" "}
                <cite className="whitespace-nowrap">Vinland Saga</cite> and{" "}
                <cite className="whitespace-nowrap">Attack on Titan</cite>.
              </p>
            </>
          }
          sketch="park"
        />
        <Footer />
      </main>
    </div>
  );
}
