/**
 * Line drawings the pen makes as the reader scrolls. Each drawing is a list of SVG paths in a
 * 400 by 300 box, in the order a hand would draw them. The layer strokes the revealed part of
 * every visible drawing into one viewport-sized mask that the paper shader renders as ink:
 * R = coverage, G = how recently the ink went down.
 */
export interface Wash {
  readonly d: string;
  readonly color: string;
}

export interface Drawing {
  readonly paths: readonly string[];
  readonly width: number;
  /** Watercolour under the ink, filled after the lines are down. */
  readonly washes: readonly Wash[];
}

export const INK = {
  bluegrey: "rgba(96,124,160,.55)",
  ochre: "rgba(214,160,70,.6)",
  sage: "rgba(120,150,100,.55)",
  brick: "rgba(178,58,42,.62)",
  indigo: "rgba(70,80,130,.5)",
  teal: "rgba(90,150,150,.5)",
  warmgrey: "rgba(150,135,115,.45)",
  night: "rgba(70,80,130,.16)",
};

export const BOX_W = 400,
  BOX_H = 300;

function fern() {
  const P = (t: number): [number, number] => [
    (1 - t) ** 2 * 70 + 2 * (1 - t) * t * 110 + t * t * 335,
    (1 - t) ** 2 * 285 + 2 * (1 - t) * t * 125 + t * t * 45,
  ];
  const T = (t: number): [number, number] => {
    const x = 2 * (1 - t) * 40 + 2 * t * 225,
      y = 2 * (1 - t) * -160 + 2 * t * -80;
    const l = Math.hypot(x, y);
    return [x / l, y / l];
  };
  const paths = ["M70 285 Q110 125 335 45"];
  const washes: Wash[] = [];
  let side = 1;
  for (let t = 0.07; t < 0.93; t += 0.05) {
    const [x, y] = P(t),
      [tx, ty] = T(t);
    const nx = -ty * side,
      ny = tx * side;
    const L = 62 * Math.pow(Math.sin(Math.PI * t), 0.8) * (1 - t * 0.25);
    const cx = x + nx * L * 0.55 + tx * L * 0.15,
      cy = y + ny * L * 0.55 + ty * L * 0.15;
    const ex = x + nx * L * 0.85 + tx * L * 0.55,
      ey = y + ny * L * 0.85 + ty * L * 0.55;
    paths.push(
      `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
    );
    const bx = x + nx * L * 0.3 + tx * L * 0.45,
      by = y + ny * L * 0.3 + ty * L * 0.45;
    washes.push({
      d: `M${(x + 3).toFixed(1)} ${(y + 2).toFixed(1)} Q${(cx + 3).toFixed(1)} ${(cy + 2).toFixed(1)} ${(ex + 3).toFixed(1)} ${(ey + 2).toFixed(1)} Q${(bx + 3).toFixed(1)} ${(by + 2).toFixed(1)} ${(x + 3).toFixed(1)} ${(y + 2).toFixed(1)} Z`,
      color: INK.sage,
    });
    for (let k = 0.3; k < 0.95; k += 0.22) {
      const u = 1 - k;
      const px = u * u * x + 2 * u * k * cx + k * k * ex,
        py = u * u * y + 2 * u * k * cy + k * k * ey;
      const s = L * 0.22 * (1 - k * 0.6);
      paths.push(
        `M${px.toFixed(1)} ${py.toFixed(1)} l${(nx * s * 0.7 + tx * s * 0.5).toFixed(1)} ${(ny * s * 0.7 + ty * s * 0.5).toFixed(1)}`,
      );
    }
    side = -side;
  }
  return { paths, washes };
}

export const drawings = {
  mountains: {
    width: 3,
    paths: [
      "M10 242 L390 242",
      "M0 236 L58 188 L108 214 L162 156 L228 204 L302 170 L400 238",
      "M22 238 L96 122 L142 172 L202 78 L252 150 L294 108 L382 238",
      "M188 100 L202 78 L214 100 M182 112 L196 96 M208 96 L222 112",
      "M336 66 A24 24 0 1 1 288 66 A24 24 0 1 1 336 66",
      "M62 72 q9 -9 18 0 M80 72 q9 -9 18 0",
      "M110 54 q8 -8 16 0 M126 54 q8 -8 16 0",
    ],
    washes: [
      {
        d: "M4 240 L62 192 L112 218 L166 160 L232 208 L306 174 L400 242 L400 246 L4 246 Z",
        color: INK.bluegrey,
      },
      { d: "M26 242 L100 126 L146 176 L206 82 L256 154 L298 112 L386 242 Z", color: INK.warmgrey },
      { d: "M338 70 A22 22 0 1 1 294 70 A22 22 0 1 1 338 70", color: INK.ochre },
      { d: "M14 246 L392 246 L392 262 L14 262 Z", color: INK.sage },
    ],
  },
  scales: {
    width: 3,
    paths: [
      "M150 254 L250 254",
      "M200 254 L200 72",
      "M190 66 A10 10 0 1 1 210 66 A10 10 0 1 1 190 66",
      "M84 96 L316 96",
      "M84 96 L52 182 M84 96 L116 182",
      "M40 182 Q84 222 128 182",
      "M316 96 L284 182 M316 96 L348 182",
      "M272 182 Q316 222 360 182",
      "M66 184 l8 -10 l8 10 M90 184 l8 -10 l8 10",
      "M300 184 l10 -14 l10 14",
    ],
    washes: [
      { d: "M44 186 Q88 226 132 186 Z", color: INK.ochre },
      { d: "M276 186 Q320 226 364 186 Z", color: INK.ochre },
      { d: "M154 250 L254 250 L254 262 L154 262 Z", color: INK.bluegrey },
      { d: "M193 69 A10 10 0 1 1 213 69 A10 10 0 1 1 193 69", color: INK.brick },
    ],
  },
  cube: {
    width: 3,
    paths: [
      "M200 62 L276 106 L276 194 L200 238 L124 194 L124 106 Z",
      "M124 106 L200 150 L276 106",
      "M200 150 L200 238",
      "M300 206 L336 226 L336 268 L300 288 L264 268 L264 226 Z",
      "M264 226 L300 246 L336 226 M300 246 L300 288",
      "M96 96 L96 204 M90 96 l12 0 M90 204 l12 0",
      "M60 150 l24 0",
    ],
    washes: [
      { d: "M204 66 L280 110 L204 154 L128 110 Z", color: INK.teal },
      { d: "M128 110 L204 154 L204 242 L128 198 Z", color: INK.indigo },
      { d: "M204 154 L280 110 L280 198 L204 242 Z", color: INK.ochre },
      { d: "M304 210 L340 230 L304 250 L268 230 Z", color: INK.teal },
    ],
  },
  controller: {
    width: 3,
    paths: [
      "M112 118 Q112 92 138 92 L262 92 Q288 92 288 118 L302 198 Q306 226 280 226 Q256 226 246 206 L236 190 L164 190 L154 206 Q144 226 120 226 Q94 226 98 198 Z",
      "M140 146 h40 M160 126 v40",
      "M236 128 A7 7 0 1 1 236 142 A7 7 0 1 1 236 128",
      "M256 146 A7 7 0 1 1 256 160 A7 7 0 1 1 256 146",
      "M236 164 A7 7 0 1 1 236 178 A7 7 0 1 1 236 164",
      "M216 146 A7 7 0 1 1 216 160 A7 7 0 1 1 216 146",
      "M164 172 A11 11 0 1 1 186 172 A11 11 0 1 1 164 172",
      "M212 180 A11 11 0 1 1 234 180 A11 11 0 1 1 212 180",
      "M186 112 h28",
    ],
    washes: [
      {
        d: "M116 122 Q116 96 142 96 L266 96 Q292 96 292 122 L306 202 Q310 230 284 230 Q260 230 250 210 L240 194 L168 194 L158 210 Q148 230 124 230 Q98 230 102 202 Z",
        color: INK.bluegrey,
      },
      { d: "M239 131 A7 7 0 1 1 239 145 A7 7 0 1 1 239 131", color: INK.brick },
      { d: "M259 149 A7 7 0 1 1 259 163 A7 7 0 1 1 259 149", color: INK.ochre },
      { d: "M239 167 A7 7 0 1 1 239 181 A7 7 0 1 1 239 167", color: INK.sage },
      { d: "M219 149 A7 7 0 1 1 219 163 A7 7 0 1 1 219 149", color: INK.teal },
    ],
  },
  cat: {
    width: 3,
    paths: [
      "M20 232 L380 232",
      "M20 252 L380 252 M80 232 v20 M160 232 v20 M240 232 v20 M320 232 v20",
      "M232 232 Q214 176 250 150 Q286 176 268 232",
      "M236 150 Q250 118 264 150",
      "M238 150 L234 130 L248 140",
      "M262 150 L266 130 L252 140",
      "M268 226 Q302 214 296 184 Q290 162 274 172",
      "M118 68 A42 42 0 1 0 150 128 A34 34 0 1 1 118 68",
      "M60 60 l0 10 M55 65 l10 0 M330 90 l0 8 M326 94 l8 0 M300 40 l0 8 M296 44 l8 0",
    ],
    washes: [
      { d: "M24 24 L376 24 L376 226 L24 226 Z", color: INK.night },
      { d: "M121 72 A42 42 0 1 0 153 132 A34 34 0 1 1 121 72", color: INK.ochre },
      { d: "M236 234 Q218 180 254 154 Q290 180 272 234 Z", color: INK.warmgrey },
      { d: "M24 236 L376 236 L376 256 L24 256 Z", color: INK.warmgrey },
    ],
  },
  fern: { width: 2.6, ...fern() },
  envelope: {
    width: 3,
    paths: [
      "M62 92 L338 92 L338 230 L62 230 Z",
      "M62 92 L200 184 L338 92",
      "M62 230 L166 160 M338 230 L234 160",
      "M286 108 h40 v46 h-40 z",
      "M292 122 q8 -6 16 0 t16 0 M292 136 q8 -6 16 0 t16 0",
      "M214 184 A14 14 0 1 1 186 184 A14 14 0 1 1 214 184",
      "M194 178 l12 12 M206 178 l-12 12",
    ],
    washes: [
      { d: "M66 96 L342 96 L342 234 L66 234 Z", color: "rgba(150,170,190,.22)" },
      { d: "M290 112 h40 v46 h-40 z", color: INK.teal },
      { d: "M216 186 A14 14 0 1 1 188 186 A14 14 0 1 1 216 186", color: INK.brick },
    ],
  },
} satisfies Record<string, Drawing>;

type DrawingName = keyof typeof drawings;

function isDrawingName(name: string): name is DrawingName {
  return Object.hasOwn(drawings, name);
}

interface Stroke {
  readonly path: Path2D;
  readonly measure: SVGPathElement;
  readonly len: number;
}

interface Item {
  readonly el: HTMLElement;
  readonly drawing: Drawing;
  readonly strokes: readonly Stroke[];
  readonly total: number;
  state: "idle" | "drawing" | "done";
  progress: number;
  start: number;
  duration: number;
  /** When the lines finished, so the wash can bloom in afterwards. */
  doneAt: number;
}

export interface PenTip {
  x: number;
  y: number;
}

export interface PenUpdate {
  /** Whether the drawing masks changed this frame. */
  changed: boolean;
  /** The pen tip in viewport pixels while a drawing is in progress. */
  tip: PenTip | null;
}

const SCALE = 0.5;

const WASH_BLOOM = 1400;

function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("A 2D canvas context is unavailable");
  return ctx;
}

export class DrawingLayer {
  readonly canvas = document.createElement("canvas");
  readonly wash = document.createElement("canvas");
  private readonly ctx = context2d(this.canvas);
  private readonly wctx = context2d(this.wash);
  private readonly svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  private readonly items: Item[] = [];
  private readonly reduce: boolean;
  private active: Item | undefined;
  private dirty = true;

  constructor(elements: Iterable<HTMLElement>, reduce: boolean) {
    this.reduce = reduce;
    const { svg } = this;
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    document.body.appendChild(svg);
    for (const el of elements) {
      const name = el.dataset.draw;
      const drawing = name !== undefined && isDrawingName(name) ? drawings[name] : undefined;
      if (!drawing) continue;
      const strokes = drawing.paths.map((d) => {
        const measure = document.createElementNS("http://www.w3.org/2000/svg", "path");
        measure.setAttribute("d", d);
        svg.appendChild(measure);
        return { path: new Path2D(d), measure, len: measure.getTotalLength() };
      });
      const total = strokes.reduce((a, s) => a + s.len, 0);
      this.items.push({
        el,
        drawing,
        strokes,
        total,
        state: reduce ? "done" : "idle",
        progress: reduce ? 1 : 0,
        start: 0,
        doneAt: -1e9,
        duration: 0.6 + total / 1400,
      });
    }
    this.resize();
    addEventListener("resize", this.resize);
    addEventListener("scroll", this.markDirty, { passive: true });
  }

  dispose() {
    removeEventListener("resize", this.resize);
    removeEventListener("scroll", this.markDirty);
    this.svg.remove();
  }

  private readonly resize = () => {
    this.canvas.width = this.wash.width = Math.max(1, Math.round(innerWidth * SCALE));
    this.canvas.height = this.wash.height = Math.max(1, Math.round(innerHeight * SCALE));
    this.dirty = true;
  };

  private readonly markDirty = () => {
    this.dirty = true;
  };

  /** Advances the pen. Returns the tip while a drawing is in progress, and whether the mask changed. */
  update(now: number): PenUpdate {
    let tip: PenTip | null = null;
    if (!this.reduce) {
      if (!this.active) {
        const vh = innerHeight;
        for (const it of this.items) {
          if (it.state !== "idle") continue;
          const r = it.el.getBoundingClientRect();
          if (r.bottom < 0) {
            it.state = "done";
            it.progress = 1;
            it.doneAt = -1e9;
            this.dirty = true;
            continue;
          }
          if (r.top < vh * 0.78) {
            it.state = "drawing";
            it.start = now;
            this.active = it;
            break;
          }
        }
      }
      if (this.active) {
        const it = this.active;
        const raw = (now - it.start) / 1000 / it.duration;
        it.progress = raw <= 0 ? 0 : raw >= 1 ? 1 : 1 - Math.pow(1 - raw, 2.2);
        tip = this.tipOf(it);
        if (raw >= 1) {
          it.state = "done";
          it.progress = 1;
          it.doneAt = now;
          this.active = undefined;
        }
        this.dirty = true;
      }
      if (this.items.some((it) => it.state === "done" && now - it.doneAt < WASH_BLOOM + 50))
        this.dirty = true;
    }
    const changed = this.dirty;
    if (this.dirty) {
      this.render();
      this.renderWash(now);
      this.dirty = false;
    }
    return { changed, tip };
  }

  private tipOf(it: Item): PenTip {
    const r = it.el.getBoundingClientRect();
    let s = it.progress * it.total;
    const last = it.strokes.at(-1);
    for (const stroke of it.strokes) {
      if (s <= stroke.len || stroke === last) {
        const pt = stroke.measure.getPointAtLength(Math.min(s, stroke.len));
        return { x: r.left + (pt.x / BOX_W) * r.width, y: r.top + (pt.y / BOX_H) * r.height };
      }
      s -= stroke.len;
    }
    return { x: r.left, y: r.top };
  }

  private render() {
    const { ctx, canvas } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const it of this.items) {
      if (it.state === "idle" || it.progress <= 0) continue;
      const r = it.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      ctx.setTransform(
        (r.width * SCALE) / BOX_W,
        0,
        0,
        (r.height * SCALE) / BOX_H,
        r.left * SCALE,
        r.top * SCALE,
      );
      ctx.lineWidth = it.drawing.width;
      const revealed = it.progress * it.total;
      const wetFrom = revealed - it.total * 0.07;
      let cum = 0;
      for (const { path, len } of it.strokes) {
        if (cum >= revealed) break;
        const end = Math.min(len, revealed - cum);
        ctx.strokeStyle = "rgb(255,0,0)";
        ctx.globalCompositeOperation = "source-over";
        ctx.setLineDash(end >= len ? [] : [end, 1e6]);
        ctx.lineDashOffset = 0;
        ctx.stroke(path);
        if (it.state === "drawing" && cum + end > wetFrom) {
          const from = Math.max(0, wetFrom - cum);
          ctx.strokeStyle = "rgb(0,255,0)";
          ctx.globalCompositeOperation = "lighter";
          ctx.setLineDash([end - from, 1e6]);
          ctx.lineDashOffset = -from;
          ctx.stroke(path);
        }
        cum += len;
      }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.setLineDash([]);
  }

  private renderWash(now: number) {
    const { wctx: ctx, wash } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, wash.width, wash.height);
    for (const it of this.items) {
      if (it.state !== "done" || it.drawing.washes.length === 0) continue;
      const r = it.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const bloom = this.reduce ? 1 : Math.min(1, Math.max(0, (now - it.doneAt) / WASH_BLOOM));
      if (bloom <= 0) continue;
      ctx.setTransform(
        (r.width * SCALE) / BOX_W,
        0,
        0,
        (r.height * SCALE) / BOX_H,
        r.left * SCALE,
        r.top * SCALE,
      );
      ctx.globalAlpha = 1 - Math.pow(1 - bloom, 2);
      for (const w of it.drawing.washes) {
        ctx.fillStyle = w.color;
        ctx.fill(new Path2D(w.d));
      }
    }
    ctx.globalAlpha = 1;
  }
}
