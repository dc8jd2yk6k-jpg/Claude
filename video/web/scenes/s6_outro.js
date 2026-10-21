// Outro — the three numbers, relabelled; the closing line; end card.
export default function outro(X) {
  const { S, E, at, put, cput, inA, outA, to, set, setHTML, tl, scene, hit, cueSfx, during, svgLayer, sv, chapterLabel, source } = X;
  const t0 = X.sec("outro");
  chapterLabel("06 — The verdict", t0, S("c6_4") - 0.3);

  const N = scene("outro-numbers", t0 - 0.1, S("c6_4") - 0.15, { fin: 0.3, fout: 0.4 });
  const hdr = cput(N.cam, `<div class="mono dim nowrap" style="font-size:24px;letter-spacing:.35em">THE THREE NUMBERS, ONE MORE TIME</div>`, 960, 230);
  inA(hdr, t0 + 0.1, "fade");
  const defs = [
    { x: 330, val: "+$16.3B", cls: "teal", old: "REVENUE · H1 2026", neu: "REAL DEMAND", col: "#35d6a6", id: "c6_1", w: "real demand" },
    { x: 960, val: "−$80.7B", cls: "red", old: "NET LOSS · H1 2026", neu: "MOSTLY A SIDE EFFECT<br>OF SUCCESS", col: "#8fb3ff", id: "c6_2", w: "mostly" },
    { x: 1590, val: "$20.28B", cls: "", old: "CASH · DEC 31, 2025", neu: "A SNAPSHOT,<br>NOT A RUNWAY", col: "#ebc36b", id: "c6_3", w: "a snapshot" },
  ];
  defs.forEach((d, i) => {
    const e = cput(N.cam, `<div style="text-align:center;width:600px">
        <div class="disp black ${d.cls} num" style="font-size:120px;line-height:1.1">${d.val}</div>
        <div class="mono lab dim" style="font-size:22px;letter-spacing:.2em;margin-top:18px;line-height:1.5;min-height:70px">${d.old}</div></div>`, d.x, 520);
    inA(e, t0 + 0.4 + i * 0.15, "up", { dur: 0.7 });
    const lab = e.querySelector(".lab");
    const t = at(d.id, d.w) - 0.25;
    to(lab, t - 0.2, { opacity: 0, duration: 0.2 });
    setHTML(lab, t, d.neu);
    to(lab, t, { opacity: 1, color: d.col, duration: 0.4 });
    to(e, t, { scale: 1.08, duration: 0.5, ease: "back.out(2)" });
    to(e, t + 0.6, { scale: 1, duration: 0.6 });
    cueSfx(t, "lens", 0.8);
    if (i === 1) {
      const bar = put(e, `<div style="margin:22px auto 0;width:420px;height:22px;display:flex;border-radius:4px;overflow:hidden">
          <div style="width:${(72 / 80.7) * 100}%;background:repeating-linear-gradient(45deg,rgba(143,179,255,.6) 0 8px,rgba(143,179,255,.15) 8px 16px)"></div><div style="flex-grow:1;background:#ff4a3d"></div></div>`);
      inA(bar, t + 0.3, "wipe", { dur: 0.6 });
    }
  });
  cueSfx(t0, "whoosh_soft");

  /* ---------- the closing line ---------- */
  const C = scene("outro-close", S("c6_4") - 0.15, E("c6_5") + 1.4, { fin: 0.3, fout: 0.5 });
  const l1 = cput(C.cam, `<div class="disp nowrap" style="font-size:96px">Anthropic’s strength is <span class="teal">real.</span></div>`, 960, 300);
  const l2 = cput(C.cam, `<div class="disp nowrap" style="font-size:96px">So is <span style="color:#ff6a3d">the bill.</span></div>`, 960, 420);
  inA(l1, S("c6_4") - 0.05, "up", { dur: 0.7 });
  inA(l2, at("c6_4", "so is") - 0.1, "up", { dur: 0.7 });
  cueSfx(at("c6_4", "so is") - 0.1, "impact", 0.6);
  const csv = svgLayer(C.cam);
  const p1 = sv("path", { d: "M 260 1000 C 700 980 1000 920 1300 850 S 1600 770 1680 730", fill: "none", stroke: "#d97757", "stroke-width": 6, "stroke-linecap": "round", pathLength: 1 }, csv);
  const p2 = sv("path", { d: "M 260 980 C 700 970 1000 940 1300 840 S 1600 700 1680 680", fill: "none", stroke: "#ff6a3d", "stroke-width": 6, "stroke-dasharray": "1 1", "stroke-linecap": "round", pathLength: 1, opacity: 0.85 }, csv);
  const tq = S("c6_5") - 0.1;
  X.draw(p1, tq, 2.4, "power2.inOut");
  X.draw(p2, tq + 0.15, 2.4, "power2.inOut");
  const lab1 = sv("text", { x: 1700, y: 740, fill: "#d97757", "font-size": 22, opacity: 0 }, csv);
  lab1.textContent = "STRENGTH";
  const lab2 = sv("text", { x: 1700, y: 680, fill: "#ff6a3d", "font-size": 22, opacity: 0 }, csv);
  lab2.textContent = "THE BILL";
  set([lab1, lab2], tq + 2.4, { attr: { opacity: 1 } });
  const which = cput(C.cam, `<div class="serif ital nowrap" style="font-size:88px">Which one grows faster?</div>`, 960, 570);
  inA(which, at("c6_5", "which one") - 0.1, "blur", { dur: 0.8 });
  cueSfx(tq, "riser_short", 0.8);

  /* ---------- end card ---------- */
  const tE = E("c6_5") + 1.4;
  to("#hud", tE - 0.6, { opacity: 0, duration: 0.6 });
  const EC = scene("endcard", tE, X.TL.duration + 0.1, { fin: 0.6, fout: 0 });
  const ttl = cput(EC.cam, `<div class="nowrap" style="text-align:center">
      <div class="mono dim" style="font-size:22px;letter-spacing:.8em;padding-left:.8em">THE</div>
      <div class="disp black" style="font-size:120px;line-height:1"><span class="clay">$80</span> BILLION <span class="serif ital" style="font-weight:400">Paradox</span></div></div>`, 960, 300);
  inA(ttl, tE + 0.2, "up", { dur: 0.9 });
  hit(tE + 0.25, { amp: 6, peak: 0.12, color: "#d97757" });
  cueSfx(tE + 0.2, "braam_soft", 1);
  const src = cput(EC.cam, `<div style="width:1400px;text-align:center" class="mono">
      <div style="font-size:17px;letter-spacing:.14em;line-height:2;color:var(--ink2)">
      SOURCES · REUTERS, THE WALL STREET JOURNAL, FORTUNE — REPORTING ON ANTHROPIC’S DRAFT S-1 (SEP 29 – OCT 20, 2026)<br>
      AMAZON 10-Q FILINGS (Q1 &amp; Q2 2026) · CNBC / BLOOMBERG · AXIOS · ORRICK · VENTUREBEAT · SAASTR · MENLO VENTURES<br>
      GOOGLE / BROADCOM, AWS, MICROSOFT / NVIDIA ANNOUNCEMENTS · THE NEXT WEB (NEW CONSTRUCTS) · PITCHBOOK · INC.</div>
      <div style="height:2px;background:var(--line);margin:34px auto;width:600px"></div>
      <div style="font-size:16px;letter-spacing:.12em;line-height:2;color:var(--ink3)">
      FIGURES ARE FROM PRESS REPORTS OF A DRAFT, UNAUDITED FILING AND MAY CHANGE. RUN-RATES ARE COMPANY-REPORTED.<br>
      INDEPENDENT EXPLAINER — NOT AFFILIATED WITH OR ENDORSED BY ANTHROPIC. NOT INVESTMENT ADVICE.<br>
      NARRATION: SYNTHETIC VOICE (KOKORO-82M) · MUSIC &amp; SOUND DESIGN: ORIGINAL, COMPOSED IN CODE · MOTION: GSAP + CHROMIUM</div></div>`, 960, 700);
  inA(src, tE + 0.8, "fade", { dur: 1.0 });
}
