// Chapter 4 — Twist #2, "The Real Bill": compute spend, the $518B tower, the cash, the loop.
import { twistCard } from "./s3_phantom.js";

export default function ch4(X) {
  const { S, E, at, put, cput, inA, outA, to, set, setHTML, tl, scene, hit, glitch, flash, cueSfx, during, counter, source, chapterLabel, svgLayer, sv } = X;
  const t0 = X.sec("ch4");
  chapterLabel("04 — Twist #2: the real bill", t0, X.sec("ch5") - 0.3);

  /* ---------- NOT SO FAST ---------- */
  const NF = scene("bill-notsofast", t0 - 0.1, S("c4_1") - 0.1, { fin: 0, fout: 0.15, z: 3 });
  const nf = cput(NF.cam, `<div class="disp black red nowrap" style="font-size:240px;letter-spacing:-.04em;text-shadow:0 0 70px rgba(255,74,61,.5)">NOT SO FAST.</div>`, 960, 540);
  inA(nf, t0, "slam", { dur: 0.4 });
  hit(t0 + 0.05, { amp: 26, peak: 0.45, color: "#ff4a3d" });
  glitch(t0, 0.35, 1);
  cueSfx(t0, "impact_big", 1.1);
  twistCard(X, 2, "The Real Bill", S("c4_1") - 0.15, S("c4_2") - 0.1, "#ff6a3d");

  /* ---------- compute spend ---------- */
  const CS = scene("bill-compute", S("c4_2") - 0.15, S("c4_3") - 0.1, { fin: 0.25, fout: 0.3 });
  const ch = put(CS.cam, `<div style="position:absolute;left:200px;top:180px">
      <div class="disp black" style="font-size:150px;line-height:1">Compute.</div>
      <div class="mono dim" style="font-size:22px;letter-spacing:.25em;margin-top:16px">COMPUTING & INFRASTRUCTURE SPEND</div></div>`);
  inA([...ch.children], CS.t0 + 0.05, "up", { dur: 0.7, stagger: 0.12 });
  const KS = 52;
  const cbars = [
    { x: 1000, v: 2.3, lab: "H1 2025", val: "$2.3B", col: "#8e9aab", w: ["c4_2", "two point three"] },
    { x: 1360, v: 9, lab: "H1 2026", val: "≈ $9B", col: "#ff6a3d", w: ["c4_2", "nearly nine"] },
  ].map((b) => {
    const bar = put(CS.cam, `<div style="position:absolute;left:${b.x}px;top:900px;width:220px;height:0;background:${b.col}"></div>`);
    const lab = put(CS.cam, `<div class="mono dim" style="position:absolute;left:${b.x - 40}px;top:920px;width:300px;text-align:center;font-size:22px;letter-spacing:.2em">${b.lab}</div>`);
    const val = put(CS.cam, `<div class="disp black" style="position:absolute;left:${b.x - 60}px;top:${900 - b.v * KS - 100}px;width:340px;text-align:center;font-size:76px">${b.val}</div>`);
    const t = at(b.w[0], b.w[1]) - 0.1;
    to(bar, t, { height: b.v * KS, top: 900 - b.v * KS, duration: 0.9, ease: "expo.out" });
    inA([lab, val], t + 0.2, "up", { dur: 0.6 });
    cueSfx(t, "stair");
    return bar;
  });
  const x4 = cput(CS.cam, `<div class="stamp" style="font-size:54px;color:#ff6a3d;transform:rotate(-6deg)">≈4×</div>`, 1250, 330);
  inA(x4, at("c4_2", "nearly nine") + 0.7, "slam", { dur: 0.4 });
  cueSfx(at("c4_2", "nearly nine") + 0.7, "stamp");
  source("REUTERS, FROM THE DRAFT S-1 (OCT 20, 2026)", CS.t0, CS.t1);

  /* ---------- the tower of commitments ---------- */
  const TW = scene("bill-tower", S("c4_3") - 0.15, S("c4_14") - 0.15, { fin: 0.3, fout: 0.4 });
  const tsv = svgLayer(TW.cam);
  const GX = 700, GY = 900, A = 190, D = 95, KH = 640 / 518;
  const iso = (g, z0, z1, cx, gy, cols, a = A, d = D) => {
    const by = gy - z0, ty = gy - z1;
    sv("polygon", { points: `${cx - a},${ty} ${cx},${ty + d} ${cx},${by + d} ${cx - a},${by}`, fill: cols[0] }, g);
    sv("polygon", { points: `${cx},${ty + d} ${cx + a},${ty} ${cx + a},${by} ${cx},${by + d}`, fill: cols[1] }, g);
    sv("polygon", { points: `${cx},${ty - d} ${cx + a},${ty} ${cx},${ty + d} ${cx - a},${ty}`, fill: cols[2] }, g);
  };
  const begin = cput(TW.cam, `<div class="serif ital nowrap" style="font-size:96px">…and that’s just the beginning.</div>`, 1180, 300);
  inA(begin, TW.t0 + 0.2, "blur", { dur: 0.7 });
  outA(begin, at("c4_3", "five hundred") - 0.6, "fade", { dur: 0.4 });
  // ghost outline of the reported total
  const ghost = sv("g", { opacity: 0 }, tsv);
  const gtop = GY - 518 * KH;
  sv("polyline", { points: `${GX - A},${GY} ${GX - A},${gtop} ${GX},${gtop - D} ${GX + A},${gtop} ${GX + A},${GY}`, fill: "none", stroke: "rgba(255,106,61,.6)", "stroke-width": 2.5, "stroke-dasharray": "10 10" }, ghost);
  sv("polyline", { points: `${GX - A},${gtop} ${GX},${gtop + D} ${GX + A},${gtop}`, fill: "none", stroke: "rgba(255,106,61,.6)", "stroke-width": 2.5, "stroke-dasharray": "10 10" }, ghost);
  sv("polygon", { points: `${GX - A},${GY} ${GX},${GY + D} ${GX + A},${GY} ${GX},${GY - D}`, fill: "rgba(243,239,230,.05)", stroke: "rgba(243,239,230,.2)", "stroke-width": 2 }, tsv);
  const hdr = put(TW.cam, `<div style="position:absolute;left:1240px;top:100px">
      <div class="mono dim" style="font-size:22px;letter-spacing:.25em">AI-INFRASTRUCTURE COMMITMENTS</div>
      <div class="disp black num v" style="font-size:130px;line-height:1.05;color:#ff6a3d">≥ $518B</div>
      <div class="mono dim" style="font-size:22px;letter-spacing:.2em">OVER ROUGHLY A DECADE</div></div>`);
  const t518 = at("c4_3", "five hundred") - 0.2;
  inA(hdr, t518, "up", { dur: 0.7 });
  counter(hdr.querySelector(".v"), t518, 1.6, 0, 518, (v) => `≥ $${Math.round(v)}B`, "expo.out");
  set(ghost, t518, { attr: { opacity: 1 } });
  cueSfx(t518, "impact", 1);
  const blocks = [
    { n: "GOOGLE", v: 111.1, w: ["c4_4", "google"], c: ["#8a3b22", "#b5502f", "#e07a52"] },
    { n: "AMAZON", v: 110, w: ["c4_5", "amazon"], c: ["#7a3420", "#a6492b", "#d36f49"] },
    { n: "MICROSOFT", v: 31.4, w: ["c4_6", "microsoft"], c: ["#6b2e1d", "#954027", "#c46442"] },
    { n: "NVIDIA GPUs VIA NEOCLOUDS", v: 86, w: ["c4_7", "nvidia"], c: ["#7f4a1c", "#ad6626", "#d9893f"] },
    { n: "BROADCOM-LINKED LEASES", v: 161.2, w: ["c4_8", "broadcom"], c: ["#5e1f16", "#86301f", "#b44a32"] },
  ];
  let z = 0;
  const labels = [];
  blocks.forEach((b, i) => {
    const z0 = z, z1 = z + b.v * KH;
    z = z1;
    const g = sv("g", {}, tsv);
    iso(g, z0 + 2, z1, GX, GY, b.c);
    const tz = at(b.w[0], b.w[1]) - 0.2;
    gsap.set(g, { opacity: 0, y: -260 });
    to(g, tz, { opacity: 1, y: 0, duration: 0.55, ease: "bounce.out" });
    cueSfx(tz + 0.25, "block", 1);
    shake(tz + 0.3, 6 + i * 2, 0.35);
    // label with leader line
    const ym = GY - (z0 + z1) / 2 + D * 0.4;
    const lx = GX + A + 40;
    const ll = sv("line", { x1: GX + A - 10, x2: lx + 60, y1: ym, y2: ym, stroke: "rgba(243,239,230,.35)", "stroke-width": 1.5 }, tsv);
    const lab = put(TW.cam, `<div class="nowrap" style="position:absolute;left:${lx + 76}px;top:${ym - 24}px;display:flex;align-items:baseline;gap:18px">
        <div class="disp black" style="font-size:44px">$${b.v}B</div><div class="mono dim" style="font-size:19px;letter-spacing:.15em">${b.n}</div></div>`);
    gsap.set(ll, { opacity: 0 });
    to(ll, tz + 0.3, { opacity: 1, duration: 0.3 });
    inA(lab, tz + 0.3, "left", { dur: 0.5 });
    labels.push(lab, ll);
  });
  function shake(t, a, d) { X.shake(t, a, d); }
  const sumNote = put(TW.cam, `<div class="mono dim2" style="position:absolute;left:1000px;top:955px;width:840px;font-size:15px;letter-spacing:.1em;line-height:1.5">COMPONENTS FROM REUTERS & OTHER REPORTS ON THE DRAFT S-1; MAY NOT SUM EXACTLY. OTHER REPORTS CITE $450B–$750B.</div>`);
  inA(sumNote, at("c4_4", "google"), "fade");
  // 80% non-cancellable overlay
  const lock = sv("g", { opacity: 0 }, tsv);
  const z80 = 518 * 0.8 * KH;
  sv("polygon", { points: `${GX - A},${GY - z80} ${GX},${GY - z80 + D} ${GX},${GY + D} ${GX - A},${GY}`, fill: "url(#hatchRed)" }, lock);
  sv("polygon", { points: `${GX},${GY - z80 + D} ${GX + A},${GY - z80} ${GX + A},${GY} ${GX},${GY + D}`, fill: "url(#hatchRed)" }, lock);
  sv("line", { x1: GX - A - 8, x2: GX + A + 20, y1: GY - z80, y2: GY - z80, stroke: "#ff4a3d", "stroke-width": 3, "stroke-dasharray": "12 8" }, lock);
  const t80 = at("c4_9", "eighty") - 0.2;
  set(lock, t80, { attr: { opacity: 1 } });
  X.tl.fromTo(lock, { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, t80);
  const l80 = put(TW.cam, `<div style="position:absolute;left:120px;top:${GY - z80 - 120}px;width:420px">
      <div class="disp black red" style="font-size:96px;line-height:1">≈80%</div>
      <div class="mono red" style="font-size:22px;letter-spacing:.18em;margin-top:6px">🔒 CAN’T BE CANCELLED</div></div>`);
  inA(l80, t80, "right", { dur: 0.6 });
  cueSfx(at("c4_9", "cancelled") - 0.1, "lock", 1);
  // the cash cube
  const tCash0 = S("c4_10") - 0.1;
  to(TW.cam, tCash0, { x: -260, duration: 1.2, ease: "power3.inOut" });
  labels.forEach((l) => to(l, tCash0, { opacity: 0, duration: 0.4 }));
  to(hdr, tCash0, { opacity: 0.18, duration: 0.5 });
  to(l80, tCash0, { opacity: 0, duration: 0.4 });
  to(sumNote, tCash0, { opacity: 0, duration: 0.4 });
  const CX = 1520, ca = 60, cd = 30;
  const cash = sv("g", { opacity: 0 }, tsv);
  sv("polygon", { points: `${CX - ca},${GY} ${CX},${GY + cd} ${CX + ca},${GY} ${CX},${GY - cd}`, fill: "rgba(243,239,230,.05)", stroke: "rgba(243,239,230,.2)", "stroke-width": 2 }, tsv);
  iso(cash, 0, 20.28 * KH, CX, GY, ["#1f8d6b", "#2bb98d", "#6fe8c4"], ca, cd);
  const tCash = at("c4_11", "twenty point") - 0.1;
  gsap.set(cash, { y: -200 });
  to(cash, tCash, { opacity: 1, y: 0, duration: 0.4, ease: "bounce.out" });
  cueSfx(tCash + 0.2, "block_small", 1);
  const clab = put(TW.cam, `<div style="position:absolute;left:${CX - 200}px;top:${GY + 70}px;width:400px;text-align:center">
      <div class="disp black teal" style="font-size:64px">$20.28B</div><div class="mono dim" style="font-size:18px;letter-spacing:.15em;margin-top:4px">CASH · DEC 31, 2025</div></div>`);
  inA(clab, tCash + 0.2, "up", { dur: 0.5 });
  const x25 = cput(TW.cam, `<div class="disp black nowrap" style="font-size:300px;line-height:1;color:#ff6a3d;text-shadow:0 0 90px rgba(255,106,61,.5)">≈25×</div>`, 1450, 500);
  const t25 = at("c4_11", "twenty-five") - 0.15;
  inA(x25, t25, "slam", { dur: 0.45 });
  hit(t25 + 0.05, { amp: 22, peak: 0.35, color: "#ff6a3d" });
  cueSfx(t25, "impact_big", 1.1);
  const x25s = cput(TW.cam, `<div class="mono nowrap" style="font-size:26px;letter-spacing:.25em;color:var(--ink2)">THE BILL vs. THE CASH</div>`, 1450, 670);
  inA(x25s, t25 + 0.4, "fade");
  // raises
  const tRz = at("c4_12", "thirty billion") - 0.2;
  outA([x25, x25s], tRz - 0.6, "fade", { dur: 0.4 });
  const rz = [[30, "+$30B · FEB", ["c4_12", "thirty billion"]], [65, "+$65B · MAY", ["c4_12", "sixty-five"]]];
  let zc = 20.28 * KH;
  rz.forEach(([v, lab, w], i) => {
    const g = sv("g", { opacity: 0 }, tsv);
    iso(g, zc + 2, zc + v * KH, CX, GY, ["#4b5260", "#6c7586", "#a6afbf"], ca, cd);
    const yl = GY - zc - (v * KH) / 2;
    zc += v * KH;
    const t = at(w[0], w[1]) - 0.15;
    gsap.set(g, { y: -220 });
    to(g, t, { opacity: 1, y: 0, duration: 0.45, ease: "bounce.out" });
    cueSfx(t + 0.2, "block_small", 0.9);
    const l = put(TW.cam, `<div class="mono nowrap" style="position:absolute;left:${CX + ca + 24}px;top:${yl - 14}px;font-size:22px;letter-spacing:.12em;color:var(--steel)">${lab}</div>`);
    inA(l, t + 0.2, "left", { dur: 0.4 });
  });
  const rzNote = put(TW.cam, `<div class="mono dim2" style="position:absolute;left:${CX - 300}px;top:${GY + 170}px;width:640px;text-align:center;font-size:15px;letter-spacing:.1em">ANNOUNCED 2026 FUNDING ROUNDS — NOT A CASH BALANCE</div>`);
  inA(rzNote, tRz, "fade");
  const frac = cput(TW.cam, `<div class="serif ital nowrap" style="font-size:100px">still a fraction of the bill.</div>`, 1290, 560);
  inA(frac, S("c4_13") - 0.1, "blur", { dur: 0.7 });
  to(TW.cam, S("c4_12"), { scale: 1.04, duration: S("c4_14") - S("c4_12"), ease: "none" });
  source("REUTERS (OCT 2026); FORTUNE (CASH, SEP 2026); AXIOS / ORRICK (2026 ROUNDS)", TW.t0, TW.t1);

  /* ---------- the money loop ---------- */
  const LP = scene("bill-loop", S("c4_14") - 0.15, S("c4_17") - 0.15, { fin: 0.3, fout: 0.35 });
  const lsv = svgLayer(LP.cam);
  const NA = { x: 500, y: 540 }, NB = { x: 1420, y: 540 };
  const nodeA = cput(LP.cam, `<div style="width:360px;height:360px;border-radius:180px;border:3px solid #8e9aab;background:#121418;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
      <div class="mono" style="font-size:26px;letter-spacing:.15em">AMAZON<br>GOOGLE</div>
      <div class="mono dim tag" style="font-size:17px;letter-spacing:.15em;margin-top:14px">INVESTORS · LANDLORDS</div></div>`, NA.x, NA.y);
  const nodeB = cput(LP.cam, `<div style="width:360px;height:360px;border-radius:180px;border:3px solid #d97757;background:#1b120e;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div class="mono" style="font-size:28px;letter-spacing:.15em">ANTHROPIC</div></div>`, NB.x, NB.y);
  inA(nodeA, LP.t0 + 0.1, "pop", { dur: 0.6 });
  inA(nodeB, LP.t0 + 0.3, "pop", { dur: 0.6 });
  const both = cput(LP.cam, `<div class="serif ital nowrap" style="font-size:76px">both sides of the table</div>`, 960, 150);
  inA(both, at("c4_14", "both sides") - 0.2, "blur", { dur: 0.7 });
  outA(both, S("c4_15") - 0.1, "fade", { dur: 0.3 });
  const topArc = sv("path", { d: `M ${NA.x + 120} ${NA.y - 140} C 800 220, 1120 220, ${NB.x - 120} ${NB.y - 140}`, fill: "none", stroke: "#35d6a6", "stroke-width": 4, pathLength: 1 }, lsv);
  const botArc = sv("path", { d: `M ${NB.x - 120} ${NB.y + 140} C 1120 860, 800 860, ${NA.x + 120} ${NA.y + 140}`, fill: "none", stroke: "#ff6a3d", "stroke-width": 4, pathLength: 1 }, lsv);
  const steps = [
    ["c4_15", "invest", topArc, `<div class="mono teal" style="font-size:24px;letter-spacing:.18em">① INVEST $ →</div>`, 960, 230],
    ["c4_15", "pays them", botArc, `<div class="mono" style="font-size:24px;letter-spacing:.18em;color:#ff6a3d">← ② PAY FOR CLOUD</div>`, 960, 850],
  ];
  steps.forEach(([id, w, path, html, x, y]) => {
    const t = at(id, w) - 0.2;
    X.draw(path, t, 0.9);
    const l = cput(LP.cam, html, x, y);
    inA(l, t + 0.3, "fade");
    cueSfx(t, "whoosh_soft");
  });
  const b3 = cput(LP.cam, `<div class="mono teal nowrap" style="padding:12px 20px;border:2px solid #35d6a6;background:#0b0a09;font-size:22px;letter-spacing:.15em">③ STAKES RISE ↑</div>`, NA.x, NA.y + 230);
  const b4 = cput(LP.cam, `<div class="mono red nowrap" style="padding:12px 20px;border:2px solid #ff4a3d;background:#0b0a09;font-size:22px;letter-spacing:.15em">④ BOOKS A LOSS ↓</div>`, NB.x, NB.y + 230);
  inA(b3, at("c4_15", "their stakes") - 0.15, "pop", { dur: 0.5 });
  inA(b4, at("c4_15", "books a loss") - 0.15, "pop", { dur: 0.5 });
  cueSfx(at("c4_15", "their stakes") - 0.15, "pop");
  cueSfx(at("c4_15", "books a loss") - 0.15, "pop");
  // particles around the loop
  const lc = put(LP.cam, `<canvas width="1920" height="1080" style="position:absolute;left:0;top:0"></canvas>`);
  const lx = lc.getContext("2d");
  const bez = (p0, p1, p2, p3, u) => {
    const v = 1 - u;
    return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3;
  };
  const tTop = at("c4_15", "invest"), tBot = at("c4_15", "pays them");
  during(LP.t0, LP.t1, (t) => {
    lx.clearRect(0, 0, 1920, 1080);
    for (let i = 0; i < 24; i++) {
      const u = ((i / 24) + t * 0.18) % 1;
      if (t > tTop + 0.8) {
        lx.fillStyle = "rgba(53,214,166,.9)";
        lx.fillRect(bez(NA.x + 120, 800, 1120, NB.x - 120, u) - 4, bez(NA.y - 140, 220, 220, NB.y - 140, u) - 4, 8, 8);
      }
      if (t > tBot + 0.8) {
        lx.fillStyle = "rgba(255,106,61,.9)";
        lx.fillRect(bez(NB.x - 120, 1120, 800, NA.x + 120, u) - 4, bez(NB.y + 140, 860, 860, NA.y + 140, u) - 4, 8, 8);
      }
    }
  });
  // rivals
  const tR = at("c4_16", "competitor") - 0.3;
  const tag = nodeA.querySelector(".tag");
  setHTML(tag, tR, "INVESTORS · LANDLORDS · <span class='red'>RIVALS</span>");
  to(nodeA, tR, { borderColor: "#ff4a3d", duration: 0.4 });
  const warn = cput(LP.cam, `<div class="card nowrap" style="position:absolute;padding:22px 34px;border-color:rgba(255,74,61,.5)">
      <div class="mono red" style="font-size:22px;letter-spacing:.15em">⚠ FROM THE FILING’S RISK FACTORS</div>
      <div class="serif ital" style="font-size:56px;margin-top:8px">Cloud partners increasingly see Anthropic as a competitor.</div></div>`, 960, 540);
  inA(warn, at("c4_16", "warns") - 0.1, "up", { dur: 0.6 });
  cueSfx(at("c4_16", "warns") - 0.1, "alert", 1);
  const para = put(LP.cam, `<div class="mono dim2" style="position:absolute;left:560px;top:650px;width:800px;text-align:center;font-size:14px;letter-spacing:.1em">AS DESCRIBED IN PRESS REPORTS OF THE DRAFT S-1</div>`);
  inA(para, at("c4_16", "warns") + 0.3, "fade");
  source("REUTERS / FOURWEEKMBA, ON THE DRAFT S-1 RISK FACTORS", LP.t0, LP.t1);

  /* ---------- two customers ---------- */
  const TC = scene("bill-customers", S("c4_17") - 0.15, X.sec("ch5") - 0.1, { fin: 0.3, fout: 0.3 });
  const csv = svgLayer(TC.cam);
  const PX = 640, PY = 540, PR = 250;
  sv("circle", { cx: PX, cy: PY, r: PR, fill: "none", stroke: "rgba(243,239,230,.12)", "stroke-width": 110 }, csv);
  const w20 = sv("circle", { cx: PX, cy: PY, r: PR, fill: "none", stroke: "#ff6a3d", "stroke-width": 110, pathLength: 100, "stroke-dasharray": "0 100", transform: `rotate(-90 ${PX} ${PY})` }, csv);
  const w25 = sv("circle", { cx: PX, cy: PY, r: PR, fill: "none", stroke: "url(#hatchRed)", "stroke-width": 110, pathLength: 100, "stroke-dasharray": "0 100", "stroke-dashoffset": -20, transform: `rotate(-90 ${PX} ${PY})` }, csv);
  const cs = { a: 0, b: 0 };
  to(cs, at("c4_17", "fifth") - 0.2, { a: 20, duration: 0.8, ease: "expo.out" });
  to(cs, at("c4_17", "quarter") - 0.2, { b: 5, duration: 0.6, ease: "expo.out" });
  during(TC.t0, TC.t1, () => {
    w20.setAttribute("stroke-dasharray", `${cs.a} ${100 - cs.a}`);
    w25.setAttribute("stroke-dasharray", `${cs.b} ${100 - cs.b}`);
  });
  const ct = put(TC.cam, `<div style="position:absolute;left:1060px;top:360px;width:760px">
      <div class="disp black" style="font-size:150px;line-height:1;color:#ff6a3d">2</div>
      <div class="mono" style="font-size:30px;letter-spacing:.2em;margin-top:10px">CUSTOMERS</div>
      <div class="serif ital dim" style="font-size:64px;margin-top:20px">≈ 20–25% of revenue</div></div>`);
  inA([...ct.children], TC.t0 + 0.3, "up", { dur: 0.6, stagger: 0.12 });
  cueSfx(at("c4_17", "fifth") - 0.2, "tick");
  source("REUTERS; INC. — REPORTS DIFFER ON THE EXACT SHARE", TC.t0, TC.t1);
}
