// Chapter 1 — "The Strongest Company in AI": five exhibits + the valuation elevator.
export function exhibitCard(X, n, title, t0, t1) {
  const { put, cput, inA, to, scene, cueSfx, hit } = X;
  const c = scene(`exhibit-${n}`, t0, t1, { fin: 0, fout: 0.2, z: 3 });
  const num = cput(c.cam, `<div class="disp black" style="font-size:560px;line-height:1;color:transparent;-webkit-text-stroke:3px var(--clay);letter-spacing:-.06em">0${n}</div>`, 640, 540);
  const fs = title.length > 22 ? 92 : 118;
  const box = put(c.cam, `<div style="position:absolute;left:1000px;top:540px;width:820px"></div>`);
  gsap.set(box, { yPercent: -50 });
  const lab = put(box, `<div class="mono" style="font-size:26px;letter-spacing:.5em;color:var(--clay)">EXHIBIT 0${n}</div>`);
  const tit = put(box, `<div class="serif ital" style="font-size:${fs}px;line-height:1.02;margin-top:26px">${title}</div>`);
  const rule = put(box, `<div style="width:560px;height:2px;background:var(--ink3);margin-top:34px"></div>`);
  inA(num, t0, "right", { dur: 0.9, x: 0 });
  X.tl.fromTo(num, { filter: "blur(18px)" }, { filter: "blur(0px)", duration: 0.6, immediateRender: false }, t0);
  inA(lab, t0 + 0.1, "wipe", { dur: 0.7 });
  inA(tit, t0 + 0.18, "up", { dur: 0.9 });
  inA(rule, t0 + 0.3, "wipe", { dur: 0.8 });
  hit(t0 + 0.05, { amp: 8, peak: 0.12, color: "#d97757" });
  cueSfx(t0, "exhibit");
  to(c.cam, t0, { scale: 1.04, duration: t1 - t0, ease: "none" });
  to(c.cam, t1 - 0.35, { x: -260, opacity: 0, duration: 0.35, ease: "power3.in" });
  cueSfx(t1 - 0.4, "whoosh");
  return c;
}

export default function ch1(X) {
  const { S, E, at, put, cput, inA, outA, to, set, setHTML, tl, scene, hit, glitch, cueSfx, during, sv, svgLayer, counter, source, chapterLabel, typeOn, onFrame } = X;
  const t0 = X.sec("ch1");
  chapterLabel("01 — The strongest company in AI", t0, S("c2_0") - 3.0);
  to("#hud", t0 - 0.2, { opacity: 1, duration: 0.8 });

  // exhibit tracker
  const trk = scene("tracker", t0 + 1.8, S("c1_20") - 0.2, { fin: 0.4, fout: 0.4, z: 4 });
  const tbox = put(trk.el, `<div class="mono" style="position:absolute;right:72px;top:92px;display:flex;gap:8px;font-size:14px"></div>`);
  const tabs = [1, 2, 3, 4, 5].map((i) => put(tbox, `<div style="width:44px;height:26px;border:1.5px solid var(--ink4);color:var(--ink3);display:flex;align-items:center;justify-content:center">0${i}</div>`));
  ["c1_0", "c1_6", "c1_9", "c1_14", "c1_18"].forEach((id, i) => {
    to(tabs[i], S(id), { backgroundColor: "#d97757", color: "#0b0a09", borderColor: "#d97757", duration: 0.3 });
    if (i > 0) to(tabs[i - 1], S(id), { backgroundColor: "rgba(217,119,87,0.18)", color: "#f2a07b", borderColor: "rgba(217,119,87,0.5)", duration: 0.3 });
  });

  /* ===================================================== EXHIBIT 1: SPEED */
  exhibitCard(X, 1, "Speed.", S("c1_0") - 0.15, E("c1_0") + 0.55);
  const A = scene("ex1-stairs", E("c1_0") + 0.3, S("c1_5") + 0.2, { fin: 0.3, fout: 0.35 });
  const head = put(A.cam, `<div style="position:absolute;left:160px;top:150px">
      <div class="mono dim" style="font-size:20px;letter-spacing:.3em">ANNUALIZED REVENUE RUN-RATE</div>
      <div class="disp black num" style="font-size:150px;line-height:1.05;margin-top:6px"><span class="v">$1B</span></div></div>`);
  inA(head, A.t0 + 0.1, "up", { dur: 0.8 });
  const big = head.querySelector(".v");
  const svg = svgLayer(A.cam);
  const pts = [
    { m: 0, v: 1, lab: "JAN ’25", id: ["c1_1", "one billion"] },
    { m: 11, v: 9, lab: "DEC ’25", id: ["c1_2", "nine"] },
    { m: 13, v: 14, lab: "FEB ’26", id: ["c1_3", "fourteen"] },
    { m: 15, v: 30, lab: "APR ’26", id: ["c1_3", "thirty"] },
    { m: 16, v: 47, lab: "MAY ’26", id: ["c1_3", "forty-seven"] },
    { m: 18, v: 65, lab: "JUL ’26", id: ["c1_4", "sixty-five"] },
  ];
  const X0 = 300, X1 = 1660, BASE = 930, CH = 560;
  const xm = (m) => X0 + (m / 18) * (X1 - X0);
  const axis = sv("line", { x1: X0 - 60, x2: X1 + 60, y1: BASE, y2: BASE, stroke: "rgba(243,239,230,.35)", "stroke-width": 2 }, svg);
  gsap.set(axis, { attr: { x2: X0 - 60 } });
  to(axis, A.t0 + 0.2, { attr: { x2: X1 + 60 }, duration: 1.2, ease: "expo.inOut" });
  const grid = Array.from({ length: 7 }, () => ({
    l: sv("line", { x1: X0 - 60, x2: X1 + 60, stroke: "rgba(243,239,230,.09)", "stroke-width": 1.5, "stroke-dasharray": "4 8" }, svg),
    t: sv("text", { x: X1 + 70, fill: "rgba(243,239,230,.38)", "font-size": 18, "dominant-baseline": "middle" }, svg),
  }));
  const st = { k: CH / 1.6, p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, glow: 0 };
  const bars = pts.map((p, i) => {
    const g = sv("g", {}, svg);
    const r = sv("rect", { x: xm(p.m) - 34, width: 68, fill: i === 5 ? "url(#gradClay)" : "#d97757", rx: 3 }, g);
    const tv = sv("text", { x: xm(p.m), "text-anchor": "middle", fill: "#f3efe6", "font-size": 30, "font-weight": 700 }, g);
    tv.textContent = `$${p.v}B`;
    const tm = sv("text", { x: xm(p.m), y: BASE + 42, "text-anchor": "middle", fill: "rgba(243,239,230,.5)", "font-size": 19 }, g);
    tm.textContent = p.lab;
    return { r, tv, tm, g };
  });
  const defs = sv("defs", {}, svg);
  const lg = sv("linearGradient", { id: "gradClay", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  sv("stop", { offset: "0%", "stop-color": "#f2a07b" }, lg);
  sv("stop", { offset: "100%", "stop-color": "#b8553a" }, lg);
  // trend line through the bar tops
  const trend = sv("polyline", { fill: "none", stroke: "#ebc36b", "stroke-width": 3, "stroke-dasharray": "2 10", "stroke-linecap": "round", opacity: 0.0 }, svg);

  pts.forEach((p, i) => {
    const t = at(p.id[0], p.id[1]);
    const maxV = p.v;
    if (i > 0) to(st, t - 0.6, { k: Math.min(CH / 1.6, (CH * 0.92) / maxV), duration: 0.55, ease: "power3.inOut" });
    to(st, t - 0.05, { [`p${i}`]: 1, duration: 0.8, ease: "expo.out" });
    counter(big, t - 0.05, 0.7, i === 0 ? 1 : pts[i - 1].v, p.v, (v) => `$${Math.round(v)}B`, "power2.out");
    cueSfx(t - 0.05, i === 5 ? "impact" : "stair", i === 5 ? 1 : 0.8);
  });
  to(trend, at("c1_4", "sixty-five") + 0.6, { opacity: 0.9, duration: 0.6 });
  const nice = (v) => { for (const s of [0.25, 0.5, 1, 2, 5, 10, 20, 25, 50]) if (v / s <= 5) return s; return 100; };
  during(A.t0, A.t1, () => {
    const maxVis = CH / st.k;
    const step = nice(maxVis);
    grid.forEach((g, j) => {
      const val = step * (j + 1);
      const y = BASE - val * st.k;
      const vis = y > BASE - CH - 40 ? 1 : 0;
      g.l.setAttribute("y1", y); g.l.setAttribute("y2", y);
      g.t.setAttribute("y", y);
      g.t.textContent = `$${val}B`;
      g.l.setAttribute("opacity", vis); g.t.setAttribute("opacity", vis);
    });
    const tops = [];
    bars.forEach((b, i) => {
      const p = st[`p${i}`];
      const hgt = Math.max(0, pts[i].v * st.k * p);
      b.r.setAttribute("y", BASE - hgt);
      b.r.setAttribute("height", hgt);
      b.tv.setAttribute("y", BASE - hgt - 18);
      b.g.setAttribute("opacity", p > 0.001 ? 1 : 0);
      if (p > 0.001) tops.push(`${xm(pts[i].m)},${BASE - hgt}`);
    });
    trend.setAttribute("points", tops.join(" "));
  });
  const x65 = cput(A.cam, `<div class="stamp gold" style="font-size:44px;transform:rotate(-6deg)">≈65× IN 18 MONTHS</div>`, 1020, 330);
  inA(x65, at("c1_4", "sixty-five") + 0.7, "slam", { dur: 0.45 });
  hit(at("c1_4", "sixty-five") + 0.75, { amp: 10, peak: 0.15, color: "#ebc36b" });
  cueSfx(at("c1_4", "sixty-five") + 0.7, "stamp");
  const foot = put(A.cam, `<div class="mono dim2" style="position:absolute;left:160px;top:362px;font-size:16px;letter-spacing:.12em">RUN-RATE = CURRENT REVENUE PACE × 12 MONTHS</div>`);
  inA(foot, A.t0 + 1.2, "fade");
  source("ANTHROPIC VIA VENTUREBEAT, SAASTR; CNBC/BLOOMBERG (JUL ’26)", A.t0 + 1, A.t1);
  to(A.cam, A.t0, { scale: 1.035, duration: A.t1 - A.t0, ease: "none" });

  // quarterly comparison
  const B = scene("ex1-quarter", S("c1_5") - 0.1, S("c1_6") - 0.1, { fin: 0.35, fout: 0.3 });
  const qL = cput(B.cam, `<div style="text-align:center"><div class="mono dim" style="font-size:22px;letter-spacing:.3em">Q2 2025</div></div>`, 640, 830);
  const qR = cput(B.cam, `<div style="text-align:center"><div class="mono dim" style="font-size:22px;letter-spacing:.3em">Q2 2026</div></div>`, 1280, 830);
  const bL = put(B.cam, `<div style="position:absolute;left:560px;width:160px;top:800px;height:0;background:var(--steel)"></div>`);
  const bR = put(B.cam, `<div style="position:absolute;left:1200px;width:160px;top:800px;height:0;background:linear-gradient(#f2a07b,#b8553a)"></div>`);
  const vL = cput(B.cam, `<div class="disp" style="font-size:64px">$0.79B</div>`, 640, 720);
  const vR = cput(B.cam, `<div class="disp black clay" style="font-size:96px">$11.5B+</div>`, 1280, 250);
  const qt = cput(B.cam, `<div class="mono dim" style="font-size:22px;letter-spacing:.3em">QUARTERLY REVENUE</div>`, 960, 140);
  const hL = 34, hR = 34 * 11.5 / 0.787;
  inA([qL, qR, qt], B.t0 + 0.1, "fade", { dur: 0.6 });
  to(bL, B.t0 + 0.3, { height: hL, top: 800 - hL, duration: 0.8, ease: "expo.out" });
  inA(vL, B.t0 + 0.5, "up", { dur: 0.6 });
  const tq = at("c1_5", "eleven");
  to(bR, tq - 0.1, { height: hR, top: 800 - hR, duration: 1.4, ease: "expo.inOut" });
  cueSfx(tq - 0.1, "riser_short");
  inA(vR, tq + 0.9, "pop", { dur: 0.6 });
  const x15 = cput(B.cam, `<div class="stamp gold" style="font-size:58px;transform:rotate(-5deg)">≈15×</div>`, 940, 520);
  inA(x15, at("c1_5", "fifteen"), "slam", { dur: 0.45 });
  hit(at("c1_5", "fifteen") + 0.05, { amp: 9, peak: 0.12 });
  cueSfx(at("c1_5", "fifteen"), "stamp");
  source("REUTERS / BLOOMBERG, PRELIMINARY Q2 2026 FIGURES", B.t0, B.t1);

  /* ========================================= EXHIBIT 2: OVERTOOK THE LEADER */
  exhibitCard(X, 2, "It overtook the leader.", S("c1_6") - 0.15, E("c1_6") + 0.55);
  const C = scene("ex2-race", E("c1_6") + 0.3, S("c1_8") - 0.05, { fin: 0.3, fout: 0.3 });
  const raceTitle = put(C.cam, `<div class="mono dim" style="position:absolute;left:200px;top:220px;font-size:22px;letter-spacing:.3em">AI REVENUE · ANNUALIZED RUN-RATE</div>`);
  inA(raceTitle, C.t0 + 0.1, "fade");
  const lanes = [
    { name: "OPENAI", color: "#8e9aab", y: 420 },
    { name: "ANTHROPIC", color: "#d97757", y: 640 },
  ].map((l) => {
    const lab = put(C.cam, `<div class="mono" style="position:absolute;left:200px;top:${l.y - 70}px;font-size:26px;letter-spacing:.2em;color:${l.color}">${l.name}</div>`);
    const bar = put(C.cam, `<div style="position:absolute;left:200px;top:${l.y - 30}px;height:96px;width:0;background:${l.color};border-radius:0 6px 6px 0"></div>`);
    const val = put(C.cam, `<div class="disp black" style="position:absolute;left:220px;top:${l.y - 22}px;font-size:76px;line-height:1;opacity:0">—</div>`);
    inA(lab, C.t0 + 0.2, "right", { dur: 0.7 });
    return { lab, bar, val, ...l };
  });
  const PX = 1350 / 70; // px per $B
  // "for years": illustrative lead (no figures shown)
  to(lanes[0].bar, C.t0 + 0.4, { width: 900, duration: 1.4, ease: "expo.out" });
  to(lanes[1].bar, C.t0 + 0.6, { width: 260, duration: 1.4, ease: "expo.out" });
  const crown = put(C.cam, `<svg width="90" height="70" viewBox="0 0 90 70" style="position:absolute;left:0;top:0"><path d="M5 60 L12 18 L32 38 L45 8 L58 38 L78 18 L85 60 Z" fill="#ebc36b"/><rect x="5" y="60" width="80" height="8" fill="#ebc36b"/></svg>`);
  gsap.set(crown, { x: 200 + 900 + 20, y: 420 - 10, opacity: 0, scale: 0.4, transformOrigin: "50% 100%" });
  to(crown, at("c1_7", "undisputed"), { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" });
  cueSfx(at("c1_7", "undisputed"), "pop");
  const kingTag = put(C.cam, `<div class="mono gold" style="position:absolute;left:1220px;top:405px;font-size:20px;letter-spacing:.2em">THE KING · 2023–25</div>`);
  inA(kingTag, at("c1_7", "king"), "fade");
  const tAug = at("c1_7", "by august");
  outA(kingTag, tAug - 0.2, "fade", { dur: 0.3 });
  to(lanes[0].bar, tAug + 0.1, { width: 40 * PX, duration: 1.6, ease: "power3.inOut" });
  to(lanes[1].bar, tAug + 0.1, { width: 65 * PX, duration: 2.2, ease: "power3.inOut" });
  cueSfx(tAug + 0.1, "riser_short");
  const crownT = at("c1_7", "sixty-five") + 0.3;
  to(crown, crownT, { keyframes: [
    { x: 200 + 65 * PX - 200, y: 300, duration: 0.45, ease: "power2.out" },
    { x: 200 + 65 * PX + 20, y: 640 - 10, duration: 0.45, ease: "bounce.out" },
  ] });
  cueSfx(crownT + 0.8, "impact");
  hit(crownT + 0.9, { amp: 10, peak: 0.15, color: "#ebc36b" });
  // values
  set(lanes[1].val, at("c1_7", "sixty-five") - 0.1, { opacity: 1 });
  counter(lanes[1].val, at("c1_7", "sixty-five") - 0.1, 1.0, 0, 65, (v) => `$${Math.round(v)}B`);
  set(lanes[0].val, at("c1_7", "forty") - 0.1, { opacity: 1 });
  counter(lanes[0].val, at("c1_7", "forty") - 0.1, 0.8, 0, 40, (v) => `~$${Math.round(v)}B`);
  to(lanes[1].val, tAug, { color: "#0b0a09", duration: 0.1 });
  to(lanes[0].val, tAug, { color: "#0b0a09", duration: 0.1 });
  const fine = put(C.cam, `<div class="mono dim2" style="position:absolute;left:200px;top:800px;font-size:17px;letter-spacing:.12em">AS REPORTED, AUG 2026 · THE TWO COMPANIES MAY CALCULATE RUN-RATE DIFFERENTLY</div>`);
  inA(fine, tAug + 1.5, "fade");
  source("CNBC / BLOOMBERG, AUG 2026", C.t0, C.t1);

  // valuation duel
  const D = scene("ex2-val", S("c1_8") - 0.1, S("c1_9") - 0.1, { fin: 0.3, fout: 0.35 });
  const vt = cput(D.cam, `<div class="mono dim" style="font-size:22px;letter-spacing:.3em">PRIVATE VALUATION (POST-MONEY)</div>`, 960, 200);
  inA(vt, D.t0 + 0.1, "fade");
  const colA = cput(D.cam, `<div style="text-align:center;width:640px"><div class="disp black clay num" style="font-size:190px;line-height:1">$965B</div>
      <div class="mono" style="font-size:24px;letter-spacing:.25em;margin-top:18px">ANTHROPIC · MAY 2026</div></div>`, 560, 560);
  const colB = cput(D.cam, `<div style="text-align:center;width:640px"><div class="disp black steel num" style="font-size:190px;line-height:1">$852B</div>
      <div class="mono dim" style="font-size:24px;letter-spacing:.25em;margin-top:18px">OPENAI · MAR 2026</div></div>`, 1360, 560);
  const gt = cput(D.cam, `<div class="disp" style="font-size:150px;color:var(--ink3)">&gt;</div>`, 960, 520);
  counter(colA.firstElementChild, at("c1_8", "nine hundred") - 0.1, 1.4, 0, 965, (v) => `$${Math.round(v)}B`, "expo.out");
  inA(colA, at("c1_8", "nine hundred") - 0.2, "up", { dur: 0.8 });
  cueSfx(at("c1_8", "nine hundred") - 0.2, "counter", 0.9);
  counter(colB.firstElementChild, at("c1_8", "eight hundred") - 0.1, 1.2, 0, 852, (v) => `$${Math.round(v)}B`, "expo.out");
  inA(colB, at("c1_8", "eight hundred") - 0.2, "up", { dur: 0.8 });
  inA(gt, at("c1_8", "above"), "pop", { dur: 0.5 });
  cueSfx(at("c1_8", "above"), "pop");
  const bw = put(D.cam, `<div style="position:absolute;left:300px;top:760px;width:1320px;height:14px;background:var(--ink4);border-radius:7px;overflow:hidden">
      <div class="a" style="position:absolute;left:0;top:0;bottom:0;width:0;background:var(--clay)"></div></div>`);
  inA(bw, D.t0 + 0.3, "fade");
  to(bw.querySelector(".a"), at("c1_8", "nine hundred"), { width: `${(965 / (965 + 852)) * 100}%`, duration: 1.4, ease: "expo.out" });
  source("REUTERS / ORRICK (SERIES H, MAY 2026); REUTERS (OPENAI, MAR 2026)", D.t0, D.t1);

  /* ========================================= EXHIBIT 3: BUSINESS RUNS ON IT */
  exhibitCard(X, 3, "Business runs on it.", S("c1_9") - 0.15, E("c1_9") + 0.55);
  const F = scene("ex3-share", E("c1_9") + 0.3, S("c1_12") - 0.1, { fin: 0.3, fout: 0.35 });
  const dsv = svgLayer(F.cam);
  const CX = 700, CY = 560, R = 270;
  sv("circle", { cx: CX, cy: CY, r: R, fill: "none", stroke: "rgba(243,239,230,.07)", "stroke-width": 92 }, dsv);
  const segs = [
    { c: "#d97757", name: "ANTHROPIC" },
    { c: "#8e9aab", name: "OPENAI" },
    { c: "#5d6675", name: "GOOGLE" },
    { c: "rgba(243,239,230,.18)", name: "OTHERS" },
  ].map((s) => {
    const e = sv("circle", { cx: CX, cy: CY, r: R, fill: "none", stroke: s.c, "stroke-width": 92, pathLength: 100,
      "stroke-dasharray": "0 100", "stroke-dashoffset": 0, transform: `rotate(-90 ${CX} ${CY})` }, dsv);
    return { e, ...s };
  });
  const dst = { a: 0, b: 0, c: 0, d: 0 };
  const gap = 0.6;
  during(F.t0, F.t1, () => {
    const vals = [dst.a, dst.b, dst.c, dst.d];
    let acc = 0;
    vals.forEach((v, i) => {
      const len = Math.max(0, v - gap);
      segs[i].e.setAttribute("stroke-dasharray", `${len} ${100 - len}`);
      segs[i].e.setAttribute("stroke-dashoffset", String(-acc));
      acc += v;
    });
  });
  const center = cput(F.cam, `<div style="text-align:center"><div class="mono dim lbl" style="font-size:18px;letter-spacing:.25em">ENTERPRISE<br>LLM SPEND</div>
      <div class="disp black clay num big" style="font-size:120px;line-height:1.05">40%</div></div>`, CX, CY);
  const bigPct = center.querySelector(".big"), lbl = center.querySelector(".lbl");
  inA(center, at("c1_10", "forty"), "pop", { dur: 0.6 });
  to(dst, at("c1_10", "forty") - 0.1, { a: 40, duration: 1.0, ease: "expo.out" });
  to(dst, at("c1_10", "twenty-seven") - 0.1, { b: 27, duration: 0.9, ease: "expo.out" });
  to(dst, at("c1_10", "twenty-one") - 0.1, { c: 21, duration: 0.9, ease: "expo.out" });
  to(dst, at("c1_10", "twenty-one") + 0.5, { d: 12, duration: 0.9, ease: "expo.out" });
  ["forty", "twenty-seven", "twenty-one"].forEach((w) => cueSfx(at("c1_10", w) - 0.1, "tick"));
  const legend = put(F.cam, `<div style="position:absolute;left:1120px;top:330px;width:640px"></div>`);
  const rows = [["ANTHROPIC", "#d97757", "40%", "54%"], ["OPENAI", "#8e9aab", "27%", "21%"], ["GOOGLE", "#5d6675", "21%", "—"], ["OTHERS", "rgba(243,239,230,.3)", "12%", "25%"]]
    .map(([n, c, v]) => put(legend, `<div style="display:flex;align-items:center;gap:22px;height:96px;border-bottom:1.5px solid var(--line)">
      <div style="width:22px;height:22px;background:${c}"></div><div class="mono" style="font-size:26px;letter-spacing:.15em;flex-grow:1">${n}</div>
      <div class="disp num v" style="font-size:56px">${v}</div></div>`));
  ["forty", "twenty-seven", "twenty-one"].forEach((w, i) => inA(rows[i], at("c1_10", w) - 0.1, "left", { dur: 0.6 }));
  inA(rows[3], at("c1_10", "twenty-one") + 0.5, "left", { dur: 0.6 });
  const menlo = put(F.cam, `<div class="mono" style="position:absolute;left:1120px;top:760px;font-size:17px;letter-spacing:.12em;color:var(--gold)">⚠ SURVEY BY MENLO VENTURES — AN ANTHROPIC INVESTOR</div>`);
  inA(menlo, at("c1_10", "itself"), "wipe", { dur: 0.8 });
  // morph to coding
  const tc = at("c1_11", "coding") - 0.1;
  to(dst, tc, { a: 54, b: 21, c: 0, d: 25, duration: 1.2, ease: "expo.inOut" });
  cueSfx(tc, "whoosh_soft");
  to(lbl, tc, { opacity: 0, duration: 0.2 });
  setHTML(lbl, tc + 0.2, "CODING<br>WORKLOADS");
  to(lbl, tc + 0.25, { opacity: 1, duration: 0.3 });
  counter(bigPct, tc, 1.2, 40, 54, (v) => `${Math.round(v)}%`, "expo.inOut");
  rows.forEach((r, i) => {
    const v = r.querySelector(".v");
    to(v, tc, { opacity: 0, duration: 0.15 });
    setHTML(v, tc + 0.15, ["54%", "21%", "—", "25%"][i]);
    to(v, tc + 0.2, { opacity: 1, duration: 0.3 });
  });
  to(rows[2], tc, { opacity: 0.3, duration: 0.4 });
  hit(at("c1_11", "fifty-four"), { amp: 8, peak: 0.12, color: "#d97757" });
  cueSfx(at("c1_11", "fifty-four"), "impact", 0.7);
  source("MENLO VENTURES SURVEY OF ENTERPRISE AI BUYERS, LATE 2025", F.t0, F.t1);

  // $1M+ customers: 500 -> 1,000 dot field
  const G = scene("ex3-customers", S("c1_12") - 0.15, S("c1_13") - 0.1, { fin: 0.3, fout: 0.3 });
  const gh = put(G.cam, `<div style="position:absolute;left:160px;top:230px;width:640px">
      <div class="mono dim" style="font-size:22px;letter-spacing:.25em">CUSTOMERS PAYING<br>$1M+ PER YEAR</div>
      <div class="disp black num v" style="font-size:180px;line-height:1.05;margin-top:24px">500</div>
      <div class="mono clay t2" style="font-size:26px;letter-spacing:.2em;margin-top:10px">IN UNDER 2 MONTHS</div></div>`);
  inA(gh, G.t0 + 0.1, "up");
  const gv = gh.querySelector(".v"), gt2 = gh.querySelector(".t2");
  gsap.set(gt2, { opacity: 0 });
  const cv = put(G.cam, `<canvas width="900" height="560" style="position:absolute;left:860px;top:260px"></canvas>`);
  const cx = cv.getContext("2d");
  const gs = { a: 0, b: 0 };
  to(gs, G.t0 + 0.2, { a: 1, duration: 1.2, ease: "power2.out" });
  const tDbl = at("c1_12", "to over") - 0.2;
  to(gs, tDbl, { b: 1, duration: 1.8, ease: "power2.inOut" });
  counter(gv, tDbl, 1.8, 500, 1000, (v) => (v >= 999.5 ? "1,000+" : Math.round(v).toLocaleString("en-US")), "power2.inOut");
  to(gt2, at("c1_12", "less than"), { opacity: 1, duration: 0.5 });
  cueSfx(tDbl, "counter", 1);
  during(G.t0, G.t1, (t) => {
    cx.clearRect(0, 0, 900, 560);
    for (let i = 0; i < 1000; i++) {
      const c = i % 40, r = Math.floor(i / 40);
      const first = i < 500;
      const k = first ? X.clamp(gs.a * 1.4 - (i / 500) * 0.4) : X.clamp(gs.b * 1.5 - ((i - 500) / 500) * 0.5);
      const x = 8 + c * 22, y = 10 + r * 22;
      cx.fillStyle = k > 0.01 ? (first ? `rgba(243,239,230,${0.15 + 0.6 * k})` : `rgba(217,119,87,${0.2 + 0.8 * k})`) : "rgba(243,239,230,0.06)";
      const s = 5 + 6 * k;
      cx.fillRect(x + (11 - s) / 2, y + (11 - s) / 2, s, s);
    }
  });
  const each = put(G.cam, `<div class="mono dim2" style="position:absolute;left:860px;top:840px;font-size:16px;letter-spacing:.12em">EACH SQUARE = ONE CUSTOMER SPENDING OVER $1 MILLION A YEAR</div>`);
  inA(each, G.t0 + 0.6, "fade");
  source("ANTHROPIC STATEMENTS, EARLY 2026", G.t0, G.t1);

  // Claude Code terminal
  const Hh = scene("ex3-code", S("c1_13") - 0.15, S("c1_14") - 0.2, { fin: 0.3, fout: 0.3 });
  const term = put(Hh.cam, `<div class="card" style="left:160px;top:230px;width:980px;height:600px;overflow:hidden;font-family:'JetBrains Mono';font-size:24px">
      <div style="height:52px;border-bottom:1.5px solid var(--line);display:flex;align-items:center;gap:10px;padding:0 20px">
        <div style="width:14px;height:14px;border-radius:7px;background:#ff5f57"></div><div style="width:14px;height:14px;border-radius:7px;background:#febc2e"></div><div style="width:14px;height:14px;border-radius:7px;background:#28c840"></div>
        <div class="dim2" style="margin-left:18px;font-size:18px">~/billing-service</div></div>
      <div class="body" style="padding:28px 34px;line-height:1.75"></div></div>`);
  inA(term, Hh.t0 + 0.05, "up", { dur: 0.8 });
  const body = term.querySelector(".body");
  const tl0 = Hh.t0 + 0.6;
  const lines = [
    ["<span class='clay'>&gt;</span> migrate billing to the new API and add tests", 0.0, true],
    ["<span class='dim'>● Reading 42 files…</span>", 1.4],
    ["<span class='dim'>● Planning 6 changes</span>", 1.8],
    ["<span class='teal'>✎</span> src/billing/invoice.ts <span class='teal'>+128</span> <span class='red'>−41</span>", 2.2],
    ["<span class='teal'>✎</span> src/billing/tax.ts <span class='teal'>+64</span> <span class='red'>−12</span>", 2.6],
    ["<span class='teal'>✎</span> tests/invoice.test.ts <span class='teal'>+210</span>", 3.0],
    ["<span class='teal'>✓ 186 tests passed</span>", 3.7],
  ];
  lines.forEach(([html, dt, typed]) => {
    const ln = put(body, `<div class="nowrap">${html}</div>`);
    if (typed) { typeOn(ln, tl0 + dt, 1.2); cueSfx(tl0 + dt, "typing", 0.6); }
    else { gsap.set(ln, { opacity: 0 }); to(ln, tl0 + dt, { opacity: 1, duration: 0.05 }); cueSfx(tl0 + dt, "tick_soft", 0.5); }
  });
  const cc = put(Hh.cam, `<div style="position:absolute;left:1210px;top:300px;width:600px">
      <div class="mono dim" style="font-size:22px;letter-spacing:.25em">CLAUDE CODE</div>
      <div class="disp black clay" style="font-size:132px;line-height:1.05;margin-top:16px">&gt;$2.5B</div>
      <div class="mono" style="font-size:24px;letter-spacing:.18em;margin-top:8px">RUN-RATE · FEB 2026</div>
      <div class="serif ital dim" style="font-size:52px;margin-top:38px;line-height:1.1">“almost overnight.”</div></div>`);
  inA([...cc.children], at("c1_13", "multi-billion") - 0.2, "up", { dur: 0.8, stagger: 0.15 });
  cueSfx(at("c1_13", "multi-billion") - 0.2, "impact", 0.7);
  source("ANTHROPIC, FEB 2026", Hh.t0, Hh.t1);

  /* ================================ EXHIBIT 4: THE GIANTS PAY TO BE IN THE ROOM */
  exhibitCard(X, 4, "The giants pay to be in the room.", S("c1_14") - 0.15, E("c1_14") + 0.5);
  const I = scene("ex4-orbit", E("c1_14") + 0.25, S("c1_17") - 0.1, { fin: 0.3, fout: 0.35 });
  const osv = svgLayer(I.cam);
  const OC = { x: 760, y: 560 };
  const nodes = [
    { n: "AMAZON", w: "amazon", x: 760, y: 230 },
    { n: "GOOGLE", w: "google", x: 1130, y: 560 },
    { n: "MICROSOFT", w: "microsoft", x: 760, y: 890 },
    { n: "NVIDIA", w: "nvidia", x: 390, y: 560 },
  ];
  const ring = sv("circle", { cx: OC.x, cy: OC.y, r: 330, fill: "none", stroke: "rgba(243,239,230,.12)", "stroke-width": 1.5, "stroke-dasharray": "3 9" }, osv);
  inA(ring, I.t0 + 0.1, "fade", { dur: 1 });
  const core = cput(I.cam, `<div style="width:250px;height:250px;border-radius:125px;background:radial-gradient(circle,#f2a07b 0%,#d97757 45%,rgba(217,119,87,0) 72%);display:flex;align-items:center;justify-content:center">
      <div class="mono" style="font-size:24px;letter-spacing:.2em;color:#0b0a09;font-weight:700">ANTHROPIC</div></div>`, OC.x, OC.y);
  inA(core, I.t0 + 0.15, "pop", { dur: 0.8 });
  const links = nodes.map((nd) => {
    const l = sv("line", { x1: OC.x, y1: OC.y, x2: nd.x, y2: nd.y, stroke: "rgba(217,119,87,.5)", "stroke-width": 2, pathLength: 1 }, osv);
    const el = cput(I.cam, `<div class="mono" style="padding:16px 26px;border:2px solid var(--ink3);background:#0f0e0c;font-size:26px;letter-spacing:.18em">${nd.n}</div>`, nd.x, nd.y);
    const t = at("c1_15", nd.w);
    X.draw(l, t - 0.1, 0.5);
    inA(el, t - 0.1, "pop", { dur: 0.5 });
    cueSfx(t - 0.1, "node");
    return { l, el, nd };
  });
  // particles flowing into the core
  const pc = put(I.cam, `<canvas width="1920" height="1080" style="position:absolute;left:0;top:0"></canvas>`);
  const pctx = pc.getContext("2d");
  const pr = X.rng(11);
  const parts = Array.from({ length: 160 }, () => ({ n: Math.floor(pr() * 4), o: pr(), s: 0.25 + pr() * 0.35, j: (pr() - 0.5) * 18 }));
  during(I.t0, I.t1, (t) => {
    pctx.clearRect(0, 0, 1920, 1080);
    for (const p of parts) {
      const nd = nodes[p.n];
      const tn = at("c1_15", nd.w);
      if (t < tn + 0.3) continue;
      const u = (p.o + (t - tn) * p.s) % 1;
      const x = X.lerp(nd.x, OC.x, u) + p.j * Math.sin(u * 9), y = X.lerp(nd.y, OC.y, u) + p.j * Math.cos(u * 7);
      pctx.fillStyle = `rgba(242,160,123,${(0.9 * Math.sin(Math.PI * u)).toFixed(3)})`;
      pctx.fillRect(x - 2, y - 2, 4, 4);
    }
  });
  const all4 = put(I.cam, `<div style="position:absolute;left:1340px;top:420px;width:500px">
      <div class="disp black" style="font-size:96px;line-height:.95">ALL FOUR</div>
      <div class="serif ital clay" style="font-size:84px;line-height:1">are investors.</div></div>`);
  inA([...all4.children], at("c1_15", "all four") - 0.1, "up", { dur: 0.8, stagger: 0.15 });
  cueSfx(at("c1_15", "all four") - 0.1, "impact", 0.7);
  // Amazon stake panel
  const tAm = S("c1_16") - 0.1;
  outA(all4, tAm - 0.2, "fade", { dur: 0.3 });
  to(links[0].el, tAm, { borderColor: "#d97757", backgroundColor: "#2a1a13", scale: 1.15, duration: 0.5 });
  links.slice(1).forEach((l) => to(l.el, tAm, { opacity: 0.35, duration: 0.5 }));
  const amz = put(I.cam, `<div style="position:absolute;left:1300px;top:300px;width:560px">
      <div class="mono dim" style="font-size:22px;letter-spacing:.22em">AMAZON’S STAKE</div>
      <div style="display:flex;align-items:baseline;gap:22px;margin-top:22px"><div class="mono dim2" style="font-size:22px;width:140px">PUT IN</div><div class="disp num" style="font-size:84px">~$13B</div></div>
      <div style="display:flex;align-items:baseline;gap:22px;margin-top:8px"><div class="mono dim2" style="font-size:22px;width:140px">WORTH</div><div class="disp black num teal v" style="font-size:120px">$13B</div></div>
      <div class="mono dim2" style="font-size:16px;letter-spacing:.1em;margin-top:20px;line-height:1.6">AMAZON’S OWN ESTIMATE, JUN 30 2026 (10-Q):<br>CONVERTIBLE NOTES $97.9B + PREFERRED STOCK $92.5B</div></div>`);
  inA([...amz.children], tAm + 0.1, "up", { dur: 0.7, stagger: 0.12 });
  const amv = amz.querySelector(".v");
  gsap.set(amv, { opacity: 0 });
  to(amv, at("c1_16", "by june") - 0.1, { opacity: 1, duration: 0.2 });
  counter(amv, at("c1_16", "by june"), 2.2, 13, 190.4, (v) => `$${v.toFixed(v > 190 ? 1 : 0)}B`, "expo.inOut");
  cueSfx(at("c1_16", "by june"), "counter", 1);
  hit(at("c1_16", "one hundred and ninety"), { amp: 9, peak: 0.12, color: "#35d6a6" });
  source("AMAZON 10-Q (Q2 2026) AS REPORTED; ANTHROPIC / MICROSOFT / NVIDIA ANNOUNCEMENTS", I.t0, I.t1);

  // compute
  const J = scene("ex4-compute", S("c1_17") - 0.15, S("c1_18") - 0.2, { fin: 0.3, fout: 0.3 });
  const chip = put(J.cam, `<canvas width="1920" height="1080" style="position:absolute;left:0;top:0"></canvas>`);
  const chx = chip.getContext("2d");
  const ch = { p: 0 };
  to(ch, J.t0, { p: 1, duration: J.t1 - J.t0, ease: "power1.in" });
  const cr = X.rng(5);
  const order = Array.from({ length: 64 * 36 }, (_, i) => ({ i, r: cr() }));
  during(J.t0, J.t1, (t) => {
    chx.clearRect(0, 0, 1920, 1080);
    for (const o of order) {
      const c = o.i % 64, r = Math.floor(o.i / 64);
      const lit = o.r < ch.p * 1.05;
      const pulse = 0.5 + 0.5 * Math.sin(t * 6 + o.i * 0.37);
      chx.fillStyle = lit ? `rgba(217,119,87,${(0.10 + 0.22 * pulse).toFixed(3)})` : "rgba(243,239,230,0.035)";
      chx.fillRect(14 + c * 30, 14 + r * 30, 22, 22);
    }
  });
  const ct = cput(J.cam, `<div class="mono" style="font-size:24px;letter-spacing:.3em;color:var(--ink2)">THE COMPUTE BEHIND IT</div>`, 960, 230);
  inA(ct, J.t0 + 0.1, "fade");
  const cards = [
    ["UP TO", "1,000,000", "GOOGLE TPUs", "a million google"],
    ["AWS", "RAINIER", "PROJECT RAINIER · TRAINIUM2", "project rayneer"],
    ["UP TO", "1 GW", "MICROSOFT AZURE · NVIDIA", "a gigawatt"],
  ].map(([k, v, s, w], i) => {
    const e = put(J.cam, `<div class="card" style="left:${210 + i * 520}px;top:360px;width:470px;height:380px;padding:44px 40px;background:rgba(15,13,11,.92)">
        <div class="mono dim" style="font-size:20px;letter-spacing:.25em">${k}</div>
        <div class="disp black" style="font-size:${v.length > 7 ? 92 : 120}px;line-height:1.1;margin-top:30px">${v}</div>
        <div class="mono clay" style="font-size:20px;letter-spacing:.14em;margin-top:40px">${s}</div></div>`);
    inA(e, at("c1_17", w) - 0.15, "up", { dur: 0.7 });
    cueSfx(at("c1_17", w) - 0.15, "node");
    return e;
  });
  to(J.cam, J.t0, { scale: 1.05, duration: J.t1 - J.t0, ease: "none" });
  source("GOOGLE / BROADCOM (OCT 2025), AWS, MICROSOFT / NVIDIA ANNOUNCEMENTS", J.t0, J.t1);

  /* ====================================== EXHIBIT 5: STARTING TO MAKE MONEY */
  exhibitCard(X, 5, "It’s starting to make money.", S("c1_18") - 0.15, E("c1_18") + 0.5);
  const K = scene("ex5-profit", E("c1_18") + 0.25, S("c1_20") - 0.15, { fin: 0.3, fout: 0.3 });
  const ksv = svgLayer(K.cam);
  const ZERO = 600;
  const zl = sv("line", { x1: 220, x2: 1700, y1: ZERO, y2: ZERO, stroke: "rgba(243,239,230,.5)", "stroke-width": 2 }, ksv);
  inA(zl, K.t0 + 0.1, "fade");
  const zt = put(K.cam, `<div class="mono dim" style="position:absolute;left:1720px;top:${ZERO - 14}px;font-size:20px">$0</div>`);
  inA(zt, K.t0 + 0.2, "fade");
  const ktitle = put(K.cam, `<div class="mono dim" style="position:absolute;left:220px;top:190px;font-size:22px;letter-spacing:.25em">ADJUSTED OPERATING INCOME</div>`);
  inA(ktitle, K.t0 + 0.1, "fade");
  const loss25 = put(K.cam, `<div style="position:absolute;left:360px;top:${ZERO}px;width:300px;height:0;background:repeating-linear-gradient(45deg,rgba(255,74,61,.55) 0 10px,rgba(255,74,61,.15) 10px 20px)"></div>`);
  to(loss25, K.t0 + 0.4, { height: 300, duration: 1.0, ease: "expo.out" });
  const l25t = put(K.cam, `<div style="position:absolute;left:300px;top:${ZERO + 320}px;width:420px;text-align:center">
      <div class="mono" style="font-size:22px;letter-spacing:.2em">FULL-YEAR 2025</div><div class="mono red" style="font-size:20px;margin-top:6px">OPERATING LOSS &gt; $8B</div></div>`);
  inA(l25t, K.t0 + 0.6, "fade");
  ["Q1 2026", "Q2 2026"].forEach((q, i) => {
    const x = 1000 + i * 380;
    const tq2 = i === 0 ? at("c1_19", "first two") : at("c1_19", "positive");
    const b = put(K.cam, `<div style="position:absolute;left:${x}px;top:${ZERO}px;width:240px;height:0;background:linear-gradient(#5be3bb,#20a07a)"></div>`);
    to(b, tq2, { height: 120, top: ZERO - 120, duration: 0.8, ease: "back.out(1.6)" });
    const lab = put(K.cam, `<div style="position:absolute;left:${x - 40}px;top:${ZERO + 24}px;width:320px;text-align:center" class="mono"><div style="font-size:24px;letter-spacing:.2em">${q}</div></div>`);
    const plus = put(K.cam, `<div class="disp black teal" style="position:absolute;left:${x}px;top:${ZERO - 230}px;width:240px;text-align:center;font-size:76px">+</div>`);
    inA(lab, tq2, "fade");
    inA(plus, tq2 + 0.3, "pop");
    cueSfx(tq2, "pop");
  });
  const inBlack = cput(K.cam, `<div class="stamp teal" style="font-size:52px;transform:rotate(-4deg)">IN THE BLACK*</div>`, 1310, 290);
  inA(inBlack, at("c1_19", "operating income") - 0.1, "slam", { dur: 0.45 });
  hit(at("c1_19", "operating income"), { amp: 9, peak: 0.12, color: "#35d6a6" });
  cueSfx(at("c1_19", "operating income") - 0.1, "stamp");
  const kfoot = put(K.cam, `<div class="mono dim2" style="position:absolute;left:220px;top:880px;font-size:16px;letter-spacing:.1em">*ADJUSTED, COMPANY-DEFINED MEASURE. QUARTERLY AMOUNTS NOT INDEPENDENTLY VERIFIED · BARS ILLUSTRATIVE, NOT TO SCALE</div>`);
  gsap.set(kfoot, { opacity: 0 });
  to(kfoot, K.t0 + 1, { opacity: 1, duration: 0.5 });
  source("FORTUNE / REUTERS, FROM THE DRAFT S-1 (SEP–OCT 2026)", K.t0, K.t1);

  /* ======================================== THE VALUATION ELEVATOR */
  const L = scene("elevator", S("c1_20") - 0.15, E("c1_25") + 1.9, { fin: 0.3, fout: 0 });
  const stops = [
    { v: 61.5, d: "MAR 2025", id: ["c1_21", "sixty"] },
    { v: 183, d: "SEP 2025", id: ["c1_22", "one eighty"] },
    { v: 380, d: "FEB 2026", id: ["c1_23", "three eighty"] },
    { v: 965, d: "MAY 2026", id: ["c1_24", "nine hundred"] },
    { v: 2000, d: "IPO TALK", id: ["c1_25", "two trillion"] },
  ];
  const SPAN = 2700, CARY = 800, AX = 640;
  const ly = (v) => -(Math.log10(v / 30) / Math.log10(3000 / 30)) * SPAN; // 0 at $30B, negative upward
  const world = put(L.cam, `<div style="position:absolute;left:0;top:0;width:1920px;height:1080px"></div>`);
  const wsv = svgLayer(world, 1920, 1080);
  const wy = (v) => CARY + ly(v);
  for (const v of [30, 50, 100, 200, 300, 500, 1000, 2000, 3000]) {
    sv("line", { x1: 160, x2: 1800, y1: wy(v), y2: wy(v), stroke: "rgba(243,239,230,.08)", "stroke-width": 1.5 }, wsv);
    const tx = sv("text", { x: 170, y: wy(v) - 14, fill: "rgba(243,239,230,.22)", "font-size": 40, "font-weight": 700 }, wsv);
    tx.textContent = v >= 1000 ? `$${v / 1000}T` : `$${v}B`;
  }
  sv("line", { x1: AX, x2: AX, y1: wy(3000) - 400, y2: wy(30) + 400, stroke: "rgba(243,239,230,.16)", "stroke-width": 2 }, wsv);
  const trail = sv("line", { x1: AX, x2: AX, y1: wy(30) + 400, y2: wy(30), stroke: "#d97757", "stroke-width": 8, "stroke-linecap": "round" }, wsv);
  trail.style.filter = "drop-shadow(0 0 14px rgba(217,119,87,.9))";
  stops.forEach((s2, i) => {
    const g = sv("g", { opacity: 0 }, wsv);
    const c = i === 4 ? "#ebc36b" : "#d97757";
    sv("line", { x1: AX, x2: AX + 120, y1: wy(s2.v), y2: wy(s2.v), stroke: c, "stroke-width": 3, "stroke-dasharray": i === 4 ? "8 8" : "0" }, g);
    const t1x = sv("text", { x: AX + 140, y: wy(s2.v) + 14, fill: i === 4 ? "#ebc36b" : "#f3efe6", "font-size": 42, "font-weight": 700 }, g);
    t1x.textContent = i === 4 ? "up to $2T ?" : `$${s2.v}B`;
    const t2x = sv("text", { x: AX + 140, y: wy(s2.v) + 50, fill: "rgba(243,239,230,.5)", "font-size": 22 }, g);
    t2x.textContent = s2.d;
    set(g, at(s2.id[0], s2.id[1]) - 0.1, { attr: { opacity: 1 } });
  });
  const car = put(L.cam, `<div style="position:absolute;left:${AX - 26}px;top:${CARY - 26}px;width:52px;height:52px;border-radius:26px;background:#f2a07b;box-shadow:0 0 50px 16px rgba(217,119,87,.7)"></div>`);
  inA(car, L.t0 + 0.3, "pop", { dur: 0.6 });
  // speed streaks while the car is moving
  const streak = put(L.cam, `<canvas width="1920" height="1080" style="position:absolute;left:0;top:0"></canvas>`);
  const sctx = streak.getContext("2d");
  const sr = X.rng(21);
  const streaks = Array.from({ length: 70 }, () => ({ x: 160 + sr() * 1640, o: sr(), l: 80 + sr() * 260, s: 0.6 + sr() }));
  const el = { v: 30 };
  const moves = stops.map((s2, i) => ({ t: at(s2.id[0], s2.id[1]) - 0.25, d: i === 4 ? 1.6 : 0.9 }));
  during(L.t0, L.t1, (t) => {
    let sp = 0;
    for (const m of moves) if (t >= m.t && t <= m.t + m.d) sp = Math.max(sp, Math.sin(Math.PI * (t - m.t) / m.d));
    sctx.clearRect(0, 0, 1920, 1080);
    if (sp > 0.02) {
      for (const k of streaks) {
        const y = ((k.o + t * 2.2 * k.s) % 1) * 1500 - 300;
        sctx.fillStyle = `rgba(243,239,230,${(0.10 * sp).toFixed(3)})`;
        sctx.fillRect(k.x, y, 2, k.l * sp);
      }
    }
  });
  const panel = put(L.cam, `<div style="position:absolute;left:1120px;top:250px;width:700px;padding:40px 48px;border:2px solid var(--line);background:rgba(12,11,10,.92);border-radius:18px">
      <div class="mono dim" style="font-size:22px;letter-spacing:.3em">VALUATION</div>
      <div class="disp black num v" style="font-size:150px;line-height:1.05;margin-top:8px">$61.5B</div>
      <div class="mono clay d" style="font-size:26px;letter-spacing:.25em;margin-top:6px">MAR 2025</div>
      <div style="margin-top:28px;height:10px;background:var(--ink4);border-radius:5px;overflow:hidden"><div class="bar" style="height:100%;width:0;background:linear-gradient(90deg,#d97757,#ebc36b)"></div></div></div>`);
  const pv = panel.querySelector(".v"), pd = panel.querySelector(".d"), pbar = panel.querySelector(".bar");
  inA(panel, moves[0].t - 0.35, "left", { dur: 0.7 });
  const fast = cput(L.cam, `<div style="text-align:center"><div class="mono dim" style="font-size:24px;letter-spacing:.4em">PUT IT ALL TOGETHER</div>
      <div class="serif ital nowrap" style="font-size:96px;margin-top:20px">one of the fastest climbs<br>in corporate history</div></div>`, 1180, 470);
  inA(fast, at("c1_20", "put it") - 0.1, "blur", { dur: 0.9 });
  outA(fast, S("c1_21") - 0.5, "blur", { dur: 0.4 });
  stops.forEach((s2, i) => {
    const m = moves[i];
    to(el, m.t, { v: s2.v, duration: m.d, ease: i === 4 ? "power2.inOut" : "expo.inOut" });
    if (i > 0) setHTML(pd, m.t + 0.2, s2.d);
    if (i === 4) to(pd, m.t + 0.2, { color: "#ebc36b", duration: 0.2 });
    cueSfx(m.t, i === 4 ? "riser_short" : "elevator", 1);
    if (i < 4) cueSfx(m.t + m.d - 0.1, "ding", 0.7);
  });
  during(L.t0, L.t1, () => {
    const v = el.v;
    pv.textContent = v >= 1000 ? `$${(v / 1000).toFixed(2)}T` : `$${v < 100 ? v.toFixed(1) : Math.round(v)}B`;
    pbar.style.width = `${(100 * Math.log10(v / 30) / Math.log10(2000 / 30)).toFixed(2)}%`;
    world.style.transform = `translateY(${(-ly(v)).toFixed(1)}px)`;
    trail.setAttribute("y2", wy(v));
  });
  const q2t = at("c1_25", "two trillion") + 1.0;
  to(pv, q2t, { color: "#ebc36b", duration: 0.4 });
  const qm = cput(L.cam, `<div class="disp black gold" style="font-size:240px;text-shadow:0 0 80px rgba(235,195,107,.5)">?</div>`, 1730, 170);
  inA(qm, q2t, "slam", { dur: 0.5 });
  hit(q2t + 0.05, { amp: 18, peak: 0.3, color: "#ebc36b" });
  cueSfx(q2t, "impact_big");
  source("FUNDING ANNOUNCEMENTS 2025–26; IPO VALUATION TALK AS REPORTED BY REUTERS / BLOOMBERG", L.t0, L.t1);
  // hard cut to black
  const cut = E("c1_25") + 1.9;
  set(L.el, cut, { opacity: 0 });
  set("#hud", cut, { opacity: 0 });
}
