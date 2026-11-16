import { sections } from "./content";

export const wrap = "mx-auto max-w-[1240px] px-[clamp(28px,6vw,80px)]";
export const label = "font-mono text-label tracking-label text-mute uppercase";
export const prose = "max-w-[62ch] text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.55] font-light";

export function Hindi({ className, children }: { className: string; children: string }) {
  return (
    <span lang="hi" className={`font-dev ${className}`}>
      {children}
    </span>
  );
}

export function Drawing({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div
      className={`draw relative aspect-4/3 w-full ${className}`}
      data-draw={name}
      aria-hidden="true"
    />
  );
}

export function Section({
  id,
  hindi,
  heading,
  drawing,
  wide = false,
  large = false,
  children,
}: {
  id: keyof typeof sections;
  hindi: string;
  heading: React.ReactNode;
  drawing?: string;
  wide?: boolean;
  large?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`rv relative py-[clamp(80px,14vh,160px)] ${wrap}`}>
      <div className="grid grid-cols-1 items-start gap-x-8 gap-y-6 md:grid-cols-[120px_minmax(0,1fr)] xl:grid-cols-[120px_minmax(0,1fr)_340px]">
        <div className="mb-[18px] flex items-baseline gap-3.5 md:mb-0 md:block">
          <Hindi className="block text-2xl leading-[1.2] text-accent">{hindi}</Hindi>
          <p className="font-mono text-[10px] tracking-label text-mute uppercase md:mt-2">
            {sections[id]}
          </p>
        </div>
        <div className={`min-w-0 ${wide ? "xl:col-span-2" : ""}`}>
          <h2
            className={`write mb-[0.6em] leading-[1.02] font-light tracking-[-0.015em] text-balance [font-variation-settings:'opsz'_72] ${large ? "text-[clamp(2.4rem,6.5vw,5.5rem)]" : "text-[clamp(2rem,4.6vw,4rem)]"}`}
          >
            {heading}
          </h2>
          {children}
        </div>
        {drawing && (
          <Drawing
            name={drawing}
            className="mt-2 max-w-[340px] md:col-start-2 xl:col-start-3 xl:max-w-none"
          />
        )}
      </div>
    </section>
  );
}
