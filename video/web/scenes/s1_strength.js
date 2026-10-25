// Strength montage (0:15–1:01): growth, 80x, OpenAI, enterprise share, Amazon, valuation.
import { statement, heroNumber, drift } from "./kit.js";

export default function strength(X) {
  const { S, E, at, atEnd, put, cput, inA, outA, to, set, setHTML, scene, hit, punch, cueSfx, counter, during, sv, svgLayer, source, chapterLabel } = X;
  const t0 = X.sec("strength");
  chapterLabel("01 · How strong is it?", t0, X.sec("leak") - 0.4);
  to("#hud", t0 - 0.2, { opacity: 1, duration: 0.4 });

  /* ---- s1: the question ---- */
  const Q = scene("str-q", t0 - 0.05, S("s2") - 0.05, { fin: 0.1, fout: 0.15 });
  statement(X, Q.cam, [
    { html: `<span class="kicker" style="font-size:34px;letter-spacing:.3em">FIRST</span>`, t: at("s1", "first") },
  ], { y: 330 });
  statement(X, Q.cam, [
    { html: "HOW", t: at("s1", "how") }, { html: `<span class="glow-hot">STRONG</span>`, t: at("s1", "strong") },
    { html: "IS IT,", t: at("s1", "is") }, { html: `<span class="serif ital" style="font-weight:400">really?</span>`, t: at("s1", "really") },
  ], { y: 560, size: 170 });
  drift(X, Q, 0.06);

  /* ---- s2: run-rate staircase, $1B -> $65B ---- */
  const R = scene("str-runrate", S("s2") - 0.05, S("s3") - 0.05, { fin: 0.15, fout: 0.15 });
  drift(X, R, 0.04);
  const head = put(R.cam, `<div style="position:absolute;left:130px;top:150px">
      <div class="label">REVENUE RUN-RATE · PER YEAR</div>
      <div class="hero num v glow-hot" style="font-size:200px;margin-top:6px">$1B</div></div>`);
  inA(head, R.t0 + 0.05, "up", { dur: 0.5 });
  const big = head.querySelector(".v");
  const svg = svgLayer(R.cam);
  const pts = [
    { m: 0, v: 1, lab: "JAN ’25" }, { m: 11, v: 9, lab: "DEC ’25" }, { m: 13, v: 14, lab: "FEB ’26" },
    { m: 15, v: 30, lab: "APR ’26" }, { m: 16, v: 47, lab: "MAY ’26" }, { m: 18, v: 65, lab: "JUL ’26" },
  ];
  const tFirst = at("s2", "start"), tLast = at("s2", "sixty-five");
  const times = pts.map((p, i) => (i === 0 ? tFirst : i === 5 ? tLast : tFirst + 1.2 + (i - 1) * ((tLast - tFirst - 1.6) / 4)));
  const X0 = 560, X1 = 1700, BASE = 930, CH = 600;
  const xm = (m) => X0 + (m / 18) * (X1 - X0);
  sv("line", { x1: X0 - 60, x2: X1 + 60, y1: BASE, y2: BASE, stroke: "rgba(243,239,230,.4)", "stroke-width": 3 }, svg);
  const defs = sv("defs", {}, svg);
  const lg = sv("linearGradient", { id: "gHot", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  sv("stop", { offset: "0%", "stop-color": "#ffb36b" }, lg);
  sv("stop", { offset: "100%", "stop-color": "#ff5a36" }, lg);
  const st = { k: CH / 1.4, p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
  const bars = pts.map((p) => {
    const g = sv("g", { opacity: 0 }, svg);
    const r = sv("rect", { x: xm(p.m) - 40, width: 80, fill: "url(#gHot)", rx: 4 }, g);
    const tv = sv("text", { x: xm(p.m), "text-anchor": "middle", fill: "#f3efe6", "font-size": 40, "font-weight": 700 }, g);
    tv.textContent = `$${p.v}B`;
    const tm = sv("text", { x: xm(p.m), y: BASE + 46, "text-anchor": "middle", fill: "rgba(243,239,230,.7)", "font-size": 26 }, g);
    tm.textContent = p.lab;
    return { r, tv, g };
  });
  pts.forEach((p, i) => {
    const t = times[i];
    if (i > 0) to(st, t - 0.45, { k: Math.min(CH / 1.4, (CH * 0.9) / p.v), duration: 0.4, ease: "power3.inOut" });
    to(st, t - 0.05, { [`p${i}`]: 1, duration: 0.55, ease: "expo.out" });
    counter(big, t - 0.05, 0.5, i === 0 ? 1 : pts[i - 1].v, p.v, (v) => `$${Math.round(v)}B`, "power2.out");
  });
  during(R.t0, R.t1, () => {
    bars.forEach((b, i) => {
      const hgt = Math.max(0, pts[i].v * st.k * st[`p${i}`]);
      b.r.setAttribute("y", BASE - hgt);
      b.r.setAttribute("height", hgt);
      b.tv.setAttribute("y", BASE - hgt - 18);
      b.g.setAttribute("opacity", st[`p${i}`] > 0.001 ? 1 : 0);
    });
  });
  const x65 = cput(R.cam, `<div class="stamp" style="font-size:54px;color:#ffc857;transform:rotate(-6deg)">65× IN 18 MONTHS</div>`, 760, 540);
  inA(x65, tLast + 0.55, "slam", { dur: 0.35 });
  punch(tLast + 0.05, 0.05);
  cueSfx(tLast - 0.1, "riser", 0.6, 1);
  source("Run-rates as reported: Anthropic via VentureBeat, SaaStr; CNBC/Bloomberg (Aug 2026)", R.t0 + 0.4, R.t1);

  /* ---- s3: planned 10x, got 80x ---- */
  const G = scene("str-80x", S("s3") - 0.05, S("s4") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, G, 0.06);
  const ceo = cput(G.cam, `<div class="label">ANTHROPIC CEO DARIO AMODEI · MAY 2026</div>`, 960, 230);
  inA(ceo, G.t0 + 0.05, "fade", { dur: 0.4 });
  const plan = cput(G.cam, `<div style="text-align:center"><div class="label">PLANNED FOR</div><div class="hero" style="font-size:200px;color:var(--ink3)">10×</div></div>`, 560, 560);
  inA(plan, at("s3", "planned") - 0.05, "up", { dur: 0.45 });
  const got = cput(G.cam, `<div style="text-align:center"><div class="label" style="color:var(--hot)">AND GOT</div><div class="hero glow-hot" style="font-size:340px">80×</div></div>`, 1300, 560);
  inA(got, at("s3", "eighty-x") - 0.08, "slam", { dur: 0.45 });
  to(plan, at("s3", "eighty-x"), { scale: 0.8, opacity: 0.5, duration: 0.4 });
  punch(at("s3", "eighty-x"), 0.07);
  hit(at("s3", "eighty-x"), { amp: 12, peak: 0.18, color: "#ff5a36" });
  cueSfx(at("s3", "eighty-x") - 0.06, "impact", 0.8, 2);
  source("Amodei at Code with Claude, May 6 2026 (VentureBeat)", G.t0 + 0.3, G.t1);

  /* ---- s4: ahead of OpenAI ---- */
  const O = scene("str-openai", S("s4") - 0.05, S("s5") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, O, 0.04);
  const PX = 1180 / 70;
  const lanes = [
    { n: "ANTHROPIC", c: "#ff5a36", v: 65, y: 430, w: "ahead" },
    { n: "OPENAI", c: "#9aa8bb", v: 40, y: 680, w: "openai" },
  ].map((l) => {
    const lab = put(O.cam, `<div class="label" style="position:absolute;left:200px;top:${l.y - 80}px;color:${l.c};font-size:34px">${l.n}</div>`);
    const bar = put(O.cam, `<div style="position:absolute;left:200px;top:${l.y - 30}px;height:120px;width:0;background:${l.c};border-radius:0 10px 10px 0"></div>`);
    const val = put(O.cam, `<div class="hero num" style="position:absolute;left:230px;top:${l.y - 12}px;font-size:90px;color:#07070a;opacity:0">$0B</div>`);
    inA(lab, O.t0 + 0.05, "right", { dur: 0.4 });
    const t = l.n === "OPENAI" ? at("s4", "forty") - 0.3 : at("s4", "ahead") - 0.1;
    to(bar, t, { width: l.v * PX, duration: 0.9, ease: "expo.out" });
    set(val, t + 0.1, { opacity: 1 });
    counter(val, t + 0.1, 0.8, 0, l.v, (v) => (l.n === "OPENAI" ? `~$${Math.round(v)}B` : `$${Math.round(v)}B`));
    return { bar, val };
  });
  const crown = put(O.cam, `<svg width="120" height="94" viewBox="0 0 90 70" style="position:absolute;left:0;top:0"><path d="M5 60 L12 18 L32 38 L45 8 L58 38 L78 18 L85 60 Z" fill="#ffc857"/><rect x="5" y="60" width="80" height="8" fill="#ffc857"/></svg>`);
  gsap.set(crown, { x: 200 + 65 * PX + 30, y: 360, opacity: 0, scale: 0.3, transformOrigin: "50% 100%" });
  to(crown, at("s4", "ahead") + 0.6, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.4)" });
  const fine = put(O.cam, `<div class="label" style="position:absolute;left:200px;top:860px;font-size:22px">ANNUALIZED, AS REPORTED AUG 2026 · METHODS MAY DIFFER</div>`);
  inA(fine, O.t0 + 0.8, "fade");
  source("CNBC / Bloomberg, Aug 2026", O.t0 + 0.3, O.t1);

  /* ---- s5: enterprise share donut -> coding ---- */
  const D = scene("str-share", S("s5") - 0.05, S("s6") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, D, 0.04);
  const dsv = svgLayer(D.cam);
  const CX = 640, CY = 560, RR = 280;
  sv("circle", { cx: CX, cy: CY, r: RR, fill: "none", stroke: "rgba(243,239,230,.08)", "stroke-width": 110 }, dsv);
  const segs = ["#ff5a36", "#9aa8bb", "#5f6b7d", "rgba(243,239,230,.22)"].map((c) =>
    sv("circle", { cx: CX, cy: CY, r: RR, fill: "none", stroke: c, "stroke-width": 110, pathLength: 100, "stroke-dasharray": "0 100", transform: `rotate(-90 ${CX} ${CY})` }, dsv));
  const ds = { a: 0, b: 0, c: 0, d: 0 };
  during(D.t0, D.t1, () => {
    let acc = 0;
    [ds.a, ds.b, ds.c, ds.d].forEach((v, i) => {
      const len = Math.max(0, v - 0.6);
      segs[i].setAttribute("stroke-dasharray", `${len} ${100 - len}`);
      segs[i].setAttribute("stroke-dashoffset", String(-acc));
      acc += v;
    });
  });
  const dh = put(D.cam, `<div style="position:absolute;left:1080px;top:150px"><div class="hero" style="font-size:72px">Who businesses pay</div><div class="label" style="margin-top:8px">ENTERPRISE SPENDING ON AI MODELS</div></div>`);
  inA(dh, D.t0 + 0.05, "up", { dur: 0.45 });
  const ctr = cput(D.cam, `<div style="text-align:center"><div class="label lbl" style="font-size:24px">ENTERPRISE<br>AI-MODEL SPEND</div><div class="hero num big glow-hot" style="font-size:150px">0%</div></div>`, CX, CY);
  const bigPct = ctr.querySelector(".big"), lbl = ctr.querySelector(".lbl");
  const t40 = at("s5", "forty");
  inA(ctr, D.t0 + 0.2, "pop", { dur: 0.45 });
  to(ds, D.t0 + 0.3, { d: 100, duration: 0.01 });
  to(ds, t40 - 0.4, { d: 0, duration: 0.25 });
  counter(bigPct, t40 - 0.15, 0.7, 0, 40, (v) => `${Math.round(v)}%`, "expo.out");
  to(ds, t40 - 0.15, { a: 40, duration: 0.7, ease: "expo.out" });
  to(ds, t40 + 0.6, { b: 27, c: 21, d: 12, duration: 0.8, ease: "expo.out" });
  const legend = put(D.cam, `<div style="position:absolute;left:1080px;top:300px;width:720px"></div>`);
  const rows = [["ANTHROPIC", "#ff5a36", "40%"], ["OPENAI", "#9aa8bb", "27%"], ["GOOGLE", "#5f6b7d", "21%"]].map(([n, c, v]) =>
    put(legend, `<div style="display:flex;align-items:center;gap:24px;height:110px;border-bottom:2px solid var(--line)">
      <div style="width:28px;height:28px;background:${c}"></div><div class="label" style="flex-grow:1;color:var(--ink);font-size:32px">${n}</div>
      <div class="hero num v" style="font-size:80px">${v}</div></div>`));
  inA(rows, t40 + 0.3, "left", { dur: 0.45, stagger: 0.18 });
  const inv = put(D.cam, `<div class="pill" style="position:absolute;left:1080px;top:800px;font-size:24px;background:rgba(255,200,87,.15);color:#ffc857;border:2px solid #ffc857">⚠ MENLO VENTURES IS AN ANTHROPIC INVESTOR</div>`);
  inA(inv, at("s5", "an anthropic") - 0.1, "wipe", { dur: 0.5 });
  const tc = at("s5", "fifty-four") - 0.25;
  to(ds, tc, { a: 54, b: 21, c: 0, d: 25, duration: 0.9, ease: "expo.inOut" });
  counter(bigPct, tc, 0.9, 40, 54, (v) => `${Math.round(v)}%`, "expo.inOut");
  setHTML(lbl, tc + 0.1, "SHARE OF<br>CODING");
  rows.forEach((r, i) => setHTML(r.querySelector(".v"), tc + 0.15, ["54%", "21%", "—"][i]));
  punch(tc + 0.4, 0.05);
  source("Menlo Ventures enterprise survey, late 2025", D.t0 + 0.3, D.t1);

  /* ---- s6: Amazon's stake ---- */
  const M = scene("str-amazon", S("s6") - 0.05, S("s7") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, M, 0.05);
  const amzT = cput(M.cam, `<div class="label" style="font-size:32px;color:var(--ink)">AMAZON’S ANTHROPIC STAKE</div>`, 960, 200);
  inA(amzT, M.t0 + 0.05, "fade");
  const coinA = cput(M.cam, `<div style="width:120px;height:120px;border-radius:60px;background:radial-gradient(circle at 35% 30%,#9aa8bb,#4b5566)"></div>`, 480, 560);
  const labA = cput(M.cam, `<div style="text-align:center"><div class="label">PUT IN</div><div class="hero" style="font-size:110px">~$13B</div></div>`, 480, 790);
  inA([coinA, labA], at("s6", "thirteen") - 0.15, "pop", { dur: 0.45 });
  const coinB = cput(M.cam, `<div style="width:460px;height:460px;border-radius:230px;background:radial-gradient(circle at 35% 30%,#7af0cd,#159a74 70%);box-shadow:0 0 120px rgba(61,224,176,.45)"></div>`, 1280, 520);
  const labB = cput(M.cam, `<div style="text-align:center"><div class="label" style="color:var(--mint)">NOW MARKED AT</div><div class="hero num glow-mint v" style="font-size:150px">$13B</div></div>`, 1280, 850);
  const tNow = at("s6", "marked") - 0.1;
  gsap.set(coinB, { scale: 0.26, opacity: 0 });
  to(coinB, tNow, { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out" });
  inA(labB, tNow, "up", { dur: 0.4 });
  counter(labB.querySelector(".v"), tNow + 0.1, 1.4, 13, 190, (v) => `$${Math.round(v)}B`, "expo.out");
  punch(at("s6", "one hundred and ninety"), 0.05);
  cueSfx(tNow, "counter", 0.7, 1);
  const fine2 = cput(M.cam, `<div class="label nowrap" style="font-size:22px">AMAZON’S OWN ESTIMATE · JUN 30 2026 · NOTES + PREFERRED STOCK</div>`, 960, 960);
  inA(fine2, tNow + 0.6, "fade");
  source("Amazon 10-Q (Q2 2026), as reported", M.t0 + 0.3, M.t1);

  /* ---- s7–s8: valuation elevator ---- */
  const L = scene("str-elevator", S("s7") - 0.05, X.sec("leak") - 0.1, { fin: 0.1, fout: 0.3 });
  const stops = [
    { v: 61.5, d: "MAR 2025", t: at("s7", "sixty-one") },
    { v: 183, d: "SEP 2025", t: atEnd("s7", "twenty-five") + 0.25 },
    { v: 380, d: "FEB 2026", t: S("s8") - 0.2 },
    { v: 965, d: "MAY 2026", t: at("s8", "nine hundred") },
    { v: 2000, d: "IPO TALK", t: at("s8", "two trillion") },
  ];
  const SPAN = 2600, CARY = 820, AX = 620;
  const ly = (v) => -(Math.log10(v / 30) / Math.log10(3000 / 30)) * SPAN;
  const world = put(L.cam, `<div style="position:absolute;left:0;top:0;width:1920px;height:1080px"></div>`);
  const wsv = svgLayer(world);
  const wy = (v) => CARY + ly(v);
  for (const v of [30, 50, 100, 200, 300, 500, 1000, 2000, 3000]) {
    sv("line", { x1: 120, x2: 1800, y1: wy(v), y2: wy(v), stroke: "rgba(243,239,230,.10)", "stroke-width": 2 }, wsv);
    const tx = sv("text", { x: 130, y: wy(v) - 16, fill: "rgba(243,239,230,.3)", "font-size": 46, "font-weight": 700 }, wsv);
    tx.textContent = v >= 1000 ? `$${v / 1000}T` : `$${v}B`;
  }
  const trail = sv("line", { x1: AX, x2: AX, y1: wy(30) + 500, y2: wy(30), stroke: "#ff5a36", "stroke-width": 10, "stroke-linecap": "round" }, wsv);
  trail.style.filter = "drop-shadow(0 0 16px rgba(255,90,54,.9))";
  stops.forEach((s2, i) => {
    const g = sv("g", { opacity: 0 }, wsv);
    const c = i === 4 ? "#ffc857" : "#ff5a36";
    sv("line", { x1: AX, x2: AX + 130, y1: wy(s2.v), y2: wy(s2.v), stroke: c, "stroke-width": 4 }, g);
    const a = sv("text", { x: AX + 150, y: wy(s2.v) + 16, fill: i === 4 ? "#ffc857" : "#f3efe6", "font-size": 52, "font-weight": 800 }, g);
    a.textContent = i === 4 ? "up to $2T ?" : `$${s2.v}B`;
    const b = sv("text", { x: AX + 150, y: wy(s2.v) + 56, fill: "rgba(243,239,230,.6)", "font-size": 26 }, g);
    b.textContent = s2.d;
    set(g, s2.t - 0.1, { attr: { opacity: 1 } });
  });
  const car = put(L.cam, `<div style="position:absolute;left:${AX - 28}px;top:${CARY - 28}px;width:56px;height:56px;border-radius:28px;background:#ffb36b;box-shadow:0 0 50px 18px rgba(255,90,54,.7)"></div>`);
  const el = { v: 30 };
  stops.forEach((s2, i) => to(el, s2.t - 0.25, { v: s2.v, duration: i === 4 ? 1.2 : 0.7, ease: "expo.inOut" }));
  const panel = put(L.cam, `<div style="position:absolute;left:1120px;top:260px;width:700px;padding:40px 50px;border:2px solid var(--line);background:rgba(7,7,10,.9);border-radius:22px">
      <div class="label">VALUATION</div>
      <div class="hero num v" style="font-size:170px;margin-top:6px">$30B</div>
      <div class="label d" style="color:var(--hot);margin-top:6px">—</div></div>`);
  const pv = panel.querySelector(".v"), pd = panel.querySelector(".d");
  inA(panel, L.t0 + 0.05, "left", { dur: 0.5 });
  stops.forEach((s2, i) => setHTML(pd, s2.t, s2.d));
  during(L.t0, L.t1, () => {
    const v = el.v;
    pv.textContent = v >= 1000 ? `$${(v / 1000).toFixed(2)}T` : `$${v < 100 ? v.toFixed(1) : Math.round(v)}B`;
    world.style.transform = `translateY(${(-ly(v)).toFixed(1)}px)`;
    trail.setAttribute("y2", wy(v));
  });
  const tq = stops[4].t + 0.9;
  to(pv, tq, { color: "#ffc857", duration: 0.3 });
  const qm = cput(L.cam, `<div class="hero glow-sun" style="font-size:260px">?</div>`, 1740, 200);
  inA(qm, tq, "slam", { dur: 0.4 });
  punch(tq, 0.06);
  cueSfx(stops[3].t - 0.3, "riser", 0.8, 1);
  source("Funding rounds 2025–26 (Anthropic, Axios, Orrick); IPO talk per Reuters/Bloomberg", L.t0 + 0.3, L.t1);
}
