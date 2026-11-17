/**
 * What the pen draws as the reader scrolls: line sketches with a watercolour wash, and the
 * signature. Each is a list of SVG paths in its own box, in the order a hand would draw them. The
 * pen moves at one speed along every line, so a drawing takes as long as its lines are long. The
 * layer strokes the revealed part of everything visible into one viewport-sized mask that the
 * paper shader renders as ink: R = coverage, G = how recently the ink went down.
 */
export interface Wash {
  readonly d: string;
  readonly color: string;
}

export interface Sketch {
  /** Width and height of the box the paths are drawn in. */
  readonly box: readonly [number, number];
  /** Line width in box units. */
  readonly line: number;
  readonly paths: readonly string[];
  /** Watercolour under the ink, filled after the lines are down. */
  readonly washes: readonly Wash[];
}

const WASH = {
  bluegrey: "rgba(96,124,160,.3)",
  ochre: "rgba(214,160,70,.36)",
  sage: "rgba(120,150,100,.32)",
  brick: "rgba(178,58,42,.3)",
};

/** The box and line every section sketch shares. */
const SCENE = { box: [400, 300], line: 2 } as const;

export const sketches = {
  sydney: {
    ...SCENE,
    paths: [
      "M8 238 L392 238",
      "M12 204 L160 204",
      "M26 204 Q86 108 146 204",
      "M36 204 Q86 152 136 204",
      "M50 204 V173 M68 204 V160 M86 204 V156 M104 204 V160 M122 204 V173",
      "M22 238 V186 L30 186 V204 M150 238 V186 L142 186 V204",
      "M180 238 L186 226 L372 226 L378 238",
      "M198 226 C200 170 226 122 264 98 C259 118 259 140 261 158",
      "M242 226 C246 188 264 152 292 134 C289 152 290 170 293 187",
      "M278 226 C282 204 294 180 312 168 C310 188 316 210 324 226",
      "M368 226 C366 196 352 168 330 152 C334 178 332 206 324 226",
      "M348 62 A18 18 0 1 1 312 62 A18 18 0 1 1 348 62",
      "M60 74 q8 -8 16 0 M76 74 q8 -8 16 0",
      "M118 54 q7 -7 14 0 M132 54 q7 -7 14 0",
      "M44 256 q9 -5 18 0 t18 0 M206 260 q9 -5 18 0 t18 0 t18 0 M318 254 q9 -5 18 0 t18 0",
    ],
    washes: [
      {
        d: "M2 243 C80 238 150 246 230 241 C300 237 350 244 398 240 L394 268 C320 274 250 266 170 271 C100 275 50 268 6 272 Z",
        color: WASH.bluegrey,
      },
      { d: "M352 66 A19 19 0 1 1 314 66 A19 19 0 1 1 352 66", color: WASH.ochre },
    ],
  },
  payments: {
    ...SCENE,
    paths: [
      "M54 110 L228 82 Q240 81 242 92 L256 179 Q258 191 246 193 L72 221 Q60 222 58 211 L44 124 Q43 112 54 110 Z",
      "M70 142 Q69 138 73 137 L97 134 Q101 133 101 137 L104 155 Q105 159 101 159 L77 163 Q73 164 72 160 Z",
      "M71 151 L83 149 M91 148 L103 146",
      "M78 193 L101 190 M113 188 L137 184 M149 182 L173 178 M184 176 L208 173",
      "M205 114 Q214 123 208 134 M216 105 Q232 120 221 140",
      "M262 206 A44 13 0 1 0 350 206 A44 13 0 1 0 262 206",
      "M262 206 V220 A44 13 0 0 0 350 220 V206",
      "M262 220 V234 A44 13 0 0 0 350 234 V220",
      "M262 234 V248 A44 13 0 0 0 350 248 V234",
      "M306 204 C304 188 308 172 306 156",
      "M306 162 C292 160 282 148 284 134 C298 136 308 148 306 162",
      "M306 176 C320 176 332 166 332 152 C318 152 306 162 306 176",
    ],
    washes: [
      { d: "M50 117 L236 83 L259 185 L71 227 Z", color: WASH.bluegrey },
      { d: "M71 140 L103 135 L107 160 L75 165 Z", color: WASH.ochre },
      {
        d: "M258 208 C262 192 352 192 354 208 L356 250 C340 268 276 268 260 250 Z",
        color: WASH.ochre,
      },
      {
        d: "M306 164 C290 162 280 148 282 132 C300 134 312 148 306 164 M306 178 C322 180 336 168 334 150 C318 150 304 162 306 178",
        color: WASH.sage,
      },
    ],
  },
  laptop: {
    ...SCENE,
    paths: [
      "M110 190 L110 84 Q110 72 122 72 L278 72 Q290 72 290 84 L290 190",
      "M96 190 L304 190 L326 216 L74 216 Z",
      "M74 216 V221 Q74 226 80 226 L320 226 Q326 226 326 221 V216",
      "M130 98 L141 106 L130 114 M148 114 H164",
      "M130 136 H196 M130 152 H232 M130 168 H178",
      "M340 176 L344 216 Q345 226 354 226 L370 226 Q379 226 380 216 L384 176 Z",
      "M383 186 Q398 186 396 200 Q394 212 381 210",
      "M354 162 q-6 -8 0 -16 q6 -8 0 -16 M368 162 q-6 -8 0 -16",
      "M30 228 L64 228 M336 228 L398 228",
    ],
    washes: [
      { d: "M114 78 L292 74 L294 188 L112 192 Z", color: WASH.bluegrey },
      { d: "M342 180 L388 178 L382 222 Q378 230 356 228 L346 222 Z", color: WASH.brick },
      { d: "M128 96 L168 96 L168 118 L128 118 Z", color: WASH.ochre },
    ],
  },
  plane: {
    ...SCENE,
    paths: [
      "M30 262 C80 258 112 222 140 196 C176 162 196 112 160 108 C124 104 128 168 176 164 C204 162 216 140 226 126",
      "M350 64 L232 104 L274 114 Z",
      "M350 64 L274 114 L290 150 Z",
      "M274 114 L262 138 L290 150",
    ],
    washes: [
      { d: "M352 70 L276 118 L294 154 Z", color: WASH.bluegrey },
      { d: "M278 118 L266 142 L294 154 Z", color: WASH.brick },
    ],
  },
  park: {
    ...SCENE,
    paths: [
      "M16 238 L384 238",
      "M112 238 C116 214 110 194 116 170 M136 238 C132 214 138 194 132 170",
      "M88 172 C58 168 54 128 82 118 C78 84 120 68 140 90 C164 70 200 96 184 126 C208 140 194 176 164 172 C148 186 104 186 88 172 Z",
      "M124 170 C124 156 118 148 108 142 M126 160 C130 150 138 146 148 142",
      "M218 208 L338 208 M222 186 L334 186 M222 196 L334 196",
      "M228 208 V238 M328 208 V238 M226 208 V180 M330 208 V180",
      "M276 80 q8 -8 16 0 M292 80 q8 -8 16 0",
      "M322 58 q7 -7 14 0 M336 58 q7 -7 14 0",
      "M52 238 l4 -9 l4 9 M176 238 l4 -9 l4 9 M356 238 l4 -9 l4 9",
    ],
    washes: [
      {
        d: "M84 176 C50 170 48 126 78 114 C76 78 124 64 144 86 C170 66 208 96 190 128 C214 144 198 182 166 176 C148 192 104 190 84 176 Z",
        color: WASH.sage,
      },
      { d: "M218 182 L340 180 L342 212 L220 214 Z", color: WASH.ochre },
      {
        d: "M8 242 C100 238 220 246 392 240 L388 256 C260 262 120 256 12 260 Z",
        color: "rgba(120,150,100,.2)",
      },
    ],
  },
} satisfies Record<string, Sketch>;

export type SketchName = keyof typeof sketches;

/** Adi, signed in three strokes: the A, then the d and i running into the swash, then the dot. */
export const signature = {
  box: [300, 165],
  line: 2.5,
  paths: [
    "M16.5 118.5 C30 126 49.5 117 66 91.5 C82.5 66 96 39 109.5 21 C112.5 17.5 115.5 18 115 24 C112.5 52.5 111 87 114 112.5 C115 118.5 112.5 120 109.5 114 C102 99 84 82.5 69 81 C57 79.5 60 88.5 75 88.5 C97.5 88.5 126 81 147 78",
    "M169.5 84 C159 73.5 139.5 78 135 94.5 C130.5 109.5 142.5 117 153 109.5 C162 102 169.5 88.5 174 73.5 C181.5 49.5 189 27 196.5 16.5 C201 10.5 205.5 13.5 201 25.5 C192 49.5 180 84 177 105 C175.5 117 183 118.5 192 109.5 C198 103.5 202.5 96 207 87 C204 99 201 109.5 204 115.5 C208.5 121.5 219 112.5 226.5 102 C247.5 75 264 90 247.5 112.5 C225 139.5 150 147 52.5 139.5 C34.5 138 30 133.5 45 132",
    "M216.5 66 l4.5 -4",
  ],
  washes: [],
} satisfies Sketch;

const drawings: Record<SketchName | "signature", Sketch> = { ...sketches, signature };

function isDrawingName(name: string): name is keyof typeof drawings {
  return Object.hasOwn(drawings, name);
}

interface Stroke {
  readonly path: Path2D;
  readonly measure: SVGPathElement;
  readonly len: number;
  /** Seconds into the drawing when the pen touches down to start this stroke. */
  readonly at: number;
}

interface Item {
  readonly el: HTMLElement;
  readonly sketch: Sketch;
  readonly strokes: readonly Stroke[];
  /** Seconds the pen takes, with its moves between strokes. */
  readonly duration: number;
  state: "idle" | "drawing" | "done";
  /** Seconds since the pen started this drawing. */
  elapsed: number;
  start: number;
  /** When the lines finished, so the wash can bloom in afterwards. */
  doneAt: number;
}

export interface PenTip {
  x: number;
  y: number;
  /** False while the pen moves between strokes. */
  down: boolean;
}

export interface PenUpdate {
  /** Whether the drawing masks changed this frame. */
  changed: boolean;
  /** The pen tip in viewport pixels while a drawing is in progress. */
  tip: PenTip | null;
}

/** Box units of line the pen draws each second. A sketch box is 176 to 300 CSS px wide. */
const PEN_SPEED = 700;
/** How many times faster the pen moves between strokes than along them. */
const HOP_SPEED = 4;
/** Seconds the pen stays lifted after one drawing before it starts the next. */
export const PEN_REST = 0.3;
/** Box units behind the pen where the ink is still wet. */
const WET = 140;
/**
 * Mask pixels per CSS pixel. The shader thresholds the mask into ink, which hardens every pixel
 * edge, so the mask is always two pixels per CSS pixel and a 1x screen still gets smooth lines.
 */
const MASK_SCALE = 2;
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
  private readonly scale = MASK_SCALE;
  private active: Item | undefined;
  /** The pen picks up no new drawing before this time. */
  private restUntil = 0;
  private dirty = true;

  constructor(elements: Iterable<HTMLElement>, reduce: boolean) {
    this.reduce = reduce;
    const { svg } = this;
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    document.body.appendChild(svg);
    for (const el of elements) {
      const name = el.dataset.sketch;
      if (name === undefined || !isDrawingName(name)) continue;
      const sketch = drawings[name];
      // A canvas dash restarts on every subpath, so each subpath is its own stroke and the pen
      // reveals them one at a time.
      const measured = sketch.paths
        .flatMap((d) => d.split(/(?=M)/))
        .map((d) => {
          const measure = document.createElementNS("http://www.w3.org/2000/svg", "path");
          measure.setAttribute("d", d);
          svg.appendChild(measure);
          return { path: new Path2D(d), measure, len: measure.getTotalLength() };
        });
      let t = 0;
      const strokes = measured.map((stroke, index) => {
        const at = t;
        t += stroke.len / PEN_SPEED;
        const next = measured[index + 1];
        if (next) {
          const from = stroke.measure.getPointAtLength(stroke.len);
          const to = next.measure.getPointAtLength(0);
          t += Math.hypot(to.x - from.x, to.y - from.y) / (PEN_SPEED * HOP_SPEED);
        }
        return { ...stroke, at };
      });
      this.items.push({
        el,
        sketch,
        strokes,
        duration: t,
        state: reduce ? "done" : "idle",
        elapsed: reduce ? t : 0,
        start: 0,
        doneAt: -1e9,
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
    this.canvas.width = this.wash.width = Math.max(1, Math.round(innerWidth * this.scale));
    this.canvas.height = this.wash.height = Math.max(1, Math.round(innerHeight * this.scale));
    this.dirty = true;
  };

  private readonly markDirty = () => {
    this.dirty = true;
  };

  private finish(it: Item, doneAt: number) {
    it.state = "done";
    it.elapsed = it.duration;
    it.doneAt = doneAt;
    this.dirty = true;
  }

  /** Advances the pen. Returns the tip while a drawing is in progress, and whether the mask changed. */
  update(now: number): PenUpdate {
    let tip: PenTip | null = null;
    if (!this.reduce) {
      if (this.active) {
        const r = this.active.el.getBoundingClientRect();
        // The reader scrolled away mid-drawing, so it finishes unseen and frees the pen.
        if (r.bottom < 0 || r.top > innerHeight) {
          this.finish(this.active, -1e9);
          this.active = undefined;
        }
      }
      if (!this.active && now >= this.restUntil) {
        const vh = innerHeight;
        for (const it of this.items) {
          if (it.state !== "idle") continue;
          const r = it.el.getBoundingClientRect();
          if (r.bottom < 0) {
            this.finish(it, -1e9);
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
        it.elapsed = Math.min(it.duration, Math.max(0, (now - it.start) / 1000));
        tip = this.tipOf(it);
        if (it.elapsed >= it.duration) {
          this.finish(it, now);
          this.active = undefined;
          this.restUntil = now + PEN_REST * 1000;
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

  /** Length of this stroke the pen has drawn so far. */
  private drawn(it: Item, stroke: Stroke) {
    return Math.min(stroke.len, Math.max(0, (it.elapsed - stroke.at) * PEN_SPEED));
  }

  private tipOf(it: Item): PenTip {
    const r = it.el.getBoundingClientRect();
    const [w, h] = it.sketch.box;
    const at = (pt: DOMPoint, down: boolean) => ({
      x: r.left + (pt.x / w) * r.width,
      y: r.top + (pt.y / h) * r.height,
      down,
    });
    const index = it.strokes.findLastIndex((s) => s.at <= it.elapsed);
    const stroke = it.strokes[index];
    if (!stroke) return { x: r.left, y: r.top, down: false };
    const len = this.drawn(it, stroke);
    const next = it.strokes[index + 1];
    if (len < stroke.len || !next) return at(stroke.measure.getPointAtLength(len), true);
    // Between strokes the pen glides in the air from the end of one to the start of the next.
    const lifted = it.elapsed - stroke.at - stroke.len / PEN_SPEED;
    const u = Math.min(1, lifted / Math.max(1e-6, next.at - (stroke.at + stroke.len / PEN_SPEED)));
    const from = stroke.measure.getPointAtLength(stroke.len);
    const to = next.measure.getPointAtLength(0);
    return at(new DOMPoint(from.x + (to.x - from.x) * u, from.y + (to.y - from.y) * u), false);
  }

  private render() {
    const { ctx, canvas } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const it of this.items) {
      if (it.state === "idle" || it.elapsed <= 0) continue;
      const r = it.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const { scale } = this;
      const [w, h] = it.sketch.box;
      ctx.setTransform(
        (r.width * scale) / w,
        0,
        0,
        (r.height * scale) / h,
        r.left * scale,
        r.top * scale,
      );
      ctx.lineWidth = it.sketch.line;
      const wet = it.strokes.reduce((a, s) => a + this.drawn(it, s), 0) - WET;
      let cum = 0;
      for (const stroke of it.strokes) {
        const { path, len } = stroke;
        const end = this.drawn(it, stroke);
        if (end <= 0) break;
        ctx.strokeStyle = "rgb(255,0,0)";
        ctx.globalCompositeOperation = "source-over";
        ctx.setLineDash(end >= len ? [] : [end, 1e6]);
        ctx.lineDashOffset = 0;
        ctx.stroke(path);
        if (it.state === "drawing" && cum + end > wet) {
          const from = Math.max(0, wet - cum);
          ctx.strokeStyle = "rgb(0,255,0)";
          ctx.globalCompositeOperation = "lighter";
          ctx.setLineDash([end - from, 1e6]);
          ctx.lineDashOffset = -from;
          ctx.stroke(path);
        }
        cum += end;
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
      if (it.state !== "done" || it.sketch.washes.length === 0) continue;
      const r = it.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const bloom = this.reduce ? 1 : Math.min(1, Math.max(0, (now - it.doneAt) / WASH_BLOOM));
      if (bloom <= 0) continue;
      const { scale } = this;
      const [w, h] = it.sketch.box;
      ctx.setTransform(
        (r.width * scale) / w,
        0,
        0,
        (r.height * scale) / h,
        r.left * scale,
        r.top * scale,
      );
      ctx.globalAlpha = 1 - Math.pow(1 - bloom, 2);
      for (const wash of it.sketch.washes) {
        ctx.fillStyle = wash.color;
        ctx.fill(new Path2D(wash.d));
      }
    }
    ctx.globalAlpha = 1;
  }
}
