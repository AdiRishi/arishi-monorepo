import { name } from "./content";
import { DrawingLayer } from "./drawings";
import { buildInkMask } from "./ink";
import type { Renderer, RendererPreference, SceneState } from "./renderer";

// seconds from the start of the sequence
const W = { latin: [0.3, 1.7], body: [1.85, 2.45], head: [2.5, 2.8], lift: 3.0 } as const;
const easeInOut = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : (1 - Math.cos(t * Math.PI)) / 2);
const easeOut = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));
const span = (t: number, [a, b]: readonly [number, number]) => (t - a) / (b - a);

function find<T extends Element>(
  root: HTMLElement,
  selector: string,
  type: abstract new () => T,
): T {
  const el = root.querySelector(selector);
  if (!(el instanceof type)) throw new Error(`The paper page has no ${selector}`);
  return el;
}

/**
 * Runs the paper page inside `root`: writes the name, draws each section as it scrolls into
 * view, and renders the paper. Returns a function that stops it and releases what it holds.
 */
export function startPaper(root: HTMLElement): () => void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = matchMedia("(max-width: 639px)");
  const canvas = find(root, "#scene", HTMLCanvasElement);
  const inkbox = find(root, "#inkbox", HTMLElement);
  const nib = find(root, "#nib", SVGSVGElement);

  // The renderer pulls in vgpu and the shaders, which only the browser needs, so the server
  // bundle never loads it.
  const rendererModule = import("./renderer");

  let disposed = false;
  let raf = 0;
  let layer: DrawingLayer | undefined;
  let renderer: Renderer | undefined;
  let stopRelaying = () => {};

  /* ---------- the pen ---------- */
  function penTo(x: number, y: number) {
    nib.classList.add("on");
    nib.style.transform = `translate(${x - 4}px, ${y - 116}px) rotate(-34deg)`;
  }
  function penUp() {
    nib.classList.remove("on");
  }

  /* ---------- the writing ---------- */
  async function layName() {
    const mask = await buildInkMask(name.latin, name.devanagari, 2048, narrow.matches);
    if (!disposed) inkbox.style.aspectRatio = `${mask.width} / ${mask.height}`;
    return mask;
  }

  async function start() {
    try {
      await write();
    } finally {
      // Whatever stopped the pen, the name must still be on the page.
      if (!disposed && root.dataset.state === "boot") root.dataset.state = "plain";
    }
  }

  async function write() {
    if (disposed) return;
    let mask = await layName();
    if (disposed) return;
    const drawingLayer = new DrawingLayer(
      [...root.querySelectorAll(".draw")].filter((el) => el instanceof HTMLElement),
      reduce,
    );
    layer = drawingLayer;
    const prefer: RendererPreference = new URLSearchParams(location.search).has("gl")
      ? "webgl2"
      : "auto";
    const { createRenderer } = await rendererModule;
    if (disposed) return;
    // Device pixels per CSS pixel, capped where a third pixel per side adds nothing.
    const scale = Math.min(devicePixelRatio, 2);
    const r0 = await createRenderer(
      canvas,
      mask,
      drawingLayer.canvas,
      drawingLayer.wash,
      scale,
      prefer,
    );
    if (disposed) {
      r0?.dispose();
      return;
    }
    if (!r0) return;
    const active = r0;
    renderer = active;

    root.dataset.state = "ready";
    const t0 = performance.now() + 300;
    let lastKey = "";

    // The name sits on one line or two, so crossing the breakpoint lays it out again.
    const relay = () => {
      layName()
        .then((relaid) => {
          if (disposed) return;
          mask = relaid;
          active.setName(relaid);
          lastKey = "";
        })
        .catch(reportError);
    };
    narrow.addEventListener("change", relay);
    stopRelaying = () => narrow.removeEventListener("change", relay);

    function frame(now: number) {
      const t = reduce ? 99 : (now - t0) / 1000;

      // name reveal fronts
      const latinF = 1.12 * easeInOut(span(t, W.latin));
      const bodyF = 1.14 * easeInOut(span(t, W.body));
      const headF = 1.03 * easeOut(span(t, W.head));
      // The sketches wait their turn, so the pen never leaves the name half written.
      const naming = t < W.lift;
      const writing = naming && t > 0;

      const r = inkbox.getBoundingClientRect();
      const box: [number, number, number, number] = [
        r.left / innerWidth,
        r.top / innerHeight,
        r.right / innerWidth,
        r.bottom / innerHeight,
      ];
      const [mx, my] =
        t < W.body[0]
          ? mask.latinTip(latinF)
          : t < W.head[0]
            ? mask.devTip(bodyF)
            : mask.headTip(headF);
      const tip: [number, number] = [
        box[0] + mx * (box[2] - box[0]),
        box[1] + my * (box[3] - box[1]),
      ];

      const draw = naming ? { changed: false, tip: null } : drawingLayer.update(now);
      if (writing) penTo(tip[0] * innerWidth, tip[1] * innerHeight);
      else if (draw.tip) {
        penTo(draw.tip.x, draw.tip.y);
        tip[0] = draw.tip.x / innerWidth;
        tip[1] = draw.tip.y / innerHeight;
      } else penUp();

      // Whole device pixels, so the paper's grain does not shimmer as the page moves.
      const scroll = Math.round(scrollY * scale) / canvas.height;
      const state: SceneState = {
        box,
        tip,
        tipOn: writing || draw.tip ? 1 : 0,
        latinF,
        bodyF,
        headF,
        scroll,
        drawChanged: draw.changed,
      };
      // The scene is still between animations and scrolls, so only a change gets a frame.
      const key = [
        canvas.width,
        canvas.height,
        box,
        tip,
        state.tipOn,
        latinF,
        bodyF,
        headF,
        scroll,
      ].join();
      if (draw.changed || key !== lastKey) {
        lastKey = key;
        active.render(state);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }

  document.fonts.ready.then(start, start).catch(reportError);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    stopRelaying();
    layer?.dispose();
    renderer?.dispose();
  };
}
