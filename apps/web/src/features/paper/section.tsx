import { sections } from "./content";
import type { SketchName } from "./drawings";

export const wrap = "mx-auto max-w-[1240px] pr-6 pl-9 md:px-[clamp(40px,6vw,80px)]";
/** The margin column and the body column. The margin rule runs down the gap between them. */
export const columns = "grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)] md:gap-x-12";
export const label = "font-mono text-label text-mute uppercase";
export const meta = "font-mono text-meta text-mute tabular-nums";
export const prose = "max-w-[60ch] space-y-[1em]";
/** A list row: a name column, then the text about it. Work and Projects share it. */
export const ledgerRow =
  "grid grid-cols-1 items-baseline gap-x-12 gap-y-3 border-b border-line py-7 lg:grid-cols-[272px_minmax(0,1fr)]";
export const inlineLink =
  "underline decoration-line decoration-1 underline-offset-[0.2em] transition-colors hover:text-accent hover:decoration-accent";

export function Hindi({ className, children }: { className: string; children: string }) {
  return (
    <span lang="hi" className={`font-dev ${className}`}>
      {children}
    </span>
  );
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
  children,
}: {
  id: keyof typeof sections;
  heading: React.ReactNode;
  intro: React.ReactNode;
  sketch: SketchName;
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
          <div className="grid grid-cols-1 items-start gap-x-12 gap-y-7 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <h2 className="write mb-[0.55em] text-heading font-light text-balance">{heading}</h2>
              <div className={prose}>{intro}</div>
            </div>
            <Sketch name={sketch} className="w-[min(64%,240px)] md:w-[260px] xl:-mt-2 xl:w-full" />
          </div>
          {children && <div className="mt-10 md:mt-12">{children}</div>}
        </div>
      </div>
    </section>
  );
}
