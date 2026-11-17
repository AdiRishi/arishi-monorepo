import { expect, it } from "vitest";

import { name } from "@/features/paper/content";
import { buildInkMask } from "@/features/paper/ink";

it("writes each glyph of a two-line name within a single line's pass", async () => {
  const mask = await buildInkMask(name.latin, name.devanagari, 1024, true);
  const { data, width, height } = mask;
  const inked = (p: number) => (data[p * 4] ?? 0) > 40;

  // The pen moves to the second line halfway through the Latin reveal. The end of the first
  // line and the start of the second both round to 128, so that order belongs to neither.
  const splitGlyphs: { x: number; y: number }[] = [];
  const seen = new Uint8Array(width * height);
  for (let start = 0; start < width * height; start++) {
    if (seen[start] || !inked(start)) continue;
    seen[start] = 1;
    const stack = [start];
    let firstLine = false;
    let secondLine = false;
    while (stack.length > 0) {
      const p = stack.pop() ?? 0;
      const order = data[p * 4 + 3] ?? 0;
      if (order < 128) firstLine = true;
      if (order > 128) secondLine = true;
      const x = p % width;
      for (const q of [x > 0 ? p - 1 : -1, x < width - 1 ? p + 1 : -1, p - width, p + width]) {
        if (q >= 0 && q < width * height && !seen[q] && inked(q)) {
          seen[q] = 1;
          stack.push(q);
        }
      }
    }
    if (firstLine && secondLine)
      splitGlyphs.push({ x: start % width, y: Math.floor(start / width) });
  }

  expect(splitGlyphs).toEqual([]);
});
