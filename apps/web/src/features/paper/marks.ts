/**
 * Red-pen marks the reader earns by scrolling back up: a second read, so the pen comes back as
 * an editor's. Each mark is a list of SVG paths in the marked element's own box, in CSS pixels
 * with the element's top-left at the origin. Margin marks sit to the left of the element and
 * are skipped when there is no room before the page's red rule.
 */
export type MarkKind = "underline" | "circle" | "tick" | "bracket";

export interface MarkGeometry {
  readonly box: { readonly w: number; readonly h: number };
  readonly paths: readonly string[];
}

export function isMarkKind(name: string): name is MarkKind {
  return name === "underline" || name === "circle" || name === "tick" || name === "bracket";
}

const n = (v: number) => v.toFixed(1);

/** Builds a mark around `el` as it is laid out now. `margin` is the x the mark must stay right of. */
export function markGeometry(kind: MarkKind, el: HTMLElement, margin: number): MarkGeometry {
  const r = el.getBoundingClientRect();
  const box = { w: r.width, h: r.height };
  switch (kind) {
    case "underline":
      return { box, paths: underline(el, r) };
    case "circle":
      return { box, paths: [circle(r.width, r.height)] };
    case "tick":
      return { box, paths: r.left - 40 < margin ? [] : [tick(el, r.height)] };
    case "bracket":
      return { box, paths: r.left - 30 < margin ? [] : [bracket(r.height)] };
  }
}

function underline(el: HTMLElement, origin: DOMRect): string[] {
  const size = parseFloat(getComputedStyle(el).fontSize);
  const paths: string[] = [];
  for (const line of el.getClientRects()) {
    if (line.width < 4) continue;
    const x0 = line.left - origin.left - 2;
    const x1 = line.right - origin.left + 5;
    const y = line.bottom - origin.top - size * 0.04;
    const w = x1 - x0;
    paths.push(
      `M${n(x0)} ${n(y + 0.6)} C${n(x0 + w * 0.3)} ${n(y + 2.2)} ${n(x0 + w * 0.65)} ${n(y - 1.4)} ${n(x1)} ${n(y + 0.4)}`,
    );
  }
  return paths;
}

function circle(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 + 8 + w * 0.015;
  const ry = h / 2 + 6 + h * 0.08;
  const steps = 56;
  const from = Math.PI * 1.35;
  const sweep = Math.PI * 2 * 1.08;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = from - sweep * t;
    const wobble = 1 + 0.025 * Math.sin(3 * a + 1.3) + 0.015 * Math.sin(5 * a);
    const x = cx + rx * wobble * Math.cos(a);
    const y = cy + ry * wobble * (1 - 0.04 * t) * Math.sin(a);
    points.push(`${n(x)} ${n(y)}`);
  }
  return `M${points.join(" L")}`;
}

function tick(el: HTMLElement, h: number): string {
  const style = getComputedStyle(el);
  const line = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
  const c = Math.min(h, line) / 2;
  const x = -34;
  return `M${x} ${n(c + 1)} Q${x + 3} ${n(c + 4)} ${x + 7} ${n(c + 9)} Q${x + 11} ${n(c - 1)} ${x + 22} ${n(c - 10)}`;
}

function bracket(h: number): string {
  const x = -24;
  return `M${x + 8} 22 Q${x} 23 ${x} 30 L${x} ${n(h - 30)} Q${x} ${n(h - 23)} ${x + 8} ${n(h - 22)}`;
}
