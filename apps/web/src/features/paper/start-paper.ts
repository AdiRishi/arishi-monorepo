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
  const canvas = find(root, "#scene", HTMLCanvasElement);
  const sheet = find(root, "main", HTMLElement);
  const inkbox = find(root, "#inkbox", HTMLElement);
  const nib = find(root, "#nib", SVGSVGElement);
  const toast = find(root, "#toast", HTMLElement);
  const rendererEl = find(root, "#renderer", HTMLElement);
  const copy = find(root, "#copy", HTMLButtonElement);
  const mail = find(root, "#mail", HTMLElement);

  // The renderer pulls in vgpu and the shaders, which only the browser needs, so the server
  // bundle never loads it.
  const rendererModule = import("./renderer");

  let disposed = false;
  let raf = 0;
  let layer: DrawingLayer | undefined;
  let renderer: Renderer | undefined;

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(
    (es) => {
      for (const en of es) {
        if (!en.isIntersecting) continue;
        en.target.classList.remove("wait");
        en.target.classList.add("on");
        io.unobserve(en.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  if (!reduce) {
    for (const el of root.querySelectorAll(".rv")) {
      if (el.getBoundingClientRect().top > innerHeight * 0.92) el.classList.add("wait");
      io.observe(el);
    }
    for (const el of root.querySelectorAll(".write")) io.observe(el);
  } else {
    for (const el of root.querySelectorAll(".write")) el.classList.add("on");
  }

  /* ---------- toast + copy ---------- */
  let toastT = 0;
  function say(text: string) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }
  const onCopy = () => {
    const text = mail.textContent.trim();
    const fallback = () => {
      const r = document.createRange();
      r.selectNodeContents(mail);
      const s = getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
      say("Selected. Press copy.");
    };
    // The Clipboard API is missing outside secure contexts.
    if ("clipboard" in navigator)
      navigator.clipboard.writeText(text).then(() => say("Copied " + text), fallback);
    else fallback();
  };
  copy.addEventListener("click", onCopy);

  /* ---------- the pen ---------- */
  function penTo(x: number, y: number) {
    nib.classList.add("on");
    nib.style.transform = `translate(${x - 4}px, ${y - 116}px) rotate(-34deg)`;
  }
  function penUp() {
    nib.classList.remove("on");
  }

  /* ---------- the writing ---------- */
  async function start() {
    if (disposed) return;
    const twoLines = innerWidth < 640;
    inkbox.style.aspectRatio = twoLines ? "1.25 / 1" : "2.4 / 1";
    const mask = await buildInkMask(
      "Adishwar Rishi",
      "अदिश्वर ऋषि",
      2048,
      twoLines ? 1.25 : 2.4,
      twoLines,
    );
    if (disposed) return;
    // Device pixels per CSS pixel, capped where a third pixel per side adds nothing.
    const scale = Math.min(devicePixelRatio, 2);
    const drawingLayer = new DrawingLayer(
      [...root.querySelectorAll(".draw")].filter((el) => el instanceof HTMLElement),
      reduce,
      scale,
    );
    layer = drawingLayer;
    drawingLayer.update(performance.now());
    const prefer: RendererPreference = new URLSearchParams(location.search).has("gl")
      ? "webgl2"
      : "auto";
    const { createRenderer } = await rendererModule;
    if (disposed) return;
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
    if (!r0) {
      rendererEl.textContent = "CSS";
      root.dataset.state = "plain";
      return;
    }
    const active = r0;
    renderer = active;
    rendererEl.textContent = active.kind === "webgpu" ? "WebGPU via vgpu" : "WebGL 2";

    root.dataset.state = "ready";
    const t0 = performance.now() + 300;
    let lastKey = "";

    function frame(now: number) {
      const t = reduce ? 99 : (now - t0) / 1000;

      // name reveal fronts
      const latinF = 1.12 * easeInOut(span(t, W.latin));
      const bodyF = 1.14 * easeInOut(span(t, W.body));
      const headF = 1.03 * easeOut(span(t, W.head));
      const writing = t > 0 && t < W.lift;

      const r = inkbox.getBoundingClientRect();
      const box: [number, number, number, number] = [
        r.left / innerWidth,
        r.top / innerHeight,
        r.right / innerWidth,
        r.bottom / innerHeight,
      ];
      const sr = sheet.getBoundingClientRect();
      const sheetX: [number, number] = [sr.left / innerWidth, sr.right / innerWidth];
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

      const draw = writing ? { changed: false, tip: null } : drawingLayer.update(now);
      if (writing) penTo(tip[0] * innerWidth, tip[1] * innerHeight);
      else if (draw.tip) {
        penTo(draw.tip.x, draw.tip.y);
        tip[0] = draw.tip.x / innerWidth;
        tip[1] = draw.tip.y / innerHeight;
      } else penUp();

      const state: SceneState = {
        box,
        sheet: sheetX,
        tip,
        tipOn: writing || draw.tip ? 1 : 0,
        latinF,
        bodyF,
        headF,
        drawChanged: draw.changed,
      };
      // The scene is still between animations and scrolls, so only a change gets a frame.
      const key = [
        canvas.width,
        canvas.height,
        box,
        sheetX,
        tip,
        state.tipOn,
        latinF,
        bodyF,
        headF,
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
    io.disconnect();
    clearTimeout(toastT);
    copy.removeEventListener("click", onCopy);
    layer?.dispose();
    renderer?.dispose();
  };
}
