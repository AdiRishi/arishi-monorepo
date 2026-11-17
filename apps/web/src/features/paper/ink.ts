/**
 * Builds the ink mask the paper shader writes the name from. Raw RGBA bytes, never a canvas,
 * because a canvas premultiplies alpha and the alpha channel carries data here:
 *   R = the Latin name, G = Devanagari letter bodies, B = the Devanagari headline (shirorekha),
 *   A = writing order, 0 to 1 within each channel's own stroke sequence.
 * The headline is split out so the shader writes the bodies first and rules the line across
 * afterwards, which is the order a hand writes Devanagari.
 */
export interface InkMask {
  readonly data: Uint8Array;
  readonly width: number;
  readonly height: number;
  /** Pen tip in mask fractions for a Latin reveal front in [0, 1]. */
  latinTip(front: number): readonly [number, number];
  /** Pen tip for a Devanagari body front in [0, 1]. */
  devTip(front: number): readonly [number, number];
  /** Pen tip for the headline front in [0, 1]. */
  headTip(front: number): readonly [number, number];
}

interface Line {
  x0: number;
  x1: number;
  top: number;
  bottom: number;
  tipY: Float32Array;
}

interface LatinLine extends Line {
  readonly index: number;
  readonly ink: Uint8ClampedArray;
  readonly sum: Float32Array;
  readonly weight: Float32Array;
}

const SHEAR = 0.09;

/** Blank border around the ink, as a fraction of the Latin size, so the shader's blur has room. */
const PAD = 0.02;

/**
 * Lays the name out to fill `width` and returns a mask exactly as tall as the ink needs, so the
 * caller can size the name's box from the mask and leave no dead space around it.
 */
export async function buildInkMask(
  latin: string,
  devanagari: string,
  width: number,
  twoLines: boolean,
): Promise<InkMask> {
  const latFamily = `italic 300 100px "Newsreader"`;
  const devFamily = `400 100px "Tiro Devanagari Sanskrit"`;
  await Promise.all([
    document.fonts.load(latFamily, latin),
    document.fonts.load(devFamily, devanagari),
  ]);

  const glyphs = document.createElement("canvas");
  const g = glyphs.getContext("2d", { willReadFrequently: true });
  if (!g) throw new Error("A 2D canvas context is unavailable");

  // Metrics at 100px, as fractions of the font size.
  const lines = twoLines ? latin.split(" ") : [latin];
  g.font = latFamily;
  const latMetrics = lines.map((text) => g.measureText(text));
  const overhang = Math.max(...latMetrics.map((m) => m.actualBoundingBoxLeft)) / 100;
  const reach = Math.max(...latMetrics.map((m) => m.actualBoundingBoxRight)) / 100;
  const ascent = Math.max(...latMetrics.map((m) => m.actualBoundingBoxAscent)) / 100;
  g.font = devFamily;
  const devMetrics = g.measureText(devanagari);

  const latSize = width / (overhang + reach + 2 * PAD);
  const pad = latSize * PAD;
  const devSize = latSize * (twoLines ? 0.34 : 0.3);
  const latBase = lines.map((_, index) => pad + latSize * (ascent + index * 0.92));
  const devBase =
    (latBase.at(-1) ?? 0) + latSize * 0.24 + (devSize * devMetrics.actualBoundingBoxAscent) / 100;
  const height = Math.ceil(devBase + (devSize * devMetrics.actualBoundingBoxDescent) / 100 + pad);

  glyphs.width = width;
  glyphs.height = height;
  g.fillStyle = "#fff";
  g.textBaseline = "alphabetic";

  g.font = `italic 300 ${latSize}px "Newsreader"`;
  const latX = pad + latSize * overhang;
  // Each line is drawn on its own, so a pixel belongs to the line whose glyph inked it. The
  // lines' boxes overlap, and the second line's capitals and ascenders reach into the first's.
  const latLines: LatinLine[] = lines.map((text, index) => {
    const base = latBase[index] ?? 0;
    g.clearRect(0, 0, width, height);
    g.fillText(text, latX, base);
    const w = g.measureText(text).width;
    return {
      index,
      ink: g.getImageData(0, 0, width, height).data,
      x0: latX,
      x1: latX + w,
      top: base - latSize * 0.78,
      bottom: base + latSize * 0.28,
      tipY: new Float32Array(width),
      sum: new Float32Array(width),
      weight: new Float32Array(width),
    };
  });
  const lastLine = latLines.at(-1);
  if (!lastLine) throw new Error("The Latin name has no lines");

  g.clearRect(0, 0, width, height);
  g.font = `400 ${devSize}px "Tiro Devanagari Sanskrit"`;
  g.fillText(devanagari, pad + (devSize * devMetrics.actualBoundingBoxLeft) / 100, devBase);
  const dev = g.getImageData(0, 0, width, height);

  // Devanagari glyph bounds and the headline band: the densest rows in the upper half
  const rowCov = new Float32Array(height);
  let xmin = width,
    xmax = 0,
    ymin = height,
    ymax = 0;
  for (let y = 0; y < height; y++) {
    let cov = 0;
    for (let x = 0; x < width; x++) {
      if ((dev.data[(y * width + x) * 4 + 3] ?? 0) > 40) {
        cov++;
        if (x < xmin) xmin = x;
        if (x > xmax) xmax = x;
        if (y < ymin) ymin = y;
        if (y > ymax) ymax = y;
      }
    }
    rowCov[y] = cov;
  }
  const span = Math.max(1, xmax - xmin);
  let best = ymin,
    bestCov = 0;
  for (let y = ymin; y < ymin + (ymax - ymin) * 0.5; y++) {
    const cov = rowCov[y] ?? 0;
    if (cov > bestCov) {
      bestCov = cov;
      best = y;
    }
  }
  let b0 = best,
    b1 = best;
  while (b0 > ymin && (rowCov[b0 - 1] ?? 0) > span * 0.32) b0--;
  while (b1 < ymax && (rowCov[b1 + 1] ?? 0) > span * 0.32) b1++;
  b0 = Math.max(ymin, b0 - 1);
  b1 = Math.min(ymax, b1 + 1);

  const devLine: Line = {
    x0: xmin,
    x1: xmax,
    top: ymin,
    bottom: ymax,
    tipY: new Float32Array(width),
  };
  const devSum = new Float32Array(width),
    devW = new Float32Array(width);

  const data = new Uint8Array(width * height * 4);
  const n = latLines.length;
  for (let y = 0; y < height; y++) {
    const inBand = y >= b0 && y <= b1;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      let l = 0;
      let r: LatinLine | undefined;
      for (const line of latLines) {
        const a = line.ink[i + 3] ?? 0;
        if (a > l) {
          l = a;
          r = line;
        }
      }
      const d = dev.data[i + 3] ?? 0;
      let order = 0;
      if (r) {
        const u = Math.min(
          1,
          Math.max(0, (x - r.x0) / (r.x1 - r.x0) + SHEAR * ((y - r.top) / (r.bottom - r.top))),
        );
        order = (r.index + u) / n;
        if (l > 40) {
          r.sum[x] = (r.sum[x] ?? 0) + y * l;
          r.weight[x] = (r.weight[x] ?? 0) + l;
        }
      } else if (d > 0) {
        if (inBand) order = (x - xmin) / span;
        else {
          order = Math.min(1, (x - xmin) / span + SHEAR * ((y - ymin) / (ymax - ymin)));
          if (d > 40) {
            devSum[x] = (devSum[x] ?? 0) + y * d;
            devW[x] = (devW[x] ?? 0) + d;
          }
        }
      }
      data[i] = l;
      data[i + 1] = inBand ? 0 : d;
      data[i + 2] = inBand ? d : 0;
      data[i + 3] = Math.round(order * 255);
    }
  }

  const smooth = (sum: Float32Array, w: Float32Array, line: Line, fallback: number) => {
    const raw = new Float32Array(width);
    let last = fallback;
    for (let x = 0; x < width; x++) {
      const weight = w[x] ?? 0;
      if (weight > 0) last = (sum[x] ?? 0) / weight;
      raw[x] = last;
    }
    for (let x = 0; x < width; x++) {
      let s = 0,
        c = 0;
      for (let k = -14; k <= 14; k++) {
        const j = x + k;
        if (j >= 0 && j < width) {
          s += raw[j] ?? 0;
          c++;
        }
      }
      line.tipY[x] = s / c / height;
    }
  };
  for (const line of latLines) smooth(line.sum, line.weight, line, (line.top + line.bottom) / 2);
  smooth(devSum, devW, devLine, (b0 + b1) / 2);

  const tipOn = (line: Line, u: number): readonly [number, number] => {
    const x = line.x0 + Math.min(1, Math.max(0, u - SHEAR * 0.5)) * (line.x1 - line.x0);
    return [x / width, line.tipY[Math.min(width - 1, Math.max(0, Math.round(x)))] ?? 0];
  };
  return {
    data,
    width,
    height,
    latinTip(front) {
      const f = Math.min(0.999, Math.max(0, front)) * n;
      const li = Math.floor(f);
      return tipOn(latLines[li] ?? lastLine, f - li);
    },
    devTip(front) {
      return tipOn(devLine, front);
    },
    headTip(front) {
      return [(xmin + Math.min(1, Math.max(0, front)) * span) / width, (b0 + b1) / 2 / height];
    },
  };
}
