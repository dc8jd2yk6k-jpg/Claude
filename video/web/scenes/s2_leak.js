// Chapter 2 — "The Leak": the draft S-1, three numbers, the scary (wrong) math.
export default function ch2(X) {
  const { S, E, at, put, cput, inA, outA, to, set, setHTML, tl, scene, hit, glitch, flash, shake, cueSfx, during, counter, source, chapterLabel, typeOn, typeSeq, svgLayer, sv } = X;
  const t0 = X.sec("ch2");
  chapterLabel("02 — The leak", t0, X.sec("ch3") - 0.5);
  to("#hud", t0 - 0.4, { opacity: 1, duration: 0.6 });

  /* ---------- the document ---------- */
  const tD0 = t0 - 2.4, tD1 = S("c2_1") + 0.2;
  const D = scene("leak-doc", tD0, tD1, { fin: 0.6, fout: 0.3 });
  const doc = cput(D.cam, `<div style="width:820px;height:1060px;background:#e9e4d8;color:#1b1916;border-radius:4px;padding:70px 76px;box-shadow:0 60px 140px rgba(0,0,0,.7);position:absolute;overflow:hidden">
      <div style="font-family:'JetBrains Mono';font-size:15px;letter-spacing:.2em;color:#6b655b">UNITED STATES · SECURITIES AND EXCHANGE COMMISSION</div>
      <div style="font-family:'Instrument Serif';font-size:88px;line-height:1;margin-top:34px">FORM S-1</div>
      <div style="font-family:'JetBrains Mono';font-size:17px;letter-spacing:.16em;margin-top:14px">DRAFT REGISTRATION STATEMENT · CONFIDENTIAL</div>
      <div style="height:2px;background:#1b1916;margin:32px 0 30px"></div>
      <div class="rows"></div></div>`, 960, 600);
  const rows = doc.querySelector(".rows");
  const rr = X.rng(3);
  const hl = [];
  for (let i = 0; i < 17; i++) {
    const row = put(rows, `<div style="display:flex;gap:10px;margin-bottom:17px;align-items:center"></div>`);
    if (i === 4 || i === 8 || i === 12) {
      const label = ["Total revenue", "Net loss", "Cash, cash equivalents and short-term investments"][(i - 4) / 4];
      put(row, `<div style="font-family:'Inter Display';font-weight:600;font-size:21px">${label}</div>`);
      put(row, `<div style="flex-grow:1;border-bottom:2px dotted #8a8478;height:14px"></div>`);
      const v = put(row, `<div style="font-family:'JetBrains Mono';font-weight:700;font-size:21px;position:relative">${["$ 16,3••", "$ (80,7••)", "$ 20,28•"][(i - 4) / 4]}<div class="hl" style="position:absolute;left:-10px;right:-10px;top:-4px;bottom:-4px;background:rgba(255,74,61,.35);mix-blend-mode:multiply;transform-origin:0 50%"></div></div>`);
      hl.push(v.querySelector(".hl"));
    } else {
      let w = 0;
      while (w < 640) {
        const ww = 30 + rr() * 120;
        const red = rr() < 0.12;
        put(row, `<div style="width:${ww}px;height:12px;background:${red ? "#1b1916" : "rgba(27,25,22,.22)"};border-radius:2px"></div>`);
        w += ww + 10;
      }
    }
  }
  const ill = put(D.cam, `<div class="mono dim2" style="position:absolute;left:1420px;top:880px;font-size:15px;letter-spacing:.15em">ILLUSTRATION · NOT THE ACTUAL FILING</div>`);
  inA(ill, tD0 + 1, "fade");
  const asrep = put(D.cam, `<div style="position:absolute;left:120px;top:420px;width:420px">
      <div class="mono red" style="font-size:22px;letter-spacing:.3em">● LEAKED / REPORTED</div>
      <div class="serif ital" style="font-size:66px;line-height:1.05;margin-top:22px">The draft IPO filing</div>
      <div class="mono dim" style="font-size:18px;letter-spacing:.14em;margin-top:24px;line-height:1.7">REUTERS · WSJ · FORTUNE<br>SEP 29 – OCT 20, 2026</div></div>`);
  gsap.set(doc, { y: 700, rotation: 4, scale: 0.88 });
  to(doc, tD0 + 0.3, { y: 0, rotation: -1.5, duration: 2.0, ease: "expo.out" });
  cueSfx(tD0 + 0.3, "paper");
  inA([...asrep.children], S("c2_0") + 0.1, "up", { dur: 0.8, stagger: 0.15 });
  // scanning beam
  const beam = put(doc, `<div style="position:absolute;left:0;right:0;top:0;height:120px;background:linear-gradient(180deg,rgba(255,74,61,0),rgba(255,74,61,.25),rgba(255,74,61,0))"></div>`);
  gsap.set(beam, { y: -150 });
  to(beam, S("c2_0") + 0.6, { y: 1100, duration: 2.4, ease: "power1.inOut" });
  cueSfx(S("c2_0") + 0.6, "scan");
  hl.forEach((h, i) => {
    gsap.set(h, { scaleX: 0 });
    const t = at("c2_0", "three numbers") + i * 0.35;
    to(h, t, { scaleX: 1, duration: 0.35, ease: "power2.out" });
    cueSfx(t, "marker", 0.7);
  });
  to(D.cam, S("c2_0"), { scale: 1.12, x: 140, duration: E("c2_0") - S("c2_0") + 1.2, ease: "power1.inOut" });

  /* ---------- the three numbers ---------- */
  const tN0 = S("c2_1") - 0.2, tN1 = S("c2_5") - 0.2;
  const N = scene("leak-numbers", tN0, S("c2_7") + 0.1, { fin: 0.2, fout: 0 });
  const cols = [
    { x: 330, lab: "REVENUE · H1 2026", val: "+$16.3B", cls: "teal", sub: "VS $1.1B IN H1 2025", id: ["c2_1", "sixteen"] },
    { x: 960, lab: "NET LOSS · H1 2026", val: "−$80.7B", cls: "red", sub: "VS ~$13B IN H1 2025", id: ["c2_2", "eighty"] },
    { x: 1590, lab: "CASH + ST INVESTMENTS", val: "$20.28B", cls: "", sub: "AS OF DEC 31, 2025", id: ["c2_3", "twenty point"] },
  ].map((c, i) => {
    const e = cput(N.cam, `<div style="text-align:center;width:600px">
        <div class="mono dim" style="font-size:22px;letter-spacing:.25em">${c.lab}</div>
        <div class="disp black ${c.cls} num" style="font-size:${i === 1 ? 150 : 118}px;line-height:1.1;margin-top:16px;${i === 1 ? "text-shadow:0 0 60px rgba(255,74,61,.45)" : ""}">${c.val}</div>
        <div class="mono dim2" style="font-size:18px;letter-spacing:.16em;margin-top:12px">${c.sub}</div></div>`, c.x, 540);
    const t = at(c.id[0], c.id[1]) - 0.1;
    inA(e, i === 0 ? tN0 + 0.2 : t - 0.3, "fade", { dur: 0.3 });
    gsap.set(e.children[1], { opacity: 0, scale: 2.4 });
    to(e.children[1], t, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" });
    if (i === 1) {
      hit(t + 0.05, { amp: 30, peak: 0.6, color: "#ff4a3d" });
      glitch(t, 0.45, 1);
      cueSfx(t, "impact_big", 1.2);
    } else {
      hit(t + 0.05, { amp: 12, peak: 0.18 });
      cueSfx(t, "impact", 0.9);
    }
    return e;
  });
  // flash of red tint on the loss
  const tint = put(N.el, `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(255,74,61,.25),rgba(255,74,61,0) 60%)"></div>`);
  gsap.set(tint, { opacity: 0 });
  to(tint, at("c2_2", "eighty"), { opacity: 1, duration: 0.15 });
  to(tint, at("c2_2", "eighty") + 0.4, { opacity: 0.35, duration: 1.5 });
  source("REUTERS, WSJ (OCT 20, 2026); FORTUNE (SEP 29, 2026) — FROM THE DRAFT S-1", tN0, S("c2_7"));
  // shrink to a header row for the math
  const tUp = S("c2_4") - 0.1;
  cols.forEach((c, i) => to(c, tUp, { y: -360, scale: 0.55, duration: 0.9, ease: "expo.inOut" }));
  to(tint, tUp, { opacity: 0, duration: 0.6 });
  cueSfx(tUp, "whoosh_soft");

  /* ---------- the scary math ---------- */
  const M = scene("leak-math", S("c2_4") - 0.1, S("c2_7") - 0.1, { fin: 0.2, fout: 0.3 });
  to(N.el, S("c2_7") - 0.4, { opacity: 0, duration: 0.3 });
  const scary = cput(M.cam, `<div class="serif ital nowrap red" style="font-size:96px">Now do the scary math.</div>`, 960, 460);
  inA(scary, S("c2_4"), "blur", { dur: 0.6 });
  outA(scary, S("c2_5") - 0.2, "up", { dur: 0.4 });
  const eq1 = cput(M.cam, `<div class="mono nowrap" style="font-size:58px;letter-spacing:.02em;text-transform:none"><span class="a">$80.7B ÷ 6 months = </span><span class="b red" style="font-weight:700">$13.45B / month</span></div>`, 960, 400);
  typeSeq([eq1.querySelector(".a"), eq1.querySelector(".b")], S("c2_5") + 0.1, at("c2_5", "is about") - S("c2_5") + 0.3);
  cueSfx(S("c2_5") + 0.1, "typing", 0.7);
  const eq2 = cput(M.cam, `<div class="mono nowrap" style="font-size:58px;letter-spacing:.02em;text-transform:none"><span class="a">$20.28B ÷ $13.45B ≈ </span><span class="b red" style="font-weight:700">45 days</span></div>`, 960, 520);
  typeSeq([eq2.querySelector(".a"), eq2.querySelector(".b")], S("c2_6") + 0.05, at("c2_6", "forty-five") - S("c2_6") + 0.3);
  cueSfx(S("c2_6") + 0.05, "typing", 0.7);
  // cash fuse
  const fuse = put(M.cam, `<div style="position:absolute;left:360px;top:680px;width:1200px">
      <div style="display:flex;justify-content:space-between" class="mono"><div class="dim" style="font-size:20px;letter-spacing:.2em">CASH REMAINING</div><div class="red days" style="font-size:24px;font-weight:700">45 DAYS</div></div>
      <div style="margin-top:14px;height:44px;border:2px solid var(--ink3);border-radius:6px;padding:5px"><div class="f" style="height:100%;width:100%;background:linear-gradient(90deg,#ff4a3d,#ff8a5c);border-radius:3px"></div></div></div>`);
  inA(fuse, at("c2_6", "twenty"), "up", { dur: 0.6 });
  const fill = fuse.querySelector(".f"), days = fuse.querySelector(".days");
  const tf = at("c2_6", "runs out");
  to(fill, tf, { width: "0%", duration: E("c2_6") - tf + 0.6, ease: "power1.in" });
  counter(days, tf, E("c2_6") - tf + 0.6, 45, 0, (v) => `${Math.ceil(v)} DAYS`, "power1.in");
  cueSfx(tf, "clock_fast", 1);

  /* ---------- Valentine's Day ---------- */
  const V = scene("leak-calendar", S("c2_7") - 0.1, S("c2_8") - 0.15, { fin: 0.2, fout: 0.25 });
  const cal = cput(V.cam, `<div style="width:520px;height:600px;background:#efe9dc;border-radius:16px;overflow:hidden;box-shadow:0 50px 120px rgba(0,0,0,.6);color:#1b1916">
      <div class="mono mon" style="height:110px;background:#ff4a3d;color:#fff;display:flex;align-items:center;justify-content:center;font-size:34px;letter-spacing:.3em;font-weight:700">JANUARY</div>
      <div class="disp black day" style="font-size:300px;line-height:380px;text-align:center">1</div>
      <div class="mono dim2 yr" style="text-align:center;font-size:24px;color:#6b655b;letter-spacing:.3em">2026</div></div>`, 700, 540);
  inA(cal, V.t0, "up", { dur: 0.6 });
  const dayEl = cal.querySelector(".day"), monEl = cal.querySelector(".mon");
  const dd = { d: 0 };
  const tFlip0 = S("c2_7") + 0.3, tFlip1 = at("c2_7", "valentine") - 0.1;
  to(dd, tFlip0, { d: 44, duration: tFlip1 - tFlip0, ease: "power2.in" });
  during(V.t0, V.t1, () => {
    const n = Math.round(dd.d);
    const jan = n < 31;
    dayEl.textContent = String(jan ? n + 1 : n - 30);
    monEl.textContent = jan ? "JANUARY" : "FEBRUARY";
  });
  cueSfx(tFlip0, "flip_run", 1);
  const stamp = cput(V.cam, `<div class="stamp red" style="font-size:64px;transform:rotate(-10deg);background:rgba(11,10,9,.6)">OUT OF CASH?</div>`, 760, 560);
  inA(stamp, tFlip1 + 0.15, "slam", { dur: 0.4 });
  hit(tFlip1 + 0.2, { amp: 16, peak: 0.25, color: "#ff4a3d" });
  cueSfx(tFlip1 + 0.15, "stamp", 1.2);
  const vtxt = put(V.cam, `<div style="position:absolute;left:1100px;top:370px;width:700px">
      <div class="mono dim" style="font-size:22px;letter-spacing:.25em">BY THAT LOGIC…</div>
      <div class="serif ital" style="font-size:92px;line-height:1.04;margin-top:20px">dead by<br><span class="red">Valentine’s Day.</span></div></div>`);
  inA([...vtxt.children], S("c2_7") + 0.2, "up", { dur: 0.8, stagger: 0.2 });

  /* ---------- rocket or bomb ---------- */
  const R = scene("leak-rocket-bomb", S("c2_8") - 0.15, X.sec("ch3") - 2.1, { fin: 0.15, fout: 0.1 });
  const rsv = svgLayer(R.cam);
  const div = sv("line", { x1: 960, x2: 960, y1: 160, y2: 920, stroke: "rgba(243,239,230,.2)", "stroke-width": 2 }, rsv);
  inA(div, R.t0, "fade");
  // rocket: a rising trajectory with a head
  const path = sv("path", { d: "M 180 860 C 420 840 560 700 640 480 S 760 210 820 170", fill: "none", stroke: "#35d6a6", "stroke-width": 8, "stroke-linecap": "round", pathLength: 1 }, rsv);
  X.draw(path, R.t0 + 0.1, at("c2_8", "rocket") - R.t0 + 0.4, "power2.in");
  const head = sv("polygon", { points: "0,-22 16,18 -16,18", fill: "#35d6a6", opacity: 0 }, rsv);
  set(head, at("c2_8", "rocket") + 0.65, { attr: { opacity: 1, transform: "translate(820 170) rotate(40)" } });
  const rL = cput(R.cam, `<div class="disp black teal" style="font-size:120px">ROCKET</div>`, 520, 960);
  inA(rL, R.t0 + 0.2, "up", { dur: 0.6 });
  cueSfx(at("c2_8", "rocket") - 0.2, "whoosh_up");
  // bomb: body + fuse + sparks
  const bomb = sv("g", { transform: "translate(1440 520)", opacity: 0 }, rsv);
  sv("circle", { cx: 0, cy: 40, r: 190, fill: "#1d1a17", stroke: "#ff4a3d", "stroke-width": 6 }, bomb);
  sv("rect", { x: -50, y: -175, width: 100, height: 40, fill: "#2a2622", stroke: "#ff4a3d", "stroke-width": 5 }, bomb);
  sv("path", { d: "M 0 -175 C 20 -260 120 -250 130 -320", fill: "none", stroke: "#ebc36b", "stroke-width": 7 }, bomb);
  const spark = put(R.cam, `<canvas width="400" height="400" style="position:absolute;left:1370px;top:0px"></canvas>`);
  const spx = spark.getContext("2d");
  const tb = at("c2_8", "bomb") - 0.15;
  set(bomb, tb, { attr: { opacity: 1 } });
  X.tl.fromTo(bomb, { scale: 0.6, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: "back.out(2)", immediateRender: false }, tb);
  const bL = cput(R.cam, `<div class="disp black red" style="font-size:120px">BOMB</div>`, 1440, 960);
  inA(bL, tb, "up", { dur: 0.6 });
  cueSfx(tb, "fuse", 1);
  during(tb, R.t1, (t) => {
    spx.clearRect(0, 0, 400, 400);
    const r = X.rng(Math.floor(t * 30));
    for (let i = 0; i < 26; i++) {
      const a = r() * Math.PI * 2, d = r() * 60;
      spx.fillStyle = `rgba(255,${180 + Math.floor(r() * 70)},90,${(0.4 + r() * 0.6).toFixed(2)})`;
      spx.fillRect(200 + Math.cos(a) * d, 200 + Math.sin(a) * d, 3, 3);
    }
  });
  const qm = cput(R.cam, `<div class="disp black" style="font-size:200px;background:#0b0a09;padding:0 30px">?</div>`, 960, 520);
  inA(qm, at("c2_8", "bomb") + 0.5, "pop", { dur: 0.5 });
  to(R.cam, R.t0, { scale: 1.06, duration: R.t1 - R.t0, ease: "none" });
  glitch(X.sec("ch3") - 2.5, 0.6, 1);
  cueSfx(X.sec("ch3") - 2.5, "glitch", 1);
}
