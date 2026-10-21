// Chapter 3 — Twist #1, "The Phantom Loss": the $72B non-cash convertible-note charge.
export function twistCard(X, n, title, t0, t1, color) {
  const { put, cput, inA, to, scene, cueSfx, hit, glitch } = X;
  const c = scene(`twist-${n}`, t0, t1, { fin: 0, fout: 0.25, z: 3 });
  const bg = put(c.el, `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,${color}22,transparent 60%)"></div>`);
  inA(bg, t0, "fade", { dur: 0.6 });
  const tw = cput(c.cam, `<div class="mono" style="font-size:30px;letter-spacing:.7em;color:${color};padding-left:.7em">PLOT TWIST #${n}</div>`, 960, 330);
  const tt = cput(c.cam, `<div class="serif ital nowrap" style="font-size:190px;line-height:1">${title}</div>`, 960, 520);
  const ln = cput(c.cam, `<div style="width:900px;height:2px;background:${color}"></div>`, 960, 680);
  inA(tw, t0 + 0.05, "wipe", { dur: 0.7 });
  inA(tt, t0 + 0.15, "blur", { dur: 1.0 });
  inA(ln, t0 + 0.4, "wipe", { dur: 0.9 });
  glitch(t0, 0.3, 0.8);
  hit(t0 + 0.05, { amp: 14, peak: 0.25, color });
  cueSfx(t0, "twist");
  to(c.cam, t0, { scale: 1.05, duration: t1 - t0, ease: "none" });
  return c;
}

export default function ch3(X) {
  const { S, E, at, put, cput, inA, outA, to, set, setHTML, tl, scene, hit, glitch, flash, cueSfx, during, counter, source, chapterLabel, svgLayer, sv } = X;
  const GH = "#8fb3ff";
  const t0 = X.sec("ch3");
  chapterLabel("03 — Twist #1: the phantom loss", t0, X.sec("ch4") - 0.3);
  twistCard(X, 1, "The Phantom Loss", t0 - 2.2, S("c3_0") + 0.1, GH);

  const ghostFill = `repeating-linear-gradient(45deg,rgba(143,179,255,.55) 0 10px,rgba(143,179,255,.12) 10px 22px)`;

  /* ---------- the waterfall: -80.7 = -72 (non-cash) + -8.7 ---------- */
  const W1 = scene("phantom-split", S("c3_0") - 0.1, S("c3_2") - 0.1, { fin: 0.25, fout: 0.3 });
  const ZY = 230, KH = 680 / 80.7;
  const zl = put(W1.cam, `<div style="position:absolute;left:300px;top:${ZY}px;width:1320px;height:2px;background:var(--ink3)"></div>`);
  const zt = put(W1.cam, `<div class="mono dim" style="position:absolute;left:220px;top:${ZY - 12}px;font-size:20px">$0</div>`);
  inA([zl, zt], W1.t0 + 0.05, "fade");
  const hdr = put(W1.cam, `<div class="mono dim" style="position:absolute;left:300px;top:150px;font-size:22px;letter-spacing:.25em">NET LOSS · FIRST HALF 2026</div>`);
  inA(hdr, W1.t0 + 0.1, "fade");
  const barTop = put(W1.cam, `<div style="position:absolute;left:560px;top:${ZY}px;width:360px;height:0;background:#ff4a3d"></div>`);
  const barBot = put(W1.cam, `<div style="position:absolute;left:560px;top:${ZY + 8.7 * KH}px;width:360px;height:0;background:#ff4a3d"></div>`);
  to(barTop, W1.t0 + 0.2, { height: 8.7 * KH, duration: 0.5, ease: "power2.in" });
  to(barBot, W1.t0 + 0.7, { height: 72 * KH, duration: 0.9, ease: "expo.out" });
  const tot = put(W1.cam, `<div class="disp black red" style="position:absolute;left:960px;top:${ZY + 300}px;font-size:120px;line-height:1">−$80.7B</div>`);
  inA(tot, W1.t0 + 0.9, "left", { dur: 0.7 });
  cueSfx(W1.t0 + 0.2, "impact", 0.8);
  // split
  const tS = at("c3_1", "seventy-two") - 0.15;
  outA(tot, tS - 0.2, "fade", { dur: 0.3 });
  to(barBot, tS, { left: 600, background: ghostFill, duration: 0.8, ease: "expo.inOut" });
  to(barTop, tS, { left: 520, duration: 0.8, ease: "expo.inOut" });
  glitch(tS + 0.1, 0.3, 0.6);
  cueSfx(tS, "split");
  const l72 = put(W1.cam, `<div style="position:absolute;left:1010px;top:${ZY + 8.7 * KH + 150}px;width:760px">
      <div class="disp black" style="font-size:150px;line-height:1;color:${GH}">−$72B</div>
      <div class="mono" style="font-size:22px;letter-spacing:.15em;margin-top:16px;color:${GH};line-height:1.6">CHANGE IN FAIR VALUE OF<br>CONVERTIBLE NOTES</div></div>`);
  inA(l72, tS + 0.3, "left", { dur: 0.7 });
  const l87 = put(W1.cam, `<div style="position:absolute;left:1010px;top:${ZY - 6}px;width:700px">
      <div class="disp red" style="font-size:52px;line-height:1">≈ −$8.7B</div>
      <div class="mono dim" style="font-size:18px;letter-spacing:.15em;margin-top:6px">EVERYTHING ELSE</div></div>`);
  inA(l87, tS + 0.6, "left", { dur: 0.7 });
  const nc = cput(W1.cam, `<div class="stamp" style="font-size:52px;color:${GH};transform:rotate(-8deg);background:rgba(11,10,9,.7)">NON-CASH</div>`, 780, 700);
  inA(nc, at("c3_1", "not one dollar") - 0.1, "slam", { dur: 0.4 });
  hit(at("c3_1", "not one dollar"), { amp: 10, peak: 0.15, color: GH });
  cueSfx(at("c3_1", "not one dollar") - 0.1, "stamp");
  const z0 = put(W1.cam, `<div class="mono" style="position:absolute;left:1010px;top:${ZY + 8.7 * KH + 380}px;font-size:26px;letter-spacing:.15em"><span class="dim">CASH THAT LEFT THE COMPANY:</span> <span class="teal" style="font-weight:700">$0</span></div>`);
  inA(z0, at("c3_1", "left the company") - 0.1, "wipe", { dur: 0.6 });
  // phantom shimmer
  during(tS, W1.t1, (t) => {
    barBot.style.opacity = (0.75 + 0.2 * Math.sin(t * 5.3) * Math.sin(t * 2.1)).toFixed(3);
    barBot.style.transform = `translateY(${(Math.sin(t * 1.3) * 8).toFixed(1)}px)`;
  });
  source("REUTERS / WSJ, FROM THE DRAFT S-1 (OCT 20, 2026)", W1.t0, W1.t1);

  /* ---------- what is a convertible note ---------- */
  const CN = scene("phantom-note", S("c3_2") - 0.15, S("c3_3") - 0.1, { fin: 0.25, fout: 0.3 });
  const card = cput(CN.cam, `<div class="card" style="position:absolute;width:1180px;padding:56px 70px;border-color:rgba(143,179,255,.35)">
      <div class="mono" style="font-size:24px;letter-spacing:.35em;color:${GH}">DEFINITION</div>
      <div class="disp black" style="font-size:110px;line-height:1;margin-top:20px">Convertible note</div>
      <div style="display:flex;align-items:center;gap:40px;margin-top:56px">
        <div class="a" style="flex:1;text-align:center;padding:28px;border:2px solid var(--line);border-radius:12px"><div class="disp black teal" style="font-size:84px">$</div><div class="mono dim" style="font-size:20px;letter-spacing:.2em;margin-top:6px">INVESTOR MONEY · NOW</div></div>
        <div class="arr disp" style="font-size:90px;color:${GH}">→</div>
        <div class="b" style="flex:1;text-align:center;padding:28px;border:2px solid var(--line);border-radius:12px"><div class="disp black clay" style="font-size:84px">▦</div><div class="mono dim" style="font-size:20px;letter-spacing:.2em;margin-top:6px">COMPANY SHARES · LATER</div></div>
      </div></div>`, 960, 540);
  inA(card, CN.t0 + 0.05, "up", { dur: 0.8 });
  inA(card.querySelector(".a"), at("c3_2", "money investors") - 0.1, "pop", { dur: 0.5 });
  inA(card.querySelector(".arr"), at("c3_2", "later") - 0.3, "right", { dur: 0.5 });
  inA(card.querySelector(".b"), at("c3_2", "shares") - 0.15, "pop", { dur: 0.5 });
  cueSfx(at("c3_2", "money investors") - 0.1, "pop");
  cueSfx(at("c3_2", "shares") - 0.15, "pop");

  /* ---------- the $10 analogy ---------- */
  const AN = scene("phantom-analogy", S("c3_3") - 0.15, S("c3_7") - 0.15, { fin: 0.25, fout: 0.35 });
  const avatar = (lab, x, col) => cput(AN.cam, `<div style="text-align:center"><div style="width:170px;height:170px;border-radius:85px;border:3px solid ${col};display:flex;align-items:center;justify-content:center;margin:0 auto">
      <svg width="90" height="100" viewBox="0 0 90 100"><circle cx="45" cy="32" r="22" fill="${col}"/><path d="M5 100 C 5 62 85 62 85 100 Z" fill="${col}"/></svg></div>
      <div class="mono" style="font-size:24px;letter-spacing:.3em;margin-top:18px">${lab}</div></div>`, x, 330);
  const fr = avatar("FRIEND", 380, "#8e9aab");
  const you = avatar("YOU", 1540, "#d97757");
  inA([fr, you], AN.t0 + 0.05, "pop", { dur: 0.6, stagger: 0.15 });
  const bill = cput(AN.cam, `<div style="width:220px;height:110px;background:#2fae80;border-radius:10px;display:flex;align-items:center;justify-content:center;border:3px solid #a8f0d4">
      <div class="disp black" style="font-size:64px;color:#0b2a1f">$10</div></div>`, 380, 560);
  const tLend = at("c3_3", "lends you") - 0.1;
  inA(bill, tLend - 0.3, "pop", { dur: 0.4 });
  to(bill, tLend + 0.2, { x: 1540 - 380, duration: 1.2, ease: "power3.inOut" });
  cueSfx(tLend + 0.2, "whoosh_soft");
  const iou = cput(AN.cam, `<div class="card" style="position:absolute;width:520px;padding:30px 36px;border-color:rgba(143,179,255,.45);background:#11131a">
      <div class="mono" style="font-size:20px;letter-spacing:.3em;color:${GH}">IOU · CONVERTIBLE</div>
      <div class="disp" style="font-size:52px;margin-top:10px">10 shares</div>
      <div class="mono dim" style="font-size:20px;letter-spacing:.12em;margin-top:4px">AT TODAY’S PRICE: $1</div>
      <div style="height:2px;background:var(--line);margin:22px 0"></div>
      <div class="mono dim" style="font-size:20px;letter-spacing:.2em">WORTH</div>
      <div class="disp black num worth" style="font-size:92px;line-height:1.05">$10</div></div>`, 960, 650);
  inA(iou, at("c3_3", "instead") - 0.1, "up", { dur: 0.7 });
  cueSfx(at("c3_3", "instead") - 0.1, "pop");
  const worth = iou.querySelector(".worth");
  // share price ticker
  const tick = put(AN.cam, `<div style="position:absolute;left:1240px;top:560px;width:560px">
      <div class="mono dim" style="font-size:20px;letter-spacing:.25em">SHARE PRICE</div>
      <div class="disp black num sp" style="font-size:110px;line-height:1.05">$1</div>
      <div class="stamp gold x10" style="font-size:46px;position:relative;display:inline-block;transform:rotate(-6deg);margin-top:10px">×10</div></div>`);
  const sp = tick.querySelector(".sp"), x10 = tick.querySelector(".x10");
  inA(tick, S("c3_4") - 0.2, "left", { dur: 0.6 });
  gsap.set(x10, { opacity: 0, scale: 2 });
  const tTen = at("c3_4", "ten times") - 0.1;
  counter(sp, tTen, 1.0, 1, 10, (v) => `$${v.toFixed(v < 9.95 ? 1 : 0)}`, "expo.inOut");
  to(x10, tTen + 0.8, { opacity: 1, scale: 1, duration: 0.4, ease: "expo.out" });
  cueSfx(tTen, "riser_short");
  cueSfx(tTen + 0.8, "stamp");
  outA(bill, S("c3_4") - 0.3, "fade", { dur: 0.3 });
  // the IOU re-prices
  counter(worth, at("c3_5", "a hundred") - 0.2, 1.0, 10, 100, (v) => `$${Math.round(v)}`, "expo.inOut");
  to(worth, at("c3_5", "a hundred") - 0.2, { color: "#ff4a3d", duration: 0.6 });
  to(iou, at("c3_5", "a hundred") - 0.2, { scale: 1.12, duration: 0.6, ease: "back.out(2)" });
  cueSfx(at("c3_5", "a hundred") - 0.2, "counter");
  const owe = put(AN.cam, `<div class="serif ital" style="position:absolute;left:150px;top:600px;width:520px;font-size:64px;line-height:1.05">On paper, you owe <span class="red">$100</span>.</div>`);
  inA(owe, at("c3_5", "on paper") - 0.1, "up", { dur: 0.6 });
  // ledger
  const ledger = cput(AN.cam, `<div class="card" style="position:absolute;width:1100px;padding:40px 56px;background:#0f0e0c">
      <div class="mono dim" style="font-size:22px;letter-spacing:.3em">YOUR BOOKS</div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:26px;border-bottom:1.5px solid var(--line);padding-bottom:18px">
        <div class="mono" style="font-size:30px;letter-spacing:.1em">ACCOUNTING LOSS</div><div class="disp black red" style="font-size:96px">−$90</div></div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:18px">
        <div class="mono" style="font-size:30px;letter-spacing:.1em">CASH YOU SPENT</div><div class="disp black teal" style="font-size:96px">$0</div></div></div>`, 960, 560);
  const tLd = at("c3_6", "ninety") - 0.3;
  [fr, you, iou, tick, owe].forEach((e) => to(e, tLd - 0.2, { opacity: 0, y: -30, duration: 0.35 }));
  inA(ledger, tLd, "up", { dur: 0.7 });
  cueSfx(tLd, "whoosh_soft");
  const rows2 = ledger.querySelectorAll(":scope > div:not(.mono)");
  gsap.set(rows2[1], { opacity: 0 });
  to(rows2[1], at("c3_6", "spend") - 0.2, { opacity: 1, duration: 0.4 });
  cueSfx(at("c3_6", "spend") - 0.2, "pop");

  /* ---------- scale it up: valuation gauge + liability balloon ---------- */
  const SC = scene("phantom-scale", S("c3_7") - 0.15, S("c3_10") - 0.15, { fin: 0.3, fout: 0.35 });
  const gsv = svgLayer(SC.cam);
  const GX = 560, GY = 640, GR = 300;
  const arc = (a0, a1, r) => {
    const p = (a) => [GX + r * Math.cos(Math.PI * (1 - a)), GY - r * Math.sin(Math.PI * (1 - a))];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  sv("path", { d: arc(0, 1, GR), fill: "none", stroke: "rgba(243,239,230,.12)", "stroke-width": 40 }, gsv);
  const gfill = sv("path", { d: arc(0, 1, GR), fill: "none", stroke: "#d97757", "stroke-width": 40, pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1 }, gsv);
  const needle = sv("line", { x1: GX, y1: GY, x2: GX - GR + 40, y2: GY, stroke: "#f3efe6", "stroke-width": 8, "stroke-linecap": "round" }, gsv);
  sv("circle", { cx: GX, cy: GY, r: 18, fill: "#f3efe6" }, gsv);
  const vmax = 1000;
  for (const v of [0, 250, 500, 750, 1000]) {
    const a = v / vmax, x = GX + (GR + 60) * Math.cos(Math.PI * (1 - a)), y = GY - (GR + 60) * Math.sin(Math.PI * (1 - a));
    const tx = sv("text", { x, y: y + 8, "text-anchor": "middle", fill: "rgba(243,239,230,.4)", "font-size": 22 }, gsv);
    tx.textContent = `$${v}B`;
  }
  const gval = cput(SC.cam, `<div style="text-align:center"><div class="disp black num v" style="font-size:110px;line-height:1">$380B</div><div class="mono dim" style="font-size:20px;letter-spacing:.25em;margin-top:6px">ANTHROPIC VALUATION</div></div>`, GX, GY + 120);
  const gv = gval.querySelector(".v");
  const gs = { v: 0 };
  inA(gval, SC.t0 + 0.2, "up");
  to(gs, SC.t0 + 0.2, { v: 380, duration: 1.0, ease: "expo.out" });
  const tUp = at("c3_7", "nine hundred") - 0.3;
  to(gs, tUp, { v: 965, duration: 1.8, ease: "expo.inOut" });
  cueSfx(tUp, "riser_short");
  const dates = cput(SC.cam, `<div class="mono dim2" style="font-size:18px;letter-spacing:.2em">FEB 2026 → MAY 2026</div>`, GX, GY + 220);
  inA(dates, tUp, "fade");
  // the balloon
  const BX = 1400, BY = 600;
  const string = sv("path", { d: "", fill: "none", stroke: "rgba(243,239,230,.35)", "stroke-width": 3 }, gsv);
  const balloon = sv("ellipse", { cx: BX, cy: BY, rx: 90, ry: 110, fill: "url(#hatch)", stroke: GH, "stroke-width": 4 }, gsv);
  const blab = cput(SC.cam, `<div style="text-align:center;width:520px"><div class="mono" style="font-size:20px;letter-spacing:.2em;color:${GH};line-height:1.5">CONVERTIBLE NOTES<br>(FAIR VALUE = A LIABILITY)</div></div>`, BX, BY + 420);
  inA(blab, SC.t0 + 0.6, "fade");
  const lossC = put(SC.cam, `<div style="position:absolute;left:1120px;top:120px;width:600px;text-align:center">
      <div class="mono dim" style="font-size:20px;letter-spacing:.25em">CHARGE BOOKED AS A LOSS · H1 2026</div>
      <div class="disp black red num lv" style="font-size:96px;line-height:1.1">$0</div></div>`);
  const lv = lossC.querySelector(".lv");
  inA(lossC, at("c3_8", "every leap") - 0.2, "fade");
  counter(lv, at("c3_8", "more expensive") - 0.3, at("c3_8", "bigger") - at("c3_8", "more expensive") + 0.8, 0, 72, (v) => (v < 0.5 ? "$0" : `−$${Math.round(v)}B`), "power2.inOut");
  cueSfx(at("c3_8", "more expensive") - 0.3, "inflate", 1);
  during(SC.t0, SC.t1, (t) => {
    const a = gs.v / vmax;
    const ang = Math.PI * (1 - a);
    needle.setAttribute("x2", (GX + (GR - 40) * Math.cos(ang)).toFixed(1));
    needle.setAttribute("y2", (GY - (GR - 40) * Math.sin(ang)).toFixed(1));
    gfill.setAttribute("stroke-dashoffset", (1 - a).toFixed(4));
    gv.textContent = `$${Math.round(gs.v)}B`;
    const k = X.clamp((gs.v - 300) / 665);
    const wob = 1 + 0.015 * Math.sin(t * 3.1);
    const rx = (80 + 130 * k) * wob, ry = (100 + 150 * k) * wob;
    const cy = BY - 40 * k;
    balloon.setAttribute("rx", rx.toFixed(1));
    balloon.setAttribute("ry", ry.toFixed(1));
    balloon.setAttribute("cy", cy.toFixed(1));
    const b0 = cy + ry;
    string.setAttribute("d", `M ${BX} ${b0.toFixed(1)} C ${BX - 30} ${b0 + 80} ${BX + 30} ${b0 + 120} ${BX} ${BY + 380}`);
  });
  // the line
  const tLine = S("c3_9") - 0.1;
  const dim = put(SC.el, `<div style="position:absolute;inset:0;background:rgba(8,8,10,.82)"></div>`);
  inA(dim, tLine - 0.1, "fade", { dur: 0.5 });
  const big = cput(SC.el, `<div class="nowrap" style="text-align:center;padding:40px 70px">
      <div class="disp" style="font-size:96px;line-height:1.05">The stronger it gets,</div>
      <div class="disp" style="font-size:96px;line-height:1.05">the more it <span class="serif ital red lose" style="font-size:120px">“loses.”</span></div></div>`, 960, 540);
  inA(big, tLine, "blur", { dur: 0.8 });
  cueSfx(tLine, "impact", 0.8);
  const lose = big.querySelector(".lose");
  during(tLine + 1.2, SC.t1, (t) => { lose.style.opacity = (0.65 + 0.35 * (X.vnoise(t * 14) > 0.3 ? 1 : 0)).toFixed(2); });
  source("VALUATIONS: AXIOS (FEB 2026), ORRICK / REUTERS (MAY 2026) · CHARGE: REUTERS", SC.t0, SC.t1);

  /* ---------- the mirror: Amazon's books vs Anthropic's books ---------- */
  const MR = scene("phantom-mirror", S("c3_10") - 0.15, S("c3_13") - 0.15, { fin: 0.3, fout: 0.35 });
  const half = (x, title, col) => put(MR.cam, `<div style="position:absolute;left:${x}px;top:150px;width:800px;height:760px;border:2px solid var(--line);border-radius:18px;background:rgba(14,13,12,.85);padding:40px 50px;overflow:hidden">
      <div class="mono" style="font-size:24px;letter-spacing:.3em;color:${col}">${title}</div></div>`);
  const am = half(120, "AMAZON’S BOOKS", "#35d6a6");
  const an = half(1000, "ANTHROPIC’S BOOKS", "#ff4a3d");
  inA(am, MR.t0 + 0.05, "right", { dur: 0.7 });
  inA(an, at("c3_10", "other side") - 0.1, "left", { dur: 0.7 });
  // Amazon's holding of the notes
  const qb = (x, h, lab, val, col) => {
    const b = put(am, `<div style="position:absolute;left:${x}px;bottom:150px;width:190px;height:0;background:${col}"></div>`);
    const l = put(am, `<div class="mono dim" style="position:absolute;left:${x - 20}px;bottom:100px;width:230px;text-align:center;font-size:20px;letter-spacing:.15em">${lab}</div>`);
    const v = put(am, `<div class="disp black" style="position:absolute;left:${x - 40}px;bottom:${160 + h}px;width:270px;text-align:center;font-size:58px">${val}</div>`);
    return { b, l, v, h };
  };
  const mar = qb(70, 42.2 * 3.6, "MAR 31", "$42.2B", "#2c7d63");
  const jun = qb(320, 97.9 * 3.6, "JUN 30", "$97.9B", "#35d6a6");
  const sub = put(am, `<div class="mono dim" style="position:absolute;left:50px;top:100px;font-size:19px;letter-spacing:.15em">VALUE OF ITS ANTHROPIC CONVERTIBLE NOTES</div>`);
  inA(sub, MR.t0 + 0.5, "fade");
  const amBig = put(am, `<div class="disp black" style="position:absolute;left:50px;top:200px;font-size:120px;line-height:1;color:rgba(53,214,166,.12)">AMAZON</div>`);
  inA(amBig, MR.t0 + 0.4, "fade", { dur: 0.8 });
  to(amBig, at("c3_11", "forty-two") - 0.4, { opacity: 0, duration: 0.4 });
  const tMar = at("c3_11", "forty-two") - 0.2, tJun = at("c3_11", "ninety-seven") - 0.2;
  for (const [q, t] of [[mar, tMar], [jun, tJun]]) {
    to(q.b, t, { height: q.h, duration: 0.8, ease: "expo.out" });
    inA([q.l, q.v], t + 0.2, "up", { dur: 0.5 });
    cueSfx(t, "stair", 0.8);
  }
  const gain = put(am, `<div style="position:absolute;left:540px;top:150px">
      <div class="disp black teal" style="font-size:64px;line-height:1">+$55.7B</div>
      <div class="mono teal" style="font-size:22px;letter-spacing:.2em;margin-top:6px">GAIN · ONE QUARTER</div></div>`);
  const tG = at("c3_12", "fifty-five") - 0.2;
  inA(gain, tG, "slam", { dur: 0.5 });
  hit(tG + 0.05, { amp: 10, peak: 0.15, color: "#35d6a6" });
  cueSfx(tG, "impact");
  // Anthropic's side: the same notes, as a liability
  const anSub = put(an, `<div class="mono dim" style="position:absolute;left:50px;top:100px;font-size:19px;letter-spacing:.15em">THE SAME NOTES, AS A LIABILITY</div>`);
  inA(anSub, at("c3_10", "other side") + 0.3, "fade");
  const anBig = put(an, `<div class="disp black" style="position:absolute;left:50px;top:200px;font-size:110px;line-height:1;color:rgba(255,74,61,.12)">ANTHROPIC</div>`);
  inA(anBig, at("c3_10", "other side"), "fade", { dur: 0.8 });
  to(anBig, at("c3_12", "the other") - 0.3, { opacity: 0, duration: 0.3 });
  const anBody = put(an, `<div style="position:absolute;left:50px;top:240px;width:700px">
      <div class="disp black red" style="font-size:150px;line-height:1">LOSS</div>
      <div class="mono red" style="font-size:24px;letter-spacing:.15em;margin-top:18px;line-height:1.6">PART OF THE ~$72B<br>FAIR-VALUE CHARGE</div></div>`);
  inA(anBody, at("c3_12", "the other") - 0.1, "slam", { dur: 0.5 });
  hit(at("c3_12", "the other") - 0.05, { amp: 10, peak: 0.15, color: "#ff4a3d" });
  cueSfx(at("c3_12", "the other") - 0.1, "impact");
  const same = cput(MR.cam, `<div class="mono" style="padding:14px 24px;background:#0b0a09;border:2px solid ${GH};color:${GH};font-size:22px;letter-spacing:.2em">⇄ SAME NOTES</div>`, 960, 540);
  inA(same, at("c3_12", "same notes") - 0.1, "pop", { dur: 0.5 });
  cueSfx(at("c3_12", "same notes") - 0.1, "pop");
  source("AMAZON 10-Q FILINGS (Q1 & Q2 2026), AS REPORTED; REUTERS", MR.t0, MR.t1);

  /* ---------- 2025 callback ---------- */
  const CB = scene("phantom-2025", S("c3_13") - 0.15, S("c3_14") - 0.1, { fin: 0.3, fout: 0.3 });
  const cbH = put(CB.cam, `<div class="mono dim" style="position:absolute;left:300px;top:200px;font-size:22px;letter-spacing:.25em">FULL-YEAR 2025 · NET LOSS ≈ $42B</div>`);
  inA(cbH, CB.t0 + 0.1, "fade");
  const track = put(CB.cam, `<div style="position:absolute;left:300px;top:420px;width:1320px;height:150px;border:2px solid var(--line);border-radius:8px;overflow:hidden">
      <div class="g" style="position:absolute;left:0;top:0;bottom:0;width:0;background:${ghostFill}"></div>
      <div class="r" style="position:absolute;top:0;bottom:0;left:${(34 / 42) * 100}%;width:0;background:#ff4a3d"></div></div>`);
  inA(track, CB.t0 + 0.2, "fade");
  to(track.querySelector(".g"), at("c3_13", "thirty-four") - 0.2, { width: `${(34 / 42) * 100}%`, duration: 1.0, ease: "expo.out" });
  to(track.querySelector(".r"), at("c3_13", "thirty-four") + 0.4, { width: `${(8 / 42) * 100}%`, duration: 0.6, ease: "expo.out" });
  const cbl = put(CB.cam, `<div style="position:absolute;left:300px;top:610px;display:flex;gap:80px">
      <div><div class="disp black" style="font-size:90px;color:${GH}">≈ $34B</div><div class="mono" style="font-size:20px;letter-spacing:.15em;color:${GH}">THE SAME KIND OF NON-CASH CHARGE</div></div>
      <div><div class="disp black red" style="font-size:90px">&gt; $8B</div><div class="mono red" style="font-size:20px;letter-spacing:.15em">OPERATING LOSS</div></div></div>`);
  inA([...cbl.children], at("c3_13", "thirty-four") - 0.1, "up", { dur: 0.7, stagger: 0.35 });
  cueSfx(at("c3_13", "thirty-four") - 0.2, "stair");
  const notNew = put(CB.cam, `<div class="serif ital" style="position:absolute;left:300px;top:280px;font-size:84px">It isn’t new.</div>`);
  inA(notNew, S("c3_13") + 0.05, "blur", { dur: 0.7 });
  source("REUTERS / FORTUNE, FROM THE DRAFT S-1 (SEP 2026)", CB.t0, CB.t1);

  /* ---------- strip it out ---------- */
  const SO = scene("phantom-strip", S("c3_14") - 0.15, X.sec("ch4") - 0.1, { fin: 0.3, fout: 0.15 });
  const ZY2 = 200, K2 = 640 / 80.7;
  put(SO.cam, `<div style="position:absolute;left:400px;top:${ZY2}px;width:1120px;height:2px;background:var(--ink3)"></div>`);
  const sTop = put(SO.cam, `<div style="position:absolute;left:600px;top:${ZY2}px;width:360px;height:${8.7 * K2}px;background:#ff4a3d"></div>`);
  const sBot = put(SO.cam, `<div style="position:absolute;left:600px;top:${ZY2 + 8.7 * K2}px;width:360px;height:${72 * K2}px;background:${ghostFill}"></div>`);
  const sv1 = put(SO.cam, `<div style="position:absolute;left:1040px;top:${ZY2 + 20}px"><div class="mono dim" style="font-size:22px;letter-spacing:.25em">H1 2026 NET LOSS, EX-CHARGE</div>
      <div class="disp black red num v" style="font-size:150px;line-height:1.05">−$80.7B</div></div>`);
  inA([sTop, sBot, sv1], SO.t0, "fade", { dur: 0.3 });
  const tStrip = at("c3_14", "strip") + 0.2;
  to(sBot, tStrip, { opacity: 0, y: -120, filter: "blur(30px)", scaleX: 1.4, duration: 1.4, ease: "power2.in" });
  counter(sv1.querySelector(".v"), tStrip, 1.4, 80.7, 8.7, (v) => `−$${v.toFixed(1)}B`, "power2.inOut");
  cueSfx(tStrip, "dissolve", 1);
  // particles rising from the dissolving phantom
  const pc = put(SO.cam, `<canvas width="1920" height="1080" style="position:absolute;left:0;top:0"></canvas>`);
  const px = pc.getContext("2d");
  const pr = X.rng(77);
  const ps = Array.from({ length: 260 }, () => ({ x: 600 + pr() * 360, y: ZY2 + 8.7 * K2 + pr() * 72 * K2, v: 80 + pr() * 260, d: pr() * 0.6 }));
  during(tStrip, SO.t1, (t) => {
    px.clearRect(0, 0, 1920, 1080);
    const u = t - tStrip;
    for (const p of ps) {
      const k = u - p.d;
      if (k < 0 || k > 2.2) continue;
      px.fillStyle = `rgba(143,179,255,${(0.8 * (1 - k / 2.2)).toFixed(3)})`;
      px.fillRect(p.x + Math.sin(k * 3 + p.x) * 20, p.y - k * p.v, 3, 3);
    }
  });
  const under9 = put(SO.cam, `<div class="mono teal" style="position:absolute;left:1040px;top:${ZY2 + 230}px;font-size:26px;letter-spacing:.2em">UNDER $9 BILLION</div>`);
  inA(under9, tStrip + 1.2, "wipe", { dur: 0.6 });
  const fake = cput(SO.cam, `<div class="serif ital nowrap" style="font-size:150px;color:${GH}">So the loss is fake?</div>`, 960, 760);
  inA(fake, S("c3_15") - 0.1, "blur", { dur: 0.6 });
  cueSfx(S("c3_15") - 0.1, "whoosh_soft");
}
