import {
  effect,
  frame,
  init,
  sampler,
  surface,
  texture,
  type Effect,
  type Gpu,
  type Surface,
  type Texture,
} from "vgpu";

import paperGlsl from "./paper.glsl?raw";
import paperWgsl from "./paper.wgsl";

export interface SceneState {
  /** Name box in viewport fractions, top-left origin: x0, y0, x1, y1. */
  box: readonly [number, number, number, number];
  /** The sheet's left and right edges as viewport fractions. */
  sheet: readonly [number, number];
  tip: readonly [number, number];
  tipOn: number;
  latinF: number;
  bodyF: number;
  headF: number;
  /** True when the drawings canvas changed since the last frame. */
  drawChanged: boolean;
}

export interface Renderer {
  readonly kind: "webgpu" | "webgl2";
  render(s: SceneState): void;
  dispose(): void;
}

export type RendererPreference = "auto" | "webgl2";

export interface RawImage {
  readonly data: Uint8Array;
  readonly width: number;
  readonly height: number;
}

export async function createRenderer(
  canvas: HTMLCanvasElement,
  name: RawImage,
  draw: HTMLCanvasElement,
  wash: HTMLCanvasElement,
  scale: number,
  prefer: RendererPreference,
): Promise<Renderer | null> {
  if (prefer === "auto" && navigator.gpu) {
    try {
      return await createWebGpu(canvas, name, draw, wash, scale);
    } catch (err) {
      console.warn("vgpu unavailable, using WebGL2", err);
    }
  }
  return createWebGl2(canvas, name, draw, wash, scale);
}

async function createWebGpu(
  canvas: HTMLCanvasElement,
  name: RawImage,
  draw: HTMLCanvasElement,
  wash: HTMLCanvasElement,
  scale: number,
): Promise<Renderer> {
  const gpu: Gpu = await init({ powerPreference: "high-performance" });
  const surf: Surface = surface(gpu, canvas, { dpr: scale, alphaMode: "opaque" });

  const upload = (src: HTMLCanvasElement, label: string): Texture => {
    const t = texture(gpu, {
      kind: "2d",
      size: [src.width, src.height],
      format: "rgba8unorm",
      usage: ["texture_binding", "copy_dst", "render_attachment"],
      label,
    });
    gpu.gpu.queue.copyExternalImageToTexture({ source: src }, { texture: t.gpu }, [
      src.width,
      src.height,
    ]);
    return t;
  };
  const inkTex = texture(gpu, {
    kind: "2d",
    size: [name.width, name.height],
    format: "rgba8unorm",
    usage: ["texture_binding", "copy_dst"],
    label: "name",
  });
  gpu.gpu.queue.writeTexture({ texture: inkTex.gpu }, name.data, { bytesPerRow: name.width * 4 }, [
    name.width,
    name.height,
  ]);
  // a canvas-backed texture that follows the canvas size
  const dynamic = (initial: Texture, src: HTMLCanvasElement, bind: string) => {
    let tex = initial;
    const label = bind;
    return {
      get tex() {
        return tex;
      },
      update() {
        if (tex.gpu.width !== src.width || tex.gpu.height !== src.height) {
          const next = upload(src, label);
          paperFx.set({ [bind]: next });
          tex.destroy();
          tex = next;
        } else {
          gpu.gpu.queue.copyExternalImageToTexture({ source: src }, { texture: tex.gpu }, [
            src.width,
            src.height,
          ]);
        }
      },
      destroy() {
        tex.destroy();
      },
    };
  };
  const drawTex = upload(draw, "drawings");
  const washTex = upload(wash, "wash");

  const paperFx: Effect = effect(gpu, paperWgsl, {
    label: "paper",
    set: {
      p: {
        res: [1, 1],
        tip: [0, 0],
        sheet: [0, 1],
        box: [0, 0, 1, 1],
        latinF: 0,
        bodyF: 0,
        headF: 0,
        tipOn: 0,
      },
      inkTex,
      drawTex,
      washTex,
      samp: sampler(gpu, {
        magFilter: "linear",
        minFilter: "linear",
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge",
      }),
    },
  });
  await paperFx.compile(surf);
  const drawings = dynamic(drawTex, draw, "drawTex");
  const washes = dynamic(washTex, wash, "washTex");

  return {
    kind: "webgpu",
    render(s) {
      if (s.drawChanged) {
        drawings.update();
        washes.update();
      }
      frame(gpu, (fr) => {
        paperFx.set({
          p: {
            res: [canvas.width, canvas.height],
            tip: s.tip,
            sheet: s.sheet,
            box: s.box,
            latinF: s.latinF,
            bodyF: s.bodyF,
            headF: s.headF,
            tipOn: s.tipOn,
          },
        });
        fr.pass(surf, paperFx);
      });
    },
    dispose() {
      paperFx.dispose();
      inkTex.destroy();
      drawings.destroy();
      washes.destroy();
      surf.dispose();
      gpu.dispose();
    },
  };
}

function createWebGl2(
  canvas: HTMLCanvasElement,
  name: RawImage,
  draw: HTMLCanvasElement,
  wash: HTMLCanvasElement,
  scale: number,
): Renderer | null {
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;
  const vs = `#version 300 es
void main(){ vec2 p = vec2(gl_VertexID==1?3.0:-1.0, gl_VertexID==2?3.0:-1.0); gl_Position = vec4(p,0.0,1.0); }`;
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  };
  const v = compile(gl.VERTEX_SHADER, vs),
    f = compile(gl.FRAGMENT_SHADER, paperGlsl);
  if (!v || !f) return null;
  const pr = gl.createProgram();
  gl.attachShader(pr, v);
  gl.attachShader(pr, f);
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(pr));
    return null;
  }
  gl.useProgram(pr);
  const u = (n: string) => gl.getUniformLocation(pr, n);
  const U = {
    res: u("uRes"),
    box: u("uBox"),
    tip: u("uTip"),
    sheet: u("uSheet"),
    latinF: u("uLatinF"),
    bodyF: u("uBodyF"),
    headF: u("uHeadF"),
    tipOn: u("uTipOn"),
    ink: u("uInk"),
    draw: u("uDraw"),
    wash: u("uWash"),
  };
  const makeTex = (src: HTMLCanvasElement | RawImage) => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (src instanceof HTMLCanvasElement)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    else
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        src.width,
        src.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        src.data,
      );
    return t;
  };
  const inkTex = makeTex(name),
    drawTex = makeTex(draw),
    washTex = makeTex(wash);

  const resize = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * scale)),
      h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };
  resize();
  addEventListener("resize", resize);

  return {
    kind: "webgl2",
    render(s) {
      resize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(pr);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, inkTex);
      gl.uniform1i(U.ink, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, drawTex);
      gl.uniform1i(U.draw, 1);
      if (s.drawChanged) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, draw);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, washTex);
      gl.uniform1i(U.wash, 2);
      if (s.drawChanged) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wash);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform4f(U.box, s.box[0], s.box[1], s.box[2], s.box[3]);
      gl.uniform2f(U.tip, s.tip[0], s.tip[1]);
      gl.uniform2f(U.sheet, s.sheet[0], s.sheet[1]);
      gl.uniform1f(U.latinF, s.latinF);
      gl.uniform1f(U.bodyF, s.bodyF);
      gl.uniform1f(U.headF, s.headF);
      gl.uniform1f(U.tipOn, s.tipOn);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      removeEventListener("resize", resize);
      gl.deleteProgram(pr);
      gl.deleteTexture(inkTex);
      gl.deleteTexture(drawTex);
      gl.deleteTexture(washTex);
    },
  };
}
