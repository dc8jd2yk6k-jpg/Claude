// Twist #2 (2:19–3:07): compute, the $518B tower, the cash next to it, the loop.
import { statement, heroNumber, drift } from "./kit.js";

export default function bill(X) {
  const { S, E, at, atEnd, put, cput, inA, outA, to, set, setHTML, scene, hit, glitch, punch, cueSfx, counter, during, sv, svgLayer, source, chapterLabel } = X;
  const t0 = X.sec("bill");
  chapterLabel("04 · Twist #2: the real bill", t0, X.sec("verdict") - 0.3);

  /* ---- b1: not so fast ---- */
  const NF = scene("bill-nsf", t0 - 0.05, S("b2") - 0.05, { fin: 0.05, fout: 0.15 });
  drift(X, NF, 0.07);
  const k = cput(NF.cam, `<div class="kicker" style="font-size:30px">PLOT TWIST #2</div>`, 960, 300);
  inA(k, t0, "wipe", { dur: 0.35 });
  const nsf = cput(NF.cam, `<div class="hero glow-red nowrap" style="font-size:250px">NOT SO FAST.</div>`, 960, 500);
  inA(nsf, at("b1", "not so fast") - 0.05, "slam", { dur: 0.4 });
  hit(at("b1", "not so fast") + 0.02, { amp: 18, peak: 0.3, color: "#ff4a3d" });
  cueSfx(at("b1", "not so fast") - 0.05, "impact", 0.9, 2);
  const real = cput(NF.cam, `<div class="serif ital nowrap" style="font-size:100px">a number that is <span class="glow-hot">very, very real</span></div>`, 960, 730);
  inA(real, at("b1", "a number") - 0.1, "blur", { dur: 0.45 });

  /* ---- b2: compute spend ---- */
  const CS = scene("bill-compute", S("b2") - 0.05, S("b3") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, CS, 0.04);
  const ch = put(CS.cam, `<div style="position:absolute;left:150px;top:200px"><div class="hero" style="font-size:180px">Compute.</div><div class="label" style="margin-top:14px">HALF-YEAR COMPUTE & INFRASTRUCTURE SPEND</div></div>`);
  inA(ch, at("b2", "compute") - 0.1, "up", { dur: 0.45 });
  const KS = 58;
  [["H1 2025", 2.3, "$2.3B", "#9aa8bb", ["b2", "two point three"], 1060], ["H1 2026", 9, "≈ $9B", "#ff5a36", ["b2", "nearly nine"], 1420]].forEach(([lab, v, txt, col, w, x]) => {
    const t = at(w[0], w[1]) - 0.1;
    const bb = put(CS.cam, `<div style="position:absolute;left:${x}px;top:920px;width:260px;height:0;background:${col}"></div>`);
    const l = put(CS.cam, `<div class="label" style="position:absolute;left:${x - 20}px;top:940px;width:300px;text-align:center;font-size:28px">${lab}</div>`);
    const tv = put(CS.cam, `<div class="hero" style="position:absolute;left:${x - 70}px;top:${920 - v * KS - 120}px;width:400px;text-align:center;font-size:96px">${txt}</div>`);
    to(bb, t, { height: v * KS, top: 920 - v * KS, duration: 0.7, ease: "expo.out" });
    inA([l, tv], t + 0.15, "up", { dur: 0.4 });
  });
  const x4 = cput(CS.cam, `<div class="stamp" style="font-size:64px;color:#ff5a36;transform:rotate(-6deg)">≈4×</div>`, 1310, 420);
  inA(x4, at("b2", "nearly nine") + 0.6, "slam", { dur: 0.35 });
  punch(at("b2", "nearly nine") + 0.6, 0.05);
  source("Reuters — draft S-1, Oct 20 2026", CS.t0 + 0.3, CS.t1);

  /* ---- b3–b5: the tower of commitments ---- */
  const TW = scene("bill-tower", S("b3") - 0.05, S("b8") - 0.05, { fin: 0.1, fout: 0.2 });
  const tsv = svgLayer(TW.cam);
  const GX = 640, GY = 930, A = 210, D = 105, KH = 660 / 518;
  const iso = (g, z0, z1, cx, gy, cols, a = A, d = D) => {
    const by = gy - z0, ty = gy - z1;
    sv("polygon", { points: `${cx - a},${ty} ${cx},${ty + d} ${cx},${by + d} ${cx - a},${by}`, fill: cols[0] }, g);
    sv("polygon", { points: `${cx},${ty + d} ${cx + a},${ty} ${cx + a},${by} ${cx},${by + d}`, fill: cols[1] }, g);
    sv("polygon", { points: `${cx},${ty - d} ${cx + a},${ty} ${cx},${ty + d} ${cx - a},${ty}`, fill: cols[2] }, g);
  };
  sv("polygon", { points: `${GX - A},${GY} ${GX},${GY + D} ${GX + A},${GY} ${GX},${GY - D}`, fill: "rgba(243,239,230,.06)", stroke: "rgba(243,239,230,.25)", "stroke-width": 2 }, tsv);
  const gtop = GY - 518 * KH;
  const ghostT = sv("g", { opacity: 0 }, tsv);
  sv("polyline", { points: `${GX - A},${GY} ${GX - A},${gtop} ${GX},${gtop - D} ${GX + A},${gtop} ${GX + A},${GY}`, fill: "none", stroke: "rgba(255,106,61,.7)", "stroke-width": 3, "stroke-dasharray": "12 10" }, ghostT);
  const hdr = put(TW.cam, `<div style="position:absolute;left:1080px;top:150px">
      <div class="label">AI-INFRASTRUCTURE COMMITMENTS</div>
      <div class="hero num v glow-hot" style="font-size:190px">≥ $0B</div>
      <div class="label">OVER ROUGHLY A DECADE</div></div>`);
  const t518 = at("b3", "five hundred") - 0.15;
  inA(hdr, TW.t0 + 0.1, "up", { dur: 0.45 });
  counter(hdr.querySelector(".v"), t518, 1.2, 0, 518, (v) => `≥ $${Math.round(v)}B`, "expo.out");
  set(ghostT, t518, { attr: { opacity: 1 } });
  punch(t518 + 0.1, 0.05);
  cueSfx(t518 - 0.05, "impact", 0.7, 2);
  const blocks = [
    ["GOOGLE", 111.1, "google", ["#8a3b22", "#b5502f", "#ff8a5c"]],
    ["AMAZON", 110, "amazon", ["#7a3420", "#a6492b", "#f07a52"]],
    ["MICROSOFT", 31.4, "microsoft", ["#6b2e1d", "#954027", "#d96a46"]],
    ["NVIDIA VIA NEOCLOUDS", 86, "nvidia", ["#7f4a1c", "#ad6626", "#f09a4a"]],
    ["BROADCOM-LINKED LEASES", 161.2, "broadcom-linked", ["#5e1f16", "#86301f", "#c9553a"]],
  ];
  let z = 0;
  const labels = [];
  blocks.forEach(([n, v, w, cols], i) => {
    const z0 = z, z1 = z + v * KH;
    z = z1;
    const g = sv("g", {}, tsv);
    iso(g, z0 + 2, z1, GX, GY, cols);
    const tz = at("b4", w) - 0.12;
    gsap.set(g, { opacity: 0, y: -300 });
    to(g, tz, { opacity: 1, y: 0, duration: 0.45, ease: "bounce.out" });
    X.shake(tz + 0.25, 5 + i * 2, 0.3);
    const ym = GY - (z0 + z1) / 2 + D * 0.4;
    const lab = put(TW.cam, `<div class="nowrap" style="position:absolute;left:${GX + A + 50}px;top:${ym - 30}px;display:flex;align-items:baseline;gap:18px">
        <div class="hero" style="font-size:56px">$${v}B</div><div class="label" style="font-size:24px;color:var(--ink)">${n}</div></div>`);
    inA(lab, tz + 0.2, "left", { dur: 0.35 });
    labels.push(lab);
  });
  const lock = sv("g", { opacity: 0 }, tsv);
  const z80 = 518 * 0.8 * KH;
  sv("polygon", { points: `${GX - A},${GY - z80} ${GX},${GY - z80 + D} ${GX},${GY + D} ${GX - A},${GY}`, fill: "url(#hatchRed)" }, lock);
  sv("polygon", { points: `${GX},${GY - z80 + D} ${GX + A},${GY - z80} ${GX + A},${GY} ${GX},${GY + D}`, fill: "url(#hatchRed)" }, lock);
  sv("line", { x1: GX - A - 10, x2: GX + A + 30, y1: GY - z80, y2: GY - z80, stroke: "#ff4a3d", "stroke-width": 4, "stroke-dasharray": "14 8" }, lock);
  const t80 = at("b5", "eighty") - 0.15;
  set(lock, t80, { attr: { opacity: 1 } });
  const l80 = put(TW.cam, `<div style="position:absolute;left:90px;top:${GY - z80 - 160}px;width:360px"><div class="hero glow-red" style="font-size:120px">80%</div><div class="label" style="color:#ff4a3d;font-size:26px">🔒 CAN’T BE CANCELLED</div></div>`);
  inA(l80, t80, "right", { dur: 0.4 });
  cueSfx(at("b5", "cancelled") - 0.1, "lock", 1, 2);
  // the cash cube, ~25x smaller
  const tCash0 = S("b6") - 0.1;
  to(TW.cam, tCash0, { x: -300, duration: 0.9, ease: "power3.inOut" });
  to(labels, tCash0, { opacity: 0, duration: 0.3 });
  to(hdr, tCash0, { opacity: 0, duration: 0.4 });
  to(l80, tCash0, { opacity: 0, duration: 0.3 });
  const CX = 1560, ca = 70, cd = 35;
  const cash = sv("g", { opacity: 0 }, tsv);
  sv("polygon", { points: `${CX - ca},${GY} ${CX},${GY + cd} ${CX + ca},${GY} ${CX},${GY - cd}`, fill: "rgba(243,239,230,.06)", stroke: "rgba(243,239,230,.25)", "stroke-width": 2 }, tsv);
  iso(cash, 0, 20.28 * KH, CX, GY, ["#1f8d6b", "#2bb98d", "#7af0cd"], ca, cd);
  const tCash = at("b6", "the cash") - 0.05;
  gsap.set(cash, { y: -220 });
  to(cash, tCash, { opacity: 1, y: 0, duration: 0.4, ease: "bounce.out" });
  const clab = put(TW.cam, `<div style="position:absolute;left:${CX - 560}px;top:${GY - 110}px;width:460px;text-align:right"><div class="hero glow-mint" style="font-size:76px">$20.28B</div><div class="label" style="font-size:22px">CASH · DEC 31 2025</div></div>`);
  inA(clab, tCash + 0.2, "up", { dur: 0.4 });
  const x25 = cput(TW.cam, `<div style="text-align:center"><div class="hero glow-hot nowrap" style="font-size:330px">≈25×</div><div class="label" style="color:var(--ink);font-size:30px">THE BILL vs THE CASH</div></div>`, 1480, 440);
  const t25 = at("b6", "twenty-five") - 0.1;
  inA(x25, t25, "slam", { dur: 0.4 });
  hit(t25 + 0.05, { amp: 26, peak: 0.4, color: "#ff5a36" });
  cueSfx(t25 - 0.04, "impact_big", 1, 3);
  // b7: the 2026 raises still don't close the gap
  const tRz = S("b7") + 0.4;
  to(x25, tRz, { opacity: 0, scale: 0.8, duration: 0.4 });
  let zc = 20.28 * KH;
  [[30, "+$30B · FEB", "ninety-five"], [65, "+$65B · MAY", "ninety-five"]].forEach(([v, lab, w], i) => {
    const g = sv("g", { opacity: 0 }, tsv);
    iso(g, zc + 2, zc + v * KH, CX, GY, ["#4b5260", "#6c7586", "#b6bfcf"], ca, cd);
    const yl = GY - zc - (v * KH) / 2;
    zc += v * KH;
    const t = at("b7", w) + i * 0.45 - 0.1;
    gsap.set(g, { y: -220 });
    to(g, t, { opacity: 1, y: 0, duration: 0.4, ease: "bounce.out" });
    const l = put(TW.cam, `<div class="label nowrap" style="position:absolute;left:${CX + ca + 24}px;top:${yl - 16}px;font-size:26px;color:var(--steel)">${lab}</div>`);
    inA(l, t + 0.2, "left", { dur: 0.35 });
  });
  const frac = cput(TW.cam, `<div style="text-align:center"><div class="label" style="font-size:24px">ANNOUNCED 2026 ROUNDS — NOT A CASH BALANCE</div><div class="hero nowrap" style="font-size:110px;margin-top:10px">Still a fraction.</div></div>`, 1380, 360);
  inA(frac, at("b7", "still") - 0.1, "blur", { dur: 0.45 });
  punch(at("b7", "fraction"), 0.05);
  source("Reuters (Oct 2026); other reports cite $450B–$750B · cash: Fortune · rounds: Axios, Orrick", TW.t0 + 0.4, TW.t1);

  /* ---- b8: landlords, investors, rivals ---- */
  const LP = scene("bill-loop", S("b8") - 0.05, S("b9") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, LP, 0.05);
  const NA = { x: 520, y: 560 }, NB = { x: 1400, y: 560 };
  const nodeA = cput(LP.cam, `<div style="width:400px;height:400px;border-radius:200px;border:4px solid #9aa8bb;background:#11141a;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
      <div class="hero" style="font-size:56px">AMAZON<br>GOOGLE<br>MICROSOFT</div></div>`, NA.x, NA.y);
  const nodeB = cput(LP.cam, `<div style="width:400px;height:400px;border-radius:200px;border:4px solid #ff5a36;background:#1c100c;display:flex;align-items:center;justify-content:center"><div class="hero" style="font-size:60px">ANTHROPIC</div></div>`, NB.x, NB.y);
  inA([nodeA, nodeB], LP.t0, "pop", { dur: 0.45, stagger: 0.12 });
  [["LANDLORDS", "#ffc857", "landlords", 300], ["INVESTORS", "#3de0b0", "investors", 640], ["RIVALS?", "#ff4a3d", "rivals", 960]].forEach(([r, c, w, x]) => {
    const e = cput(LP.cam, `<div class="pill" style="font-size:34px;background:${c};color:#07070a">${r}</div>`, x, 930);
    inA(e, at("b8", w) - 0.1, "pop", { dur: 0.4 });
  });
  const lsv = svgLayer(LP.cam);
  const arc1 = sv("path", { d: `M ${NA.x + 140} ${NA.y - 150} C 820 260, 1100 260, ${NB.x - 140} ${NB.y - 150}`, fill: "none", stroke: "#3de0b0", "stroke-width": 6, pathLength: 1 }, lsv);
  const arc2 = sv("path", { d: `M ${NB.x - 140} ${NB.y + 150} C 1100 860, 820 860, ${NA.x + 140} ${NA.y + 150}`, fill: "none", stroke: "#ffc857", "stroke-width": 6, pathLength: 1 }, lsv);
  X.draw(arc2, at("b8", "landlords") - 0.1, 0.6);
  X.draw(arc1, at("b8", "investors") - 0.1, 0.6);
  const w1 = cput(LP.cam, `<div class="label" style="color:#3de0b0;font-size:26px">INVEST $ →</div>`, 960, 300);
  const w2 = cput(LP.cam, `<div class="label" style="color:#ffc857;font-size:26px">← PAYS FOR COMPUTE</div>`, 960, 830);
  inA(w2, at("b8", "landlords"), "fade");
  inA(w1, at("b8", "investors"), "fade");
  to(nodeA, at("b8", "rivals") - 0.1, { borderColor: "#ff4a3d", duration: 0.3 });
  glitch(at("b8", "rivals") - 0.05, 0.25, 0.6);
  punch(at("b8", "rivals"), 0.05);
  source("Reuters / FourWeekMBA on the draft S-1 risk factors", LP.t0 + 0.3, LP.t1);

  /* ---- b9: two customers ---- */
  const TC = scene("bill-cust", S("b9") - 0.05, X.sec("verdict") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, TC, 0.05);
  const csv = svgLayer(TC.cam);
  const PX = 620, PY = 560, PR = 270;
  sv("circle", { cx: PX, cy: PY, r: PR, fill: "none", stroke: "rgba(243,239,230,.12)", "stroke-width": 120 }, csv);
  const w20 = sv("circle", { cx: PX, cy: PY, r: PR, fill: "none", stroke: "#ff5a36", "stroke-width": 120, pathLength: 100, "stroke-dasharray": "0 100", transform: `rotate(-90 ${PX} ${PY})` }, csv);
  const w25 = sv("circle", { cx: PX, cy: PY, r: PR, fill: "none", stroke: "url(#hatchRed)", "stroke-width": 120, pathLength: 100, "stroke-dasharray": "0 100", "stroke-dashoffset": -20, transform: `rotate(-90 ${PX} ${PY})` }, csv);
  const cs = { a: 0, b: 0 };
  to(cs, at("b9", "fifth") - 0.15, { a: 20, duration: 0.6, ease: "expo.out" });
  to(cs, at("b9", "quarter") - 0.15, { b: 5, duration: 0.5, ease: "expo.out" });
  during(TC.t0, TC.t1, () => {
    w20.setAttribute("stroke-dasharray", `${cs.a} ${100 - cs.a}`);
    w25.setAttribute("stroke-dasharray", `${cs.b} ${100 - cs.b}`);
  });
  const ct = put(TC.cam, `<div style="position:absolute;left:1060px;top:330px">
      <div class="hero glow-hot" style="font-size:260px;line-height:.9">2</div>
      <div class="label" style="font-size:40px;color:var(--ink)">CUSTOMERS</div>
      <div class="serif ital" style="font-size:80px;margin-top:20px;color:var(--ink2)">≈ 20–25% of revenue</div></div>`);
  inA([...ct.children], TC.t0 + 0.2, "up", { dur: 0.4, stagger: 0.1 });
  source("Reuters; Inc. — reports differ on the exact share", TC.t0 + 0.3, TC.t1);
}
