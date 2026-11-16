import { useEffect, useRef } from "react";

import { ContactList } from "./contact";
import { email, pastimes, profiles, projects } from "./content";
import { SectionNav } from "./nav";
import { Drawing, Hindi, Section, label, prose, wrap } from "./section";
import { startPaper } from "./start-paper";
import { WorkHistory } from "./work";

const rule = "border-b border-line";

function Letterhead() {
  return (
    <section
      id="top"
      className={`relative grid content-center pt-[16vh] pb-[10vh] md:min-h-[92vh] md:pt-[14vh] md:pb-[8vh] ${wrap}`}
    >
      <p className="mb-[18px] font-mono text-caption tracking-[0.2em] text-mute uppercase">
        Senior software engineer · Airwallex · Sydney
      </p>
      <div id="inkbox" className="relative w-[min(100%,1120px)]">
        <h1>Adishwar Rishi</h1>
      </div>
      <div className="mt-3.5 grid grid-cols-1 items-end gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <p className="max-w-[38ch] text-[clamp(1.1rem,1.5vw,1.4rem)] leading-[1.45] font-light">
          I&apos;ve written payments software for nine years. Five of those were at Escrow.com, and
          I&apos;ve been at Airwallex since 2024.
        </p>
        <p className="flex flex-wrap items-baseline gap-x-[22px] gap-y-2.5 font-mono text-caption tracking-[0.14em] text-mute uppercase lg:flex-col lg:items-end lg:gap-2 lg:text-right">
          <a
            href={`mailto:${email}`}
            className="basis-full border-b border-line pb-0.5 text-[13px] tracking-[0.04em] text-ink normal-case hover:text-accent lg:mb-1.5 lg:basis-auto"
          >
            {email}
          </a>
          {profiles.map((profile) => (
            <a
              key={profile.name}
              href={profile.href}
              target="_blank"
              rel="noopener"
              className="hover:text-accent"
            >
              {profile.name}
            </a>
          ))}
        </p>
      </div>
      <p className="mt-12 mb-[1em] flex animate-cue items-center gap-3.5 font-mono text-caption tracking-[0.18em] text-mute uppercase motion-reduce:animate-none">
        <span aria-hidden="true" className="block h-px w-[34px] bg-strong" />
        Scroll for the rest
      </p>
    </section>
  );
}

function About() {
  const facts = [
    { term: "Based in", detail: "Sydney, Australia" },
    { term: "Studied", detail: "Software Engineering, UNSW", note: "2014 – 2017" },
    { term: "Working on", detail: "Yield, at Airwallex" },
  ];
  return (
    <Section
      id="about"
      hindi="परिचय"
      heading={
        <>
          Hi, I&apos;m <em>Adi.</em>
        </>
      }
      drawing="mountains"
    >
      <div className={`space-y-[1.1em] ${prose}`}>
        <p>
          I&apos;m a senior engineer at Airwallex. I spent my first year on the Cards and spend
          management team and now work on Yield. Before that I was at Freelancer for eight years. I
          started there as an intern, and for my last five years I led engineering for Escrow.com,
          which holds a buyer&apos;s money until the seller delivers.
        </p>
        <p>In my spare time I build a lot of things with AI.</p>
      </div>
      <dl className="mt-10 max-w-[62ch] border-t border-line font-mono text-[12.5px] tracking-[0.06em]">
        {facts.map((fact) => (
          <div
            key={fact.term}
            className={`grid grid-cols-1 items-baseline gap-1 py-3.5 xs:grid-cols-[150px_1fr] xs:gap-4 ${rule}`}
          >
            <dt className={label}>{fact.term}</dt>
            <dd className="font-display text-[1.1rem] font-light tracking-normal">
              {fact.detail}
              {fact.note && (
                <small className="ml-2.5 font-mono text-label tracking-[0.14em] text-mute uppercase">
                  {fact.note}
                </small>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function Projects() {
  return (
    <Section
      id="projects"
      hindi="रचना"
      heading={
        <>
          Side projects, <em>all on GitHub.</em>
        </>
      }
      drawing="cube"
    >
      <ol className="border-t border-line">
        {projects.map((project, index) => (
          <li
            key={project.name}
            className={`group grid grid-cols-1 items-baseline gap-1 py-[22px] sm:grid-cols-[60px_minmax(0,1fr)_auto] sm:gap-5 ${rule}`}
          >
            <span aria-hidden="true" className={label}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.1] font-normal tracking-[-0.01em] group-hover:text-accent">
                <a href={project.href} target="_blank" rel="noopener">
                  {project.name}
                </a>
              </h3>
              <p className="mt-1 max-w-[46ch] text-base font-light text-mute">
                {project.description}
              </p>
            </div>
            <a
              href={project.source}
              target="_blank"
              rel="noopener"
              aria-label={`Source for ${project.name}`}
              className="font-mono text-label tracking-label whitespace-nowrap uppercase"
            >
              Source →
            </a>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function OffTheClock() {
  return (
    <Section
      id="offclock"
      hindi="शौक"
      heading={
        <>
          Games, anime <em>and the beach.</em>
        </>
      }
      wide
    >
      <div className="mt-2 grid grid-cols-1 gap-11 xl:grid-cols-3 xl:gap-9">
        {pastimes.map((pastime) => (
          <div
            key={pastime.name}
            className="grid grid-cols-1 items-start xs:grid-cols-[200px_minmax(0,1fr)] xs:gap-x-7 xl:block"
          >
            <Drawing name={pastime.drawing} className="mb-4 max-w-[260px] xs:row-span-4" />
            <h3 className="mb-1.5 text-[1.35rem] font-normal tracking-[-0.01em]">
              {pastime.name}
              <Hindi className="ml-2.5 text-[0.95em] text-accent">{pastime.hindi}</Hindi>
            </h3>
            <p className="mb-4 text-base font-light text-mute">{pastime.lead}</p>
            {pastime.favourites.length > 0 && (
              <ol className="border-t border-line">
                {pastime.favourites.map((favourite, index) => (
                  <li
                    key={favourite.title}
                    className={`grid grid-cols-[28px_1fr] items-baseline gap-2.5 py-3 text-[1.02rem] font-light ${rule}`}
                  >
                    <span
                      aria-hidden="true"
                      className="font-mono text-label tracking-[0.1em] text-mute"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {favourite.title}
                      <small className="mt-[3px] block font-mono text-label tracking-[0.12em] text-mute uppercase">
                        {favourite.credit}
                      </small>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section
      id="contact"
      hindi="संपर्क"
      heading={
        <>
          Get in <em>touch.</em>
        </>
      }
      drawing="plane"
      large
    >
      <p className={`mb-7 ${prose}`}>Any of these will reach me.</p>
      <ContactList />
      <div className="mt-16 max-w-[62ch]">
        <p className="text-xl font-light italic">Yours,</p>
        <Drawing name="signature" className="-mt-3 -mb-6 -ml-4 max-w-[300px]" />
        <p className={label}>
          Adishwar Rishi · Sydney ·{" "}
          <a href="#top" className="hover:text-accent">
            Back to the top ↑
          </a>
        </p>
      </div>
    </Section>
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
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 left-[clamp(28px,6vw,72px)] z-1 w-px bg-accent opacity-35"
      />
      <p className="fixed top-[calc(26px+env(safe-area-inset-top,0px))] left-[30px] z-6 hidden font-mono text-caption tracking-label text-mute uppercase md:block">
        <b className="font-medium text-ink">Adishwar Rishi</b>
        <Hindi className="ml-2.5 text-[13px] tracking-[0.1em] text-accent normal-case">कलम</Hindi>
      </p>
      <SectionNav />
      <Pen />

      <main className="relative z-2">
        <Letterhead />
        <About />
        <Section
          id="work"
          hindi="कार्य"
          heading={
            <>
              Work, <em>newest first.</em>
            </>
          }
          drawing="scales"
        >
          <WorkHistory />
        </Section>
        <Projects />
        <OffTheClock />
        <Contact />
      </main>
    </div>
  );
}
