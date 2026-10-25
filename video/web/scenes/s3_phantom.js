// Twist #1 (1:29–2:19): the $72B non-cash charge, the $10 analogy, Amazon's mirror.
import { statement, heroNumber, drift } from "./kit.js";

export default function phantom(X) {
  const { S, E, at, atEnd, put, cput, inA, outA, to, set, setHTML, scene, hit, glitch, punch, cueSfx, counter, during, sv, svgLayer, source, chapterLabel } = X;
  const GH = "#6f9bff";
  const ghost = `repeating-linear-gradient(45deg,rgba(111,155,255,.6) 0 12px,rgba(111,155,255,.14) 12px 26px)`;
  const t0 = X.sec("phantom");
  chapterLabel("03 · Twist #1: the phantom loss", t0, X.sec("bill") - 0.3);

  /* ---- p1: the split ---- */
  const W = scene("ph-split", t0 - 0.05, S("p2") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, W, 0.04);
  const tw = cput(W.cam, `<div class="kicker" style="color:${GH};font-size:30px">PLOT TWIST #1</div>`, 960, 150);
  inA(tw, W.t0, "wipe", { dur: 0.4 });
  glitch(W.t0 + 0.02, 0.25, 0.8);
  const ZY = 250, KH = 640 / 80.7;
  put(W.cam, `<div style="position:absolute;left:380px;top:${ZY}px;width:1160px;height:3px;background:var(--ink3)"></div>`);
  const top = put(W.cam, `<div style="position:absolute;left:560px;top:${ZY}px;width:380px;height:${8.7 * KH}px;background:#ff4a3d"></div>`);
  const bot = put(W.cam, `<div style="position:absolute;left:560px;top:${ZY + 8.7 * KH}px;width:380px;height:${72 * KH}px;background:#ff4a3d"></div>`);
  inA([top, bot], W.t0, "wipeUp", { dur: 0.5 });
  const tS = at("p1", "seventy-two") - 0.1;
  to(bot, tS, { background: ghost, left: 600, duration: 0.6, ease: "expo.inOut" });
  to(top, tS, { left: 520, duration: 0.6, ease: "expo.inOut" });
  const l72 = put(W.cam, `<div style="position:absolute;left:1040px;top:${ZY + 200}px">
      <div class="hero glow-sky" style="font-size:200px">−$72B</div>
      <div class="label" style="color:${GH};font-size:30px;margin-top:10px">ACCOUNTING CHARGE · NON-CASH</div></div>`);
  inA(l72, tS + 0.1, "left", { dur: 0.45 });
  const l87 = put(W.cam, `<div style="position:absolute;left:1040px;top:${ZY - 10}px"><span class="hero" style="font-size:64px;color:#ff4a3d">≈ −$8.7B</span> <span class="label" style="font-size:24px">EVERYTHING ELSE</span></div>`);
  inA(l87, tS + 0.4, "left", { dur: 0.45 });
  const out = cput(W.cam, `<div class="pill" style="font-size:34px;background:var(--mint);color:#07070a">CASH THAT LEFT THE BUILDING: $0</div>`, 1340, 820);
  inA(out, at("p1", "never left") - 0.05, "pop", { dur: 0.4 });
  punch(at("p1", "never left"), 0.05);
  during(tS + 0.6, W.t1, (t) => { bot.style.opacity = (0.78 + 0.18 * Math.sin(t * 5.1) * Math.sin(t * 2.3)).toFixed(3); });
  cueSfx(tS - 0.02, "impact", 0.6, 2);
  source("Reuters / WSJ — draft S-1, Oct 20 2026", W.t0 + 0.3, W.t1);

  /* ---- p2: convertible note ---- */
  const C = scene("ph-note", S("p2") - 0.05, S("p3") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, C, 0.05);
  const def = cput(C.cam, `<div class="hero nowrap" style="font-size:140px">Convertible note</div>`, 960, 280);
  inA(def, at("p2", "convertible") - 0.1, "up", { dur: 0.45 });
  const a = cput(C.cam, `<div style="text-align:center;width:520px;padding:36px;border:3px solid var(--mint);border-radius:22px"><div class="hero glow-mint" style="font-size:150px">$</div><div class="label" style="font-size:28px;color:var(--ink)">INVESTORS LEND MONEY</div></div>`, 520, 640);
  const arr = cput(C.cam, `<div class="hero" style="font-size:160px;color:${GH}">→</div>`, 960, 640);
  const b = cput(C.cam, `<div style="text-align:center;width:520px;padding:36px;border:3px solid var(--hot);border-radius:22px"><div class="hero glow-hot" style="font-size:150px">▦</div><div class="label" style="font-size:28px;color:var(--ink)">IT TURNS INTO SHARES</div></div>`, 1400, 640);
  inA(a, at("p2", "money") - 0.1, "pop", { dur: 0.45 });
  inA(arr, at("p2", "turns") - 0.3, "right", { dur: 0.4 });
  inA(b, at("p2", "shares") - 0.15, "pop", { dur: 0.45 });

  /* ---- p3–p5: the $10 analogy ---- */
  const A = scene("ph-analogy", S("p3") - 0.05, S("p6") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, A, 0.04);
  const avatar = (lab, x, col) => cput(A.cam, `<div style="text-align:center"><div style="width:200px;height:200px;border-radius:100px;border:4px solid ${col};display:flex;align-items:center;justify-content:center;margin:0 auto">
      <svg width="104" height="116" viewBox="0 0 90 100"><circle cx="45" cy="32" r="22" fill="${col}"/><path d="M5 100 C 5 62 85 62 85 100 Z" fill="${col}"/></svg></div>
      <div class="label" style="font-size:30px;color:var(--ink);margin-top:16px">${lab}</div></div>`, x, 300);
  const fr = avatar("FRIEND", 330, "#9aa8bb"), you = avatar("YOU", 1590, "#ff5a36");
  inA([fr, you], A.t0, "pop", { dur: 0.45, stagger: 0.12 });
  const bill = cput(A.cam, `<div style="width:250px;height:126px;background:#2fae80;border-radius:12px;display:flex;align-items:center;justify-content:center;border:4px solid #a8f0d4"><div class="hero" style="font-size:76px;color:#062a1f">$10</div></div>`, 330, 560);
  const tLend = at("p3", "lends you");
  inA(bill, tLend - 0.3, "pop", { dur: 0.35 });
  to(bill, tLend + 0.2, { x: 1260, duration: 0.9, ease: "power3.inOut" });
  const iou = cput(A.cam, `<div class="card" style="position:absolute;width:600px;padding:34px 42px;border:3px solid ${GH};background:#10131c">
      <div class="label" style="color:${GH};font-size:26px">IOU · REPAY IN SHARES</div>
      <div class="hero" style="font-size:64px;margin-top:12px">10 shares @ $1</div>
      <div style="height:2px;background:var(--line);margin:22px 0"></div>
      <div class="label" style="font-size:24px">WORTH</div>
      <div class="hero num worth" style="font-size:130px">$10</div></div>`, 960, 650);
  inA(iou, at("p3", "promise") - 0.1, "up", { dur: 0.45 });
  const x10 = cput(A.cam, `<div style="text-align:center"><div class="label" style="color:var(--sun)">COMPANY VALUE</div><div class="hero glow-sun" style="font-size:200px">×10</div></div>`, 1560, 680);
  inA(x10, at("p4", "ten times") - 0.1, "slam", { dur: 0.4 });
  to(bill, S("p4") - 0.1, { opacity: 0, duration: 0.3 });
  punch(at("p4", "ten times"), 0.05);
  const worth = iou.querySelector(".worth");
  const tH = at("p4", "a hundred") - 0.2;
  counter(worth, tH, 0.8, 10, 100, (v) => `$${Math.round(v)}`, "expo.inOut");
  to(worth, tH, { color: "#ff4a3d", duration: 0.4 });
  to(iou, tH, { scale: 1.12, duration: 0.5, ease: "back.out(2)" });
  // p5: the books
  const tB = S("p5") - 0.1;
  to([fr, you, x10], tB, { opacity: 0, y: -40, duration: 0.3 });
  to(iou, tB, { x: -520, scale: 0.8, duration: 0.5, ease: "expo.inOut" });
  const books = put(A.cam, `<div style="position:absolute;left:820px;top:330px;width:960px">
      <div class="row1" style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid var(--line);padding-bottom:20px">
        <div class="label" style="font-size:34px;color:var(--ink)">ON PAPER</div><div class="hero glow-red" style="font-size:150px">−$90</div></div>
      <div class="row2" style="display:flex;justify-content:space-between;align-items:baseline;margin-top:20px">
        <div class="label" style="font-size:34px;color:var(--ink)">CASH SPENT</div><div class="hero glow-mint" style="font-size:150px">$0</div></div></div>`);
  inA(books.querySelector(".row1"), at("p5", "on paper") - 0.1, "left", { dur: 0.45 });
  inA(books.querySelector(".row2"), at("p5", "in cash") - 0.1, "left", { dur: 0.45 });
  punch(at("p5", "nothing"), 0.04);

  /* ---- p6: the real scale-up ---- */
  const G = scene("ph-gauge", S("p6") - 0.05, S("p7") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, G, 0.04);
  const gsv = svgLayer(G.cam);
  const GX = 560, GY = 650, GR = 320;
  const arcP = (a0, a1, r) => {
    const p = (a) => [GX + r * Math.cos(Math.PI * (1 - a)), GY - r * Math.sin(Math.PI * (1 - a))];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  sv("path", { d: arcP(0, 1, GR), fill: "none", stroke: "rgba(243,239,230,.12)", "stroke-width": 46 }, gsv);
  const gfill = sv("path", { d: arcP(0, 1, GR), fill: "none", stroke: "#ff5a36", "stroke-width": 46, pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1 }, gsv);
  const needle = sv("line", { x1: GX, y1: GY, x2: GX - GR + 50, y2: GY, stroke: "#f3efe6", "stroke-width": 10, "stroke-linecap": "round" }, gsv);
  sv("circle", { cx: GX, cy: GY, r: 22, fill: "#f3efe6" }, gsv);
  const gval = cput(G.cam, `<div style="text-align:center"><div class="hero num v" style="font-size:130px">$380B</div><div class="label">ANTHROPIC VALUATION</div></div>`, GX, GY + 150);
  const gs = { v: 380 }, gv = gval.querySelector(".v");
  inA(gval, G.t0 + 0.05, "up", { dur: 0.4 });
  const tUp = at("p6", "two and a half") - 0.2;
  to(gs, tUp, { v: 965, duration: 1.4, ease: "expo.inOut" });
  const BX = 1400, BY = 560;
  const string = sv("path", { d: "", fill: "none", stroke: "rgba(243,239,230,.4)", "stroke-width": 3 }, gsv);
  const balloon = sv("ellipse", { cx: BX, cy: BY, rx: 90, ry: 110, fill: "url(#hatch)", stroke: GH, "stroke-width": 5 }, gsv);
  const blab = cput(G.cam, `<div class="label" style="color:${GH};font-size:26px;text-align:center">CONVERTIBLE NOTES<br>(A LIABILITY)</div>`, BX, 980);
  inA(blab, at("p6", "notes") - 0.2, "fade");
  const lossC = cput(G.cam, `<div style="text-align:center"><div class="label" style="color:#ff4a3d">REPORTED LOSS</div><div class="hero num glow-red lv" style="font-size:130px">$0</div></div>`, 1400, 150);
  inA(lossC, at("p6", "reported loss") - 0.3, "up", { dur: 0.4 });
  counter(lossC.querySelector(".lv"), at("p6", "reported loss") - 0.2, atEnd("p6", "exploded") - at("p6", "reported loss") + 0.4, 0, 72, (v) => (v < 0.5 ? "$0" : `−$${Math.round(v)}B`), "power2.in");
  hit(atEnd("p6", "exploded"), { amp: 14, peak: 0.2, color: "#ff4a3d" });
  cueSfx(at("p6", "pricier") - 0.4, "swell", 0.7, 1);
  during(G.t0, G.t1, (t) => {
    const a = (gs.v - 0) / 1000, ang = Math.PI * (1 - a);
    needle.setAttribute("x2", (GX + (GR - 50) * Math.cos(ang)).toFixed(1));
    needle.setAttribute("y2", (GY - (GR - 50) * Math.sin(ang)).toFixed(1));
    gfill.setAttribute("stroke-dashoffset", (1 - a).toFixed(4));
    gv.textContent = `$${Math.round(gs.v)}B`;
    const k = X.clamp((gs.v - 380) / 585), wob = 1 + 0.02 * Math.sin(t * 3.3);
    const rx = (90 + 120 * k) * wob, ry = (110 + 120 * k) * wob, cy = BY + 20 * k;
    balloon.setAttribute("rx", rx.toFixed(1)); balloon.setAttribute("ry", ry.toFixed(1)); balloon.setAttribute("cy", cy.toFixed(1));
    const b0 = cy + ry;
    string.setAttribute("d", `M ${BX} ${b0.toFixed(1)} C ${BX - 30} ${b0 + 60} ${BX + 30} ${b0 + 90} ${BX} 930`);
  });
  source("Valuations: Axios (Feb 2026), Orrick/Reuters (May 2026)", G.t0 + 0.3, G.t1);

  /* ---- p7: the line (pattern interrupt) ---- */
  const P = scene("ph-line", S("p7") - 0.05, S("p8") - 0.05, { fin: 0.05, fout: 0.15, z: 2 });
  P.el.insertBefore(X.h(`<div style="position:absolute;inset:0;background:#07070a"></div>`), P.cam);
  statement(X, P.cam, [
    { html: "THE", t: at("p7", "the stronger") }, { html: `<span class="glow-mint">STRONGER</span>`, t: at("p7", "stronger") },
    { html: "IT GETS,", t: at("p7", "gets") },
  ], { y: 400, size: 128, width: 1840 });
  statement(X, P.cam, [
    { html: "THE MORE IT", t: at("p7", "the more") },
    { html: `<span class="serif ital glow-red" style="font-weight:400">appears to lose.</span>`, t: at("p7", "appears") },
  ], { y: 640, size: 128, width: 1840 });
  punch(at("p7", "appears"), 0.06);
  cueSfx(S("p7") - 0.08, "whoosh", 0.8, 1);
  drift(X, P, 0.07);

  /* ---- p8: Amazon's mirror ---- */
  const MR = scene("ph-mirror", S("p8") - 0.05, S("p9") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, MR, 0.04);
  const half = (x, title, col) => put(MR.cam, `<div style="position:absolute;left:${x}px;top:170px;width:820px;height:760px;border:3px solid ${col}55;border-radius:22px;background:rgba(10,10,14,.85);overflow:hidden;padding:40px 50px">
      <div class="label" style="font-size:30px;color:${col}">${title}</div></div>`);
  const am = half(100, "AMAZON’S BOOKS", "#3de0b0"), an = half(1000, "ANTHROPIC’S BOOKS", "#ff4a3d");
  inA(am, MR.t0, "right", { dur: 0.45 });
  inA(an, MR.t0 + 0.15, "left", { dur: 0.45 });
  const qb = (x, v, lab, col, t) => {
    const hgt = v * 3.9;
    const bb = put(am, `<div style="position:absolute;left:${x}px;bottom:120px;width:190px;height:0;background:${col}"></div>`);
    const tv = put(am, `<div class="hero" style="position:absolute;left:${x - 40}px;bottom:${136 + hgt}px;width:280px;text-align:center;font-size:62px;opacity:0">$${v}B</div>`);
    const tl_ = put(am, `<div class="label" style="position:absolute;left:${x - 40}px;bottom:70px;width:280px;text-align:center">${lab}</div>`);
    to(bb, t, { height: hgt, duration: 0.6, ease: "expo.out" });
    to(tv, t + 0.2, { opacity: 1, duration: 0.3 });
    inA(tl_, t, "fade", { dur: 0.3 });
  };
  qb(40, 42.2, "MAR 31", "#22865f", MR.t0 + 0.6);
  qb(270, 97.9, "JUN 30", "#3de0b0", at("p8", "marked") - 0.1);
  const gain = put(am, `<div style="position:absolute;left:500px;top:170px"><div class="hero glow-mint" style="font-size:66px">+$55.7B</div><div class="label" style="font-size:22px">IN ONE QUARTER</div></div>`);
  inA(gain, at("p8", "fifty-five") - 0.1, "slam", { dur: 0.4 });
  const anBody = put(an, `<div style="position:absolute;left:50px;top:200px;width:720px">
      <div class="label" style="font-size:26px">THE SAME NOTES, AS A LIABILITY</div>
      <div class="hero glow-red" style="font-size:180px;margin-top:30px">LOSS</div>
      <div class="label" style="color:#ff4a3d;font-size:26px;margin-top:16px">PART OF THE ~$72B CHARGE</div></div>`);
  inA(anBody, at("p8", "fifty-five") + 0.5, "slam", { dur: 0.4 });
  const same = cput(MR.cam, `<div class="pill" style="font-size:28px;background:#07070a;border:3px solid ${GH};color:${GH}">⇄ SAME NOTES</div>`, 960, 880);
  inA(same, at("p8", "very notes") - 0.1, "pop", { dur: 0.4 });
  punch(at("p8", "fifty-five"), 0.05);
  source("Amazon 10-Q filings (Q1 & Q2 2026), as reported", MR.t0 + 0.3, MR.t1);

  /* ---- p9–p10: strip it out; so the loss is fake? ---- */
  const SO = scene("ph-strip", S("p9") - 0.05, X.sec("bill") - 0.05, { fin: 0.1, fout: 0.1 });
  drift(X, SO, 0.04);
  const ZY2 = 230, K2 = 600 / 80.7;
  put(SO.cam, `<div style="position:absolute;left:420px;top:${ZY2}px;width:1080px;height:3px;background:var(--ink3)"></div>`);
  put(SO.cam, `<div style="position:absolute;left:600px;top:${ZY2}px;width:380px;height:${8.7 * K2}px;background:#ff4a3d"></div>`);
  const sBot = put(SO.cam, `<div style="position:absolute;left:600px;top:${ZY2 + 8.7 * K2}px;width:380px;height:${72 * K2}px;background:${ghost}"></div>`);
  const sv1 = put(SO.cam, `<div style="position:absolute;left:1060px;top:${ZY2 + 30}px"><div class="label">H1 2026 LOSS, WITHOUT THE CHARGE</div><div class="hero num glow-red v" style="font-size:180px">−$80.7B</div></div>`);
  inA(sv1, SO.t0, "left", { dur: 0.4 });
  const tStrip = at("p9", "strip") + 0.15;
  to(sBot, tStrip, { opacity: 0, y: -140, filter: "blur(30px)", scaleX: 1.4, duration: 1.2, ease: "power2.in" });
  counter(sv1.querySelector(".v"), tStrip, 1.3, 80.7, 8.7, (v) => `−$${v.toFixed(1)}B`, "power2.inOut");
  const pc = put(SO.cam, `<canvas width="1920" height="1080" style="position:absolute;left:0;top:0"></canvas>`);
  const px = pc.getContext("2d"), pr = X.rng(77);
  const ps = Array.from({ length: 300 }, () => ({ x: 600 + pr() * 380, y: ZY2 + 8.7 * K2 + pr() * 72 * K2, v: 90 + pr() * 300, d: pr() * 0.6 }));
  during(tStrip, SO.t1, (t) => {
    px.clearRect(0, 0, 1920, 1080);
    const u = t - tStrip;
    for (const p of ps) {
      const k = u - p.d;
      if (k < 0 || k > 2.2) continue;
      px.fillStyle = `rgba(111,155,255,${(0.85 * (1 - k / 2.2)).toFixed(3)})`;
      px.fillRect(p.x + Math.sin(k * 3 + p.x) * 22, p.y - k * p.v, 4, 4);
    }
  });
  cueSfx(tStrip, "riser", 0.5, 1);
  const fake = cput(SO.cam, `<div class="hero nowrap glow-sky" style="font-size:150px">So the loss is fake?</div>`, 960, 860);
  inA(fake, S("p10") - 0.1, "blur", { dur: 0.4 });
}
