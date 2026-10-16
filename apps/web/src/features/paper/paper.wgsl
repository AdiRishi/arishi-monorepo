// Paper and ink. Samples the name mask (static, placed in `box`) and the drawings mask
// (viewport-sized, redrawn as the pen moves) and renders both as the same ink. The drawings
// mask carries black ink in R and red in B, which share one edge and pool the same way.

struct P {
  res: vec2f,
  mouse: vec2f,
  box: vec4f,
  tip: vec2f,
  time: f32,
  latinF: f32,
  bodyF: f32,
  headF: f32,
  tipOn: f32,
  tipRed: f32,
  motion: f32,
}
@group(0) @binding(0) var<uniform> p: P;
@group(0) @binding(1) var inkTex: texture_2d<f32>;
@group(0) @binding(2) var drawTex: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;
@group(0) @binding(4) var washTex: texture_2d<f32>;

fn hash(q: vec2f) -> f32 {
  var p3 = fract(vec3f(q.x, q.y, q.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
fn noise(q: vec2f) -> f32 {
  let i = floor(q);
  var f = fract(q);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2f(1.0, 0.0)), f.x),
             mix(hash(i + vec2f(0.0, 1.0)), hash(i + vec2f(1.0, 1.0)), f.x), f.y);
}
fn fbm(q0: vec2f) -> f32 {
  var q = q0; var v = 0.0; var a = 0.5;
  for (var i = 0; i < 4; i++) { v += a * noise(q); q = q * 2.03 + 1.7; a *= 0.5; }
  return v;
}

fn paper(uv: vec2f, asp: f32) -> vec3f {
  let q = uv * vec2f(asp, 1.0);
  let blotch = fbm(q * 5.0);
  let fibreH = noise(q * vec2f(900.0, 110.0));
  let fibreV = noise(q * vec2f(130.0, 900.0));
  let grain = hash(uv * p.res);
  var c = vec3f(0.945, 0.915, 0.855);
  c -= vec3f(0.06, 0.07, 0.09) * (blotch - 0.5);
  c -= vec3f(0.04) * (fibreH - 0.5) + vec3f(0.03) * (fibreV - 0.5);
  c -= vec3f(0.035) * (grain - 0.5);
  let vig = smoothstep(1.6, 0.5, length((uv - 0.5) * vec2f(1.2, 1.0)));
  return c * (0.9 + 0.1 * vig);
}

fn blur5(t: texture_2d<f32>, uv: vec2f) -> vec4f {
  let texel = 1.0 / vec2f(textureDimensions(t));
  var s = textureSample(t, samp, uv);
  s += textureSample(t, samp, uv + vec2f(texel.x * 1.6, 0.0));
  s += textureSample(t, samp, uv - vec2f(texel.x * 1.6, 0.0));
  s += textureSample(t, samp, uv + vec2f(0.0, texel.y * 1.6));
  s += textureSample(t, samp, uv - vec2f(0.0, texel.y * 1.6));
  return s / 5.0;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let asp = p.res.x / p.res.y;

  // the name
  let bs = p.box.zw - p.box.xy;
  let m = (uv - p.box.xy) / bs;
  let inside = step(0.0, m.x) * step(m.x, 1.0) * step(0.0, m.y) * step(m.y, 1.0);
  let mc = clamp(m, vec2f(0.0), vec2f(1.0));
  let s0 = textureSample(inkTex, samp, mc);
  let sb = blur5(inkTex, mc);
  let order = s0.a;
  let rLat = smoothstep(p.latinF, p.latinF - 0.012, order);
  let rBody = smoothstep(p.bodyF, p.bodyF - 0.012, order);
  let rHead = smoothstep(p.headF, p.headF - 0.012, order);
  let aName = (s0.r * rLat + s0.g * rBody + s0.b * rHead) * inside;
  let abName = (sb.r * rLat + sb.g * rBody + sb.b * rHead) * inside;
  let isBody = step(s0.r, s0.g);
  let isHead = step(max(s0.r, s0.g), s0.b);
  let front = mix(p.latinF, mix(p.bodyF, p.headF, isHead), isBody);
  let wetName = exp(-max(front - order, 0.0) * 7.0) * step(0.02, aName);

  // the drawings
  let d0 = textureSample(drawTex, samp, uv);
  let db = blur5(drawTex, uv);

  let a = max(aName, max(d0.r, d0.b));
  let ab = max(abName, max(db.r, db.b));
  let wet = max(wetName, d0.g);
  let red = db.b / max(db.r + db.b, 0.001);

  // ink physics: fibrous edge, pooling at the rim, granulation, wet sheen
  let fibre = fbm(uv * vec2f(asp, 1.0) * 240.0);
  let cov = ab * 0.65 + a * 0.35;
  let ink = smoothstep(0.40 - 0.22 * fibre, 0.56, cov);
  let pool = smoothstep(0.08, 0.5, cov) * (1.0 - smoothstep(0.55, 1.0, cov));
  let gran = noise(uv * p.res * 0.45);
  var inkCol = vec3f(0.075, 0.075, 0.105) + vec3f(0.11) * gran;
  inkCol = mix(inkCol, vec3f(0.03, 0.03, 0.05), pool * 0.85);
  var redCol = vec3f(0.60, 0.15, 0.11) + vec3f(0.12, 0.04, 0.03) * gran;
  redCol = mix(redCol, vec3f(0.40, 0.07, 0.05), pool * 0.85);
  inkCol = mix(inkCol, redCol, red);
  inkCol += mix(vec3f(0.22, 0.28, 0.42), vec3f(0.38, 0.16, 0.12), red) * wet * pool;

  // watercolour: pigment settles into the grain and collects at the edge of each wash
  let w0 = textureSample(washTex, samp, uv);
  let wb = blur5(washTex, uv);
  let wcov = wb.a * 0.7 + w0.a * 0.3;
  let wedge = smoothstep(0.02, 0.35, wcov) * (1.0 - smoothstep(0.35, 0.9, wcov));
  let settle = 0.8 + 0.4 * fbm(uv * vec2f(asp, 1.0) * 70.0);
  let wstr = clamp(smoothstep(0.03, 0.45, wcov) * settle * 0.9 + wedge * 0.35, 0.0, 1.0);
  let tint = mix(vec3f(1.0), w0.rgb * 1.12, clamp(wstr, 0.0, 1.0));
  var col = mix(paper(uv, asp) * tint, inkCol, ink * 0.97);

  let td = length((uv - p.tip) * p.res);
  let tipCol = mix(vec3f(0.05, 0.05, 0.08), vec3f(0.45, 0.08, 0.06), p.tipRed);
  col = mix(col, tipCol, smoothstep(5.0, 2.0, td) * p.tipOn);

  col += (hash(uv * p.res + fract(p.time) * vec2f(13.0, 7.0)) - 0.5) * 0.03;
  return vec4f(col, 1.0);
}
