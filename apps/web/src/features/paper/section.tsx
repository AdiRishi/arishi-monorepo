import { sections } from "./content";
import type { SketchName } from "./drawings";

export const wrap = "mx-auto max-w-[1240px] pr-6 pl-9 md:px-[clamp(40px,6vw,80px)]";
/** The margin column and the body column. The margin rule runs down the gap between them. */
export const columns = "grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)] md:gap-x-12";
export const label = "font-mono text-label text-mute uppercase";
export const meta = "font-mono text-meta text-mute tabular-nums";
export const prose = "max-w-[60ch] space-y-[1em] text-pretty";
/** The text column of a list row. */
export const account = "max-w-[60ch] text-pretty";
/** A list row: a name column, then the text about it. Work and Projects share it. */
export const ledgerRow =
  "grid grid-cols-1 items-baseline gap-x-12 gap-y-4 border-b border-line py-7 lg:grid-cols-[272px_minmax(0,1fr)]";
export const inlineLink =
  "underline decoration-line decoration-1 underline-offset-[0.2em] transition-colors hover:text-accent hover:decoration-accent";

export function Hindi({ className, children }: { className: string; children: string }) {
  return (
    <span lang="hi" className={`font-dev ${className}`}>
      {children}
    </span>
  );
}

/** A mark that tells sighted readers where a link goes. Its link's text already says so. */
export function Arrow({ glyph }: { glyph: "↗" | "↑" }) {
  return <span aria-hidden="true"> {glyph}</span>;
}

export function Sketch({ name, className = "" }: { name: SketchName; className?: string }) {
  return (
    <div
      className={`draw relative aspect-4/3 ${className}`}
      data-sketch={name}
      aria-hidden="true"
    />
  );
}

export function Section({
  id,
  heading,
  intro,
  sketch,
  beside,
  children,
}: {
  id: keyof typeof sections;
  heading: React.ReactNode;
  intro: React.ReactNode;
  sketch: SketchName;
  /** Sits under the introduction, beside the sketch. */
  beside?: React.ReactNode;
  /** Runs the full width of the body, under the introduction and the sketch. */
  children?: React.ReactNode;
}) {
  const { name, hindi } = sections[id];
  return (
    <section id={id} className={`relative scroll-mt-20 py-11 md:scroll-mt-24 md:py-14 ${wrap}`}>
      <div className={`${columns} gap-y-4`}>
        <p className="flex items-baseline gap-3 md:block md:pt-2 md:text-right">
          <Hindi className="block text-[1.375rem] leading-[1.2] text-accent">{hindi}</Hindi>
          <span className={`${label} md:mt-1.5 md:block`}>{name}</span>
        </p>
        <div className="min-w-0">
          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-7 md:grid-cols-[minmax(0,1fr)_176px] lg:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-x-12">
            <div className="min-w-0">
              <h2 className="mb-[0.55em] text-heading font-light text-balance">{heading}</h2>
              <div className={prose}>{intro}</div>
            </div>
            <Sketch
              name={sketch}
              className="w-[min(64%,240px)] md:col-start-2 md:row-span-2 md:row-start-1 md:w-full lg:-mb-6 xl:-mt-2"
            />
            {beside && <div className="min-w-0 md:col-start-1 md:row-start-2">{beside}</div>}
          </div>
          {children && <div className="mt-10 md:mt-12">{children}</div>}
        </div>
      </div>
    </section>
  );
}
