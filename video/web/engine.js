/* Deterministic motion-graphics engine.
 *
 * One paused GSAP master timeline holds every animation; canvases are redrawn
 * from pure functions of time. window.__seek(t) renders the exact frame at t,
 * which lets the renderer capture frames in any order across many workers. */
/* global gsap */

export const W = 1920, H = 1080;
export let TL = null;
export const tl = gsap.timeline({ paused: true });
gsap.ticker.lagSmoothing(0);
gsap.config({ force3D: true, nullTargetWarn: false });

const frameFns = [];
export const onFrame = (fn) => frameFns.push(fn);

export const root = () => document.getElementById("root");

/* ------------------------------------------------------------- timing ---- */
export function line(id) {
  const l = TL.lines[id];
  if (!l) throw new Error(`unknown line ${id}`);
  return l;
}
export const S = (id) => line(id).start;
export const E = (id) => line(id).end;
export const sec = (name) => TL.sections[name];
let VOENV = [];
/** Narration loudness (0..~1) at time t, smoothed over a few frames. */
export function voEnv(t) {
  const f = t * TL.fps;
  let acc = 0, wsum = 0;
  for (let k = -2; k <= 2; k++) {
    const i = Math.round(f) + k;
    const w = 3 - Math.abs(k);
    acc += (VOENV[i] || 0) * w;
    wsum += w;
  }
  return acc / wsum;
}

function charWeight(s, i) {
  const c = s[i];
  if (c === "." && s[i + 1] === "." ) return 3;
  if (c === "." || c === "?" || c === "!") return 9;
  if (c === "," || c === ":" || c === ";") return 5;
  return 1;
}
/** Estimated time at which `word` is spoken inside line `id`. */
export function at(id, word, nth = 0) {
  const l = line(id);
  const s = l.say.toLowerCase();
  let i = -1, from = 0;
  for (let k = 0; k <= nth; k++) {
    i = s.indexOf(word.toLowerCase(), from);
    if (i < 0) throw new Error(`"${word}" not in ${id}: ${l.say}`);
    from = i + 1;
  }
  let before = 0, total = 0;
  for (let k = 0; k < s.length; k++) {
    const w = charWeight(s, k);
    total += w;
    if (k < i) before += w;
  }
  return l.start + 0.04 + (l.dur - 0.12) * (before / total);
}

/* ---------------------------------------------------------------- dom ---- */
export function h(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
export function put(parent, html, style) {
  const e = h(html);
  if (style) setStyle(e, style);
  parent.appendChild(e);
  return e;
}
/** Place an element centred on (x, y). */
export function cput(parent, html, x, y, style = {}) {
  const e = put(parent, html, { left: x, top: y, ...style });
  e.style.position = "absolute";
  gsap.set(e, { xPercent: -50, yPercent: -50 });
  return e;
}
/** Typewriter across several inline elements, sharing one time budget. */
export function typeSeq(els, t, dur) {
  const all = els.flatMap((e) => chars(e));
  gsap.set(all, { opacity: 0 });
  tl.to(all, { opacity: 1, duration: 0.01, stagger: dur / Math.max(all.length, 1), ease: "none" }, t);
  return all;
}
/** Call fn(t) every frame while t is inside [t0, t1]. */
export function during(t0, t1, fn) {
  frameFns.push((t) => { if (t >= t0 && t <= t1) fn(t); });
}
function setStyle(e, style) {
  for (const [k, v] of Object.entries(style)) {
    e.style[k] = typeof v === "number" && !["opacity", "zIndex", "fontWeight", "lineHeight", "flexGrow"].includes(k) ? `${v}px` : v;
  }
}
const SVGNS = "http://www.w3.org/2000/svg";
export function sv(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}
export function svgLayer(parent, w = W, h = H, style = {}) {
  const s = sv("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}` });
  s.style.position = "absolute";
  s.style.left = "0px";
  s.style.top = "0px";
  s.style.overflow = "visible";
  setStyle(s, style);
  parent.appendChild(s);
  return s;
}

/* Split plain text into word spans (keeps <span class> markup from `parts`). */
export function words(el) {
  const text = el.textContent;
  el.textContent = "";
  return text.split(/(\s+)/).filter(Boolean).map((w) => {
    if (/^\s+$/.test(w)) { el.appendChild(document.createTextNode(w)); return null; }
    const s = document.createElement("span");
    s.className = "w";
    s.textContent = w;
    el.appendChild(s);
    return s;
  }).filter(Boolean);
}
export function chars(el) {
  const text = el.textContent;
  el.textContent = "";
  const out = [];
  for (const tok of text.split(/(\s+)/).filter(Boolean)) {
    if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(tok)); continue; }
    const w = document.createElement("span");
    w.className = "w";
    for (const c of tok) {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      w.appendChild(s);
      out.push(s);
    }
    el.appendChild(w);
  }
  return out;
}

/* ------------------------------------------------------------ scenes ---- */
export function scene(name, t0, t1, { fin = 0.25, fout = 0.25, z = 1 } = {}) {
  const el = put(root(), `<div class="scene" data-scene="${name}"><div class="cam"></div></div>`);
  el.style.zIndex = z;
  gsap.set(el, { opacity: fin ? 0 : 1 });
  tl.set(el, { display: "block" }, t0);
  if (fin) tl.to(el, { opacity: 1, duration: fin, ease: "none" }, t0);
  if (fout) tl.to(el, { opacity: 0, duration: fout, ease: "none" }, t1 - fout);
  tl.set(el, { display: "none" }, t1);
  return { el, cam: el.firstChild, t0, t1 };
}

/* ------------------------------------------------- animation helpers ---- */
const presets = {
  up: [{ opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: "expo.out" }],
  down: [{ opacity: 0, y: -60 }, { opacity: 1, y: 0, ease: "expo.out" }],
  left: [{ opacity: 0, x: 80 }, { opacity: 1, x: 0, ease: "expo.out" }],
  right: [{ opacity: 0, x: -80 }, { opacity: 1, x: 0, ease: "expo.out" }],
  fade: [{ opacity: 0 }, { opacity: 1, ease: "power1.inOut" }],
  pop: [{ opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, ease: "back.out(2.2)" }],
  slam: [{ opacity: 0, scale: 2.6 }, { opacity: 1, scale: 1, ease: "expo.out" }],
  blur: [{ opacity: 0, filter: "blur(24px)", scale: 1.08 }, { opacity: 1, filter: "blur(0px)", scale: 1, ease: "power3.out" }],
  rise: [{ opacity: 0, y: 140, rotationX: -70, transformOrigin: "50% 100%" }, { opacity: 1, y: 0, rotationX: 0, ease: "expo.out" }],
  wipe: [{ clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "expo.inOut" }],
  wipeUp: [{ clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "expo.inOut" }],
};
/** Animate element(s) in at time t. Initial state is applied immediately. */
export function inA(targets, t, kind = "up", { dur = 0.9, stagger = 0, ...extra } = {}) {
  const [a, b] = presets[kind];
  gsap.set(targets, a);
  tl.to(targets, { ...b, duration: dur, stagger, ...extra }, t);
  return t + dur;
}
export function outA(targets, t, kind = "fade", { dur = 0.5, stagger = 0, ...extra } = {}) {
  const map = {
    fade: { opacity: 0, ease: "power1.in" },
    up: { opacity: 0, y: -60, ease: "power3.in" },
    down: { opacity: 0, y: 60, ease: "power3.in" },
    blur: { opacity: 0, filter: "blur(20px)", ease: "power2.in" },
    shrink: { opacity: 0, scale: 0.7, ease: "power3.in" },
    wipe: { clipPath: "inset(0% 0% 0% 100%)", ease: "expo.inOut" },
  };
  tl.to(targets, { ...map[kind], duration: dur, stagger, ...extra }, t);
}
export function to(targets, t, vars) {
  tl.to(targets, vars, t);
}
const htmlState = new Map();
/** Swap an element's innerHTML at time t (reversible, seek-safe). */
export function setHTML(el, t, html) {
  const prev = htmlState.has(el) ? htmlState.get(el) : el.innerHTML;
  htmlState.set(el, html);
  const o = { v: 0 };
  tl.to(o, { v: 1, duration: 0.001, ease: "none", onUpdate: () => { el.innerHTML = o.v >= 0.5 ? html : prev; } }, t);
}
export function set(targets, t, vars) {
  tl.set(targets, vars, t);
}

const counted = new WeakSet();
export function counter(el, t, dur, from, to_, fmt, ease = "power3.out") {
  const o = { v: from };
  if (!counted.has(el)) { el.textContent = fmt(from); counted.add(el); }
  tl.to(o, { v: to_, duration: dur, ease, onUpdate: () => { el.textContent = fmt(o.v); } }, t);
}
/** Typewriter: reveals characters of el between t and t+dur. */
export function typeOn(el, t, dur, { caret = false } = {}) {
  const cs = chars(el);
  gsap.set(cs, { opacity: 0 });
  tl.to(cs, { opacity: 1, duration: 0.01, stagger: dur / Math.max(cs.length, 1), ease: "none" }, t);
  return cs;
}
/** Draw an SVG stroke (element must have pathLength="1"). */
export function draw(el, t, dur = 1.2, ease = "power2.inOut") {
  gsap.set(el, { attr: { "stroke-dasharray": "1 1", "stroke-dashoffset": 1 } });
  tl.to(el, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease }, t);
}

export const fmt = {
  b: (d = 1) => (v) => `$${v.toFixed(d)}B`,
  int: (v) => Math.round(v).toLocaleString("en-US"),
  pct: (v) => `${Math.round(v)}%`,
};

/* ---------------------------------------------------------- randomness ---- */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
export function vnoise(x) {
  const i = Math.floor(x), f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };

/* ------------------------------------------------------- global effects ---- */
const shakes = [], glitches = [], flashes = [];
export const shake = (t, amp = 16, dur = 0.55) => shakes.push({ t, amp, dur });
export const glitch = (t, dur = 0.35, amp = 1) => { glitches.push({ t, dur, amp }); sfx.push({ t: +t.toFixed(3), type: "glitch_short", gain: amp }); };
export const flash = (t, color = "#ffffff", peak = 0.7, dur = 0.45) => flashes.push({ t, color, peak, dur });
export function hit(t, { color = "#ffffff", amp = 14, peak = 0.35 } = {}) {
  shake(t, amp, 0.5);
  flash(t, color, peak, 0.4);
}
const sfx = [];
/** Record a sound-design cue for the audio pipeline. */
export const cueSfx = (t, type, gain = 1) => sfx.push({ t: +t.toFixed(3), type, gain });

export function letterbox(t0, t1, size = 120) {
  const bars = document.querySelectorAll(".lb");
  tl.to(bars, { height: size, duration: 0.9, ease: "expo.inOut" }, t0);
  tl.to(bars, { height: 0, duration: 0.9, ease: "expo.inOut" }, t1 - 0.9);
}

/* themes per section: [leak color A, leak color B, grid tint] */
const THEMES = {
  open: ["#d97757", "#3a2a22", "#f3efe6"],
  ch1: ["#d97757", "#ebc36b", "#f3efe6"],
  ch2: ["#ff4a3d", "#5a1410", "#ffd9d4"],
  ch3: ["#8fb3ff", "#2b3a66", "#dfe8ff"],
  ch4: ["#ff6a3d", "#661d10", "#ffe2d6"],
  ch5: ["#ebc36b", "#3b3424", "#f6efd9"],
  outro: ["#d97757", "#2f2620", "#f3efe6"],
};
function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function themeAt(t) {
  const names = Object.keys(TL.sections).sort((a, b) => TL.sections[a] - TL.sections[b]);
  let cur = names[0], prev = names[0], k = 1;
  for (const n of names) {
    if (t >= TL.sections[n] - 1.0) { prev = cur; cur = n; k = smooth(TL.sections[n] - 1.0, TL.sections[n] + 1.0, t); }
  }
  const A = THEMES[prev].map(hexRgb), B = THEMES[cur].map(hexRgb);
  return A.map((c, i) => c.map((v, j) => Math.round(lerp(v, B[i][j], k))));
}
export let leakGain = (t) => 1;
export const setLeakGain = (fn) => { leakGain = fn; };

let grainTiles = [];
function makeGrain() {
  const r = rng(7);
  for (let n = 0; n < 6; n++) {
    const c = document.createElement("canvas");
    c.width = 960; c.height = 540;
    const g = c.getContext("2d");
    const img = g.createImageData(960, 540);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (r() + r() + r() - 1.5) * 150;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    grainTiles.push(c);
  }
}

function drawGlobals(t) {
  const fps = TL.fps;
  const frame = Math.round(t * fps);
  const [ca, cb, grid] = themeAt(t);

  // background: deep gradient + drifting dot field
  const bg = document.getElementById("bg").getContext("2d");
  bg.fillStyle = "#0b0a09";
  bg.fillRect(0, 0, W, H);
  const gr = bg.createRadialGradient(W * 0.5, H * 1.1, 50, W * 0.5, H * 0.9, 1100);
  gr.addColorStop(0, `rgba(${cb[0]},${cb[1]},${cb[2]},0.35)`);
  gr.addColorStop(1, "rgba(0,0,0,0)");
  bg.fillStyle = gr;
  bg.fillRect(0, 0, W, H);
  const sp = 64, oy = (t * 7) % sp, ox = (t * 3) % sp;
  for (let y = -sp; y < H + sp; y += sp) {
    for (let x = -sp; x < W + sp; x += sp) {
      const px = x + ox, py = y + oy;
      const a = 0.05 + 0.06 * (0.5 + 0.5 * Math.sin(px * 0.004 + py * 0.003 + t * 0.6));
      bg.fillStyle = `rgba(${grid[0]},${grid[1]},${grid[2]},${a.toFixed(3)})`;
      bg.fillRect(px - 1, py - 1, 2, 2);
    }
  }

  // light leaks
  const lk = document.getElementById("leak").getContext("2d");
  lk.clearRect(0, 0, W, H);
  const lg = leakGain(t);
  if (lg > 0.001) {
    const blobs = [
      [0.15 + 0.1 * Math.sin(t * 0.13), 0.2 + 0.1 * Math.cos(t * 0.11), 900, ca, 0.16],
      [0.85 + 0.08 * Math.cos(t * 0.09), 0.85 + 0.08 * Math.sin(t * 0.12), 1000, cb, 0.16],
      [0.6 + 0.2 * Math.sin(t * 0.05 + 2), 0.1, 700, ca, 0.07],
    ];
    for (const [bx, by, rad, c, a] of blobs) {
      const g = lk.createRadialGradient(bx * W, by * H, 0, bx * W, by * H, rad);
      g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${(a * lg).toFixed(3)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      lk.fillStyle = g;
      lk.fillRect(0, 0, W, H);
    }
  }

  // grain
  const gctx = document.getElementById("grain").getContext("2d");
  const tile = grainTiles[frame % grainTiles.length];
  const gx = (frame * 37) % 200, gy = (frame * 91) % 200;
  gctx.imageSmoothingEnabled = false;
  gctx.drawImage(tile, -gx, -gy, 960 * 2 + 200, 540 * 2 + 200);

  // shake
  let sx = 0, sy = 0, rot = 0;
  for (const s of shakes) {
    const u = t - s.t;
    if (u < 0 || u > s.dur) continue;
    const env = Math.pow(1 - u / s.dur, 2.2);
    sx += (vnoise(u * 38 + s.t) - 0.5) * 2 * s.amp * env;
    sy += (vnoise(u * 41 + s.t + 50) - 0.5) * 2 * s.amp * env;
    rot += (vnoise(u * 20 + s.t + 99) - 0.5) * 0.6 * env * (s.amp / 16);
  }
  document.getElementById("shake").style.transform = `translate(${sx.toFixed(2)}px,${sy.toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`;

  // flash
  let fo = 0, fc = "#ffffff";
  for (const f of flashes) {
    const u = t - f.t;
    if (u < 0 || u > f.dur) continue;
    const v = f.peak * Math.pow(1 - u / f.dur, 2);
    if (v > fo) { fo = v; fc = f.color; }
  }
  const fl = document.getElementById("flash");
  fl.style.opacity = fo.toFixed(3);
  fl.style.background = fc;

  // glitch
  let ga = 0;
  for (const g of glitches) {
    const u = t - g.t;
    if (u < 0 || u > g.dur) continue;
    const v = g.amp * (vnoise(u * 60 + g.t) > 0.35 ? 1 : 0.3) * (1 - u / g.dur * 0.5);
    ga = Math.max(ga, v);
  }
  const stage = document.getElementById("stage");
  if (ga > 0.01) {
    document.getElementById("gturb").setAttribute("seed", String(frame % 97));
    document.getElementById("gdisp").setAttribute("scale", (ga * 90).toFixed(1));
    document.getElementById("goffR").setAttribute("dx", (ga * 14).toFixed(1));
    document.getElementById("goffB").setAttribute("dx", (-ga * 14).toFixed(1));
    stage.style.filter = "url(#glitch)";
  } else {
    stage.style.filter = "none";
  }

  // HUD progress + timecode
  const fill = document.querySelector("#hud .prog .fill");
  fill.style.width = `${(100 * t / TL.duration).toFixed(3)}%`;
  const s = Math.floor(t), ff = frame % fps;
  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("tc").textContent = `TC ${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
}

/* ---------------------------------------------------------------- HUD ---- */
export function chapterLabel(text, t0, t1) {
  const host = document.querySelector("#hud .tl .lbl");
  const e = put(host, `<span class="abs nowrap" style="left:0;top:-11px">${text}</span>`);
  gsap.set(e, { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" });
  tl.to(e, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.out" }, t0);
  tl.to(e, { opacity: 0, duration: 0.3 }, t1 - 0.3);
}
export function source(text, t0, t1) {
  const host = document.querySelector("#hud .bl");
  const e = put(host, `<div class="srcbox mono">SOURCE · ${text}</div>`);
  gsap.set(e, { opacity: 0, y: 10 });
  tl.to(e, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, t0);
  tl.to(e, { opacity: 0, duration: 0.3 }, t1 - 0.3);
}

/* -------------------------------------------------------------- setup ---- */
export async function init() {
  TL = await (await fetch("../build/timeline.json")).json();
  VOENV = await (await fetch("../build/vo_env.json")).json();
  const fams = [
    "300 20px 'Inter Display'", "400 20px 'Inter Display'", "500 20px 'Inter Display'", "600 20px 'Inter Display'",
    "700 20px 'Inter Display'", "800 20px 'Inter Display'", "900 20px 'Inter Display'",
    "400 20px 'JetBrains Mono'", "500 20px 'JetBrains Mono'", "700 20px 'JetBrains Mono'",
    "20px 'Instrument Serif'", "italic 20px 'Instrument Serif'",
  ];
  await Promise.all(fams.map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  makeGrain();
  // chapter ticks on the progress bar
  const prog = document.querySelector("#hud .prog");
  for (const [n, s] of Object.entries(TL.sections)) {
    if (n === "open") continue;
    put(prog, `<div class="tick" style="left:${(100 * s / TL.duration).toFixed(3)}%"></div>`);
  }
  return TL;
}

export function finalize() {
  // pad the master timeline to the full duration
  tl.set({}, {}, TL.duration);
  window.__duration = TL.duration;
  window.__fps = TL.fps;
  window.__sfx = sfx.sort((a, b) => a.t - b.t);
  window.__seek = (t) => {
    tl.seek(t, false);
    for (const fn of frameFns) fn(t);
    drawGlobals(t);
    return true;
  };
  window.__seek(0);
}
