// Chapter 5 — "Strong or fragile?": three lenses, bulls vs bears, why IPO.
export default function ch5(X) {
  const { S, E, at, put, cput, inA, outA, to, set, setHTML, tl, scene, hit, glitch, cueSfx, during, counter, source, chapterLabel, svgLayer, sv } = X;
  const t0 = X.sec("ch5");
  chapterLabel("05 — Strong or fragile?", t0, X.sec("outro") - 0.3);

  /* ---------- the question + three lenses ---------- */
  const Q = scene("verdict-q", t0 - 0.4, S("c5_1") + 0.4, { fin: 0.3, fout: 0.3 });
  const q = cput(Q.cam, `<div class="nowrap" style="text-align:center">
      <span class="disp black teal a" style="font-size:190px;display:inline-block">STRONG</span>
      <span class="serif ital dim b" style="font-size:150px;display:inline-block;margin:0 40px">or</span>
      <span class="disp black red c" style="font-size:190px;display:inline-block">FRAGILE?</span></div>`, 960, 540);
  inA(q.querySelector(".a"), t0 - 0.2, "right", { dur: 0.7 });
  inA(q.querySelector(".b"), at("c5_0", "strong") + 0.2, "fade", { dur: 0.5 });
  inA(q.querySelector(".c"), at("c5_0", "fragile") - 0.15, "left", { dur: 0.7 });
  cueSfx(t0 - 0.2, "whoosh");
  cueSfx(at("c5_0", "fragile") - 0.15, "impact", 0.8);
  to(Q.cam, S("c5_1") - 0.2, { scale: 0.6, opacity: 0, duration: 0.6, ease: "power3.in" });

  const LN = scene("verdict-lenses", S("c5_1") - 0.1, S("c5_5") - 0.15, { fin: 0.3, fout: 0.35 });
  const lensDefs = [
    { x: 400, n: "1", name: "INCOME STATEMENT", col: "#8fb3ff", id: "c5_2",
      body: `<div class="disp black red" style="font-size:96px;line-height:1">−$80.7B</div><div class="serif ital" style="font-size:40px;margin-top:14px;line-height:1.1">success looks<br>like failure</div>` },
    { x: 960, n: "2", name: "OPERATIONS", col: "#35d6a6", id: "c5_3",
      body: `<svg width="250" height="120" viewBox="0 0 250 120"><path d="M5 110 C 80 105 130 90 170 50 S 230 10 245 6" fill="none" stroke="#35d6a6" stroke-width="7" stroke-linecap="round"/></svg><div class="mono teal" style="font-size:19px;letter-spacing:.12em;margin-top:10px;line-height:1.5">REVENUE COMPOUNDING<br>ADJ. OP. INCOME &gt; 0</div>` },
    { x: 1520, n: "3", name: "COMMITMENTS", col: "#ff6a3d", id: "c5_4",
      body: `<div class="disp black" style="font-size:100px;line-height:1;color:#ff6a3d">$518B</div><div class="serif ital" style="font-size:36px;margin-top:14px;line-height:1.1">due whether customers<br>show up or not</div>` },
  ];
  const lenses = lensDefs.map((L, i) => {
    const e = cput(LN.cam, `<div style="width:480px;text-align:center">
        <div class="ring" style="width:440px;height:440px;margin:0 auto;border-radius:220px;border:4px solid ${L.col};background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.08),rgba(11,10,9,.9) 60%);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 60px ${L.col}33">
          <div class="body" style="opacity:0">${L.body}</div></div>
        <div class="mono" style="font-size:20px;letter-spacing:.25em;margin-top:30px;color:${L.col}">LENS ${L.n}</div>
        <div class="mono" style="font-size:26px;letter-spacing:.18em;margin-top:8px">${L.name}</div></div>`, L.x, 560);
    inA(e, at("c5_1", "lens") - 0.4 + i * 0.12, "up", { dur: 0.7 });
    cueSfx(at("c5_1", "lens") - 0.4 + i * 0.12, "node", 0.7);
    return e;
  });
  lensDefs.forEach((L, i) => {
    const t = S(L.id) - 0.1;
    lenses.forEach((e, j) => to(e, t, { opacity: j === i ? 1 : 0.32, scale: j === i ? 1.1 : 0.94, duration: 0.6, ease: "power3.inOut" }));
    to(lenses[i].querySelector(".body"), t + 0.3, { opacity: 1, duration: 0.5 });
    cueSfx(t, "lens", 1);
  });
  const allOn = S("c5_5") - 0.9;
  lenses.forEach((e) => to(e, allOn, { opacity: 1, scale: 1, duration: 0.5 }));

  /* ---------- bulls vs bears ---------- */
  const BB = scene("verdict-scale", S("c5_5") - 0.15, S("c5_7") - 0.15, { fin: 0.3, fout: 0.35 });
  const bsv = svgLayer(BB.cam);
  const PV = { x: 960, y: 300 }, ARM = 520;
  sv("polygon", { points: `${PV.x - 60},${PV.y + 380} ${PV.x + 60},${PV.y + 380} ${PV.x + 10},${PV.y} ${PV.x - 10},${PV.y}`, fill: "#2a2622" }, bsv);
  const beam = sv("g", {}, bsv);
  sv("rect", { x: PV.x - ARM, y: PV.y - 8, width: ARM * 2, height: 16, rx: 8, fill: "#b9b2a4" }, beam);
  sv("circle", { cx: PV.x, cy: PV.y, r: 20, fill: "#ebc36b" }, bsv);
  const pans = [-1, 1].map((sgn) => {
    const g = sv("g", {}, bsv);
    sv("line", { x1: 0, y1: 0, x2: -150, y2: 160, stroke: "rgba(243,239,230,.4)", "stroke-width": 2 }, g);
    sv("line", { x1: 0, y1: 0, x2: 150, y2: 160, stroke: "rgba(243,239,230,.4)", "stroke-width": 2 }, g);
    sv("path", { d: "M -190 160 L 190 160 Q 160 200 0 200 Q -160 200 -190 160 Z", fill: sgn < 0 ? "#1d6b55" : "#7a2a20" }, g);
    return g;
  });
  const bullsT = cput(BB.cam, `<div class="disp black teal" style="font-size:72px">BULLS</div>`, PV.x - ARM, 150);
  const bearsT = cput(BB.cam, `<div class="disp black red" style="font-size:72px">BEARS</div>`, PV.x + ARM, 150);
  inA(bullsT, BB.t0 + 0.1, "down");
  inA(bearsT, S("c5_6") - 0.1, "down");
  const chips = { "-1": [], "1": [] };
  const chip = (sgn, txt, t) => {
    const e = put(BB.cam, `<div class="mono nowrap" style="position:absolute;left:0;top:0;padding:10px 16px;font-size:19px;letter-spacing:.08em;background:${sgn < 0 ? "#0f2a22" : "#2c1210"};border:2px solid ${sgn < 0 ? "#35d6a6" : "#ff4a3d"}">${txt}</div>`);
    chips[sgn].push({ e, t });
    gsap.set(e, { opacity: 0 });
    to(e, t, { opacity: 1, duration: 0.3 });
    cueSfx(t, "chip", 0.8);
  };
  chip(-1, "≈15× YEAR-OVER-YEAR", at("c5_5", "growing") - 0.1);
  chip(-1, "$65B RUN-RATE", at("c5_5", "almost anything") - 0.1);
  chip(-1, "DEMAND > SUPPLY", at("c5_5", "demand") - 0.1);
  chip(-1, "ADJ. OPERATING PROFIT", at("c5_5", "supply") + 0.2);
  chip(1, "$518B FIXED BILL", at("c5_6", "fixed bill") - 0.1);
  chip(1, "2 CUSTOMERS ≈ 20–25%", at("c5_6", "concentrated") - 0.1);
  chip(1, "SUPPLIERS = RIVALS", at("c5_6", "rivals") - 0.2);
  chip(1, "“WORTH $144B”", at("c5_6", "one hundred and forty") - 0.1);
  // tilt: bulls first (left heavy), then bears catch up
  const st = { a: 0 };
  to(st, at("c5_5", "growing"), { a: -9, duration: 2.5, ease: "elastic.out(1,0.4)" });
  to(st, at("c5_6", "fixed bill"), { a: 7, duration: 3.5, ease: "elastic.out(1,0.35)" });
  to(st, at("c5_6", "one hundred and forty") + 1.0, { a: -1.5, duration: 2.5, ease: "elastic.out(1,0.3)" });
  during(BB.t0, BB.t1, (t) => {
    const a = st.a + Math.sin(t * 1.7) * 0.6;
    beam.setAttribute("transform", `rotate(${a.toFixed(2)} ${PV.x} ${PV.y})`);
    [-1, 1].forEach((sgn, k) => {
      const r = (a * Math.PI) / 180;
      const x = PV.x + sgn * ARM * Math.cos(r), y = PV.y + sgn * ARM * Math.sin(r);
      pans[k].setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      chips[sgn].forEach((c, i) => {
        c.e.style.transform = `translate(${(x - 150 + (i % 2) * 20).toFixed(1)}px, ${(y + 150 - 48 * (i + 1)).toFixed(1)}px)`;
      });
    });
  });
  // valuation range
  const vr = put(BB.cam, `<div style="position:absolute;left:260px;top:800px;width:1400px;height:200px"></div>`);
  const vsv = svgLayer(vr, 1400, 200);
  const lx = (v) => 40 + (Math.log10(v / 100) / Math.log10(2500 / 100)) * 1320;
  sv("line", { x1: lx(100), x2: lx(2500), y1: 80, y2: 80, stroke: "rgba(243,239,230,.25)", "stroke-width": 3 }, vsv);
  const grad = sv("line", { x1: lx(144), x2: lx(2000), y1: 80, y2: 80, stroke: "url(#vg)", "stroke-width": 10, "stroke-linecap": "round", pathLength: 1 }, vsv);
  const d2 = sv("defs", {}, vsv);
  const lg2 = sv("linearGradient", { id: "vg", x1: 0, y1: 0, x2: 1, y2: 0 }, d2);
  sv("stop", { offset: "0%", "stop-color": "#ff4a3d" }, lg2);
  sv("stop", { offset: "100%", "stop-color": "#35d6a6" }, lg2);
  const marks = [[144, "NEW CONSTRUCTS", "$144B"], [965, "SERIES H · MAY", "$965B"], [1500, "SOME INVESTORS", "~$1.5T"], [2000, "IPO TALK", "≤$2T"]];
  const mg = marks.map(([v, a, b], i) => {
    const g = sv("g", { opacity: 0 }, vsv);
    sv("circle", { cx: lx(v), cy: 80, r: 10, fill: "#f3efe6" }, g);
    const t1 = sv("text", { x: lx(v), y: 50, "text-anchor": "middle", fill: "#f3efe6", "font-size": 26, "font-weight": 700 }, g);
    t1.textContent = b;
    const t2 = sv("text", { x: lx(v), y: 125, "text-anchor": "middle", fill: "rgba(243,239,230,.5)", "font-size": 16 }, g);
    t2.textContent = a;
    return g;
  });
  const tv = at("c5_6", "one research") - 0.2;
  X.draw(grad, tv, 1.0);
  mg.forEach((g, i) => set(g, tv + 0.2 + i * 0.25, { attr: { opacity: 1 } }));
  const vlab = put(vr, `<div class="mono dim" style="position:absolute;left:40px;top:160px;font-size:17px;letter-spacing:.2em">WHAT IS IT WORTH? · VALUATION VIEWS, LOG SCALE</div>`);
  inA(vlab, tv, "fade");
  cueSfx(tv, "whoosh_soft");
  source("REUTERS; THE NEXT WEB (NEW CONSTRUCTS); PITCHBOOK VIA MORNINGSTAR", BB.t0, BB.t1);

  /* ---------- why go public ---------- */
  const IP = scene("verdict-ipo", S("c5_7") - 0.15, X.sec("outro") - 0.2, { fin: 0.3, fout: 0.4 });
  const ocean = cput(IP.cam, `<div style="width:300px;height:300px;border-radius:150px;background:radial-gradient(circle,#2e5f8a 0%,#173149 55%,rgba(23,49,73,0) 72%)"></div>`, 1180, 560);
  const pond = cput(IP.cam, `<div style="width:150px;height:150px;border-radius:75px;background:radial-gradient(circle,#d97757 0%,#7a3a24 60%,rgba(0,0,0,0) 72%)"></div>`, 420, 560);
  const pl = cput(IP.cam, `<div class="mono nowrap" style="font-size:20px;letter-spacing:.2em">PRIVATE ROUNDS</div>`, 420, 690);
  const ol = cput(IP.cam, `<div class="mono nowrap" style="font-size:26px;letter-spacing:.25em">PUBLIC MARKETS</div>`, 1180, 560);
  inA([pond, pl], IP.t0 + 0.1, "pop", { dur: 0.6 });
  const tPub = at("c5_7", "going public") - 0.2;
  inA(ocean, tPub, "pop", { dur: 0.6 });
  inA(ol, tPub + 0.2, "fade");
  to(ocean, tPub + 0.4, { scale: 3.2, duration: E("c5_7") - tPub + 1, ease: "power2.inOut" });
  cueSfx(tPub, "swell", 1);
  const ipoT = put(IP.cam, `<div style="position:absolute;left:160px;top:170px">
      <div class="mono clay" style="font-size:24px;letter-spacing:.3em">WHY GO PUBLIC?</div>
      <div class="serif ital nowrap" style="font-size:84px;line-height:1.05;margin-top:16px">the deepest pool of<br>capital on Earth</div></div>`);
  inA([...ipoT.children], at("c5_7", "deepest") - 0.6, "up", { dur: 0.8, stagger: 0.15 });
  const nov = put(IP.cam, `<div class="mono dim" style="position:absolute;left:160px;top:880px;font-size:20px;letter-spacing:.2em">LISTING TARGETED FOR NOVEMBER 2026, PER REUTERS</div>`);
  inA(nov, tPub + 0.5, "fade");
}
