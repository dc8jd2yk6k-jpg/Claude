// Cold open: the 80x quote, the -$80.7B flash, the rewind, the title.
export default function open(X) {
  const { S, E, at, put, cput, inA, outA, to, tl, scene, hit, glitch, shake, flash, cueSfx, typeSeq, during, voEnv, words, chars } = X;

  /* ---------- A: signal line, dateline, live waveform, the quote ---------- */
  const tA1 = S("o3") + 0.5;
  const A = scene("open-quote", 0, tA1, { fin: 0, fout: 0.45 });

  const sig = cput(A.cam, `<div style="width:1400px;height:2px;background:linear-gradient(90deg,transparent,var(--clay),transparent)"></div>`, 960, 540);
  gsap.set(sig, { scaleX: 0, opacity: 0.9 });
  to(sig, 0.6, { scaleX: 1, duration: 2.2, ease: "expo.inOut" });
  to(sig, S("o2") - 0.3, { opacity: 0, duration: 0.6 });

  const date = cput(A.cam, `<div class="mono dim" style="font-size:26px;letter-spacing:.32em">MAY 6, 2026 · SAN FRANCISCO</div>`, 960, 300);
  inA(date, S("o1") + 0.2, "wipe", { dur: 1.2 });
  cueSfx(S("o1") + 0.2, "whoosh_soft");
  const who = cput(A.cam, `<div class="mono" style="font-size:18px;letter-spacing:.3em;color:var(--clay)">● LIVE — ANTHROPIC CEO DARIO AMODEI</div>`, 960, 350);
  inA(who, S("o1") + 1.2, "fade", { dur: 0.6 });

  // audio-reactive waveform drawn from the actual narration envelope
  const wave = put(A.cam, `<canvas width="1200" height="240" style="position:absolute;left:360px;top:420px"></canvas>`);
  const wctx = wave.getContext("2d");
  gsap.set(wave, { opacity: 0 });
  to(wave, S("o1"), { opacity: 1, duration: 0.8 });
  to(wave, S("o2") + 0.2, { opacity: 0.25, y: 200, duration: 1.2, ease: "expo.inOut" });
  during(S("o1") - 0.1, tA1, (t) => {
    wctx.clearRect(0, 0, 1200, 240);
    const n = 96;
    for (let i = 0; i < n; i++) {
      const x = 12 + i * 12.25;
      const shape = Math.pow(Math.sin(Math.PI * (i + 0.5) / n), 1.4);
      const e = voEnv(t - Math.abs(i - n / 2) * 0.004);
      const jitter = 0.55 + 0.45 * Math.sin(i * 1.7 + t * 23) * Math.cos(i * 0.9 - t * 17);
      const hgt = 4 + 230 * e * shape * jitter;
      wctx.fillStyle = i % 8 === 0 ? "rgba(217,119,87,0.95)" : "rgba(243,239,230,0.75)";
      wctx.fillRect(x, 120 - hgt / 2, 5, hgt);
    }
  });

  // the quote
  const q = cput(A.cam, `<div class="serif ital" style="width:1500px;text-align:center;font-size:76px;line-height:1.12">
      <span class="q1">“We tried to plan very well for a world of </span><span class="q2 clay">10x</span><span class="q3"> growth per year.</span>
    </div>`, 960, 470);
  typeSeq([q.querySelector(".q1"), q.querySelector(".q2"), q.querySelector(".q3")], S("o2") + 0.05, at("o2", "and yet") - S("o2") - 0.35);
  cueSfx(S("o2") + 0.05, "typing", 0.8);

  const q4 = cput(A.cam, `<div class="serif ital nowrap" style="font-size:96px"><span class="ay">And yet we saw </span><span class="big clay" style="display:inline-block;font-size:150px;font-style:normal;font-family:'Inter Display';font-weight:900;letter-spacing:-.04em">80x.”</span></div>`, 960, 700);
  const ay = q4.querySelector(".ay"), big = q4.querySelector(".big");
  inA(ay, at("o2", "and yet"), "up", { dur: 0.7 });
  const t80 = at("o2", "eighty");
  inA(big, t80 - 0.05, "slam", { dur: 0.6 });
  hit(t80, { amp: 12, peak: 0.25, color: "#d97757" });
  cueSfx(t80 - 0.05, "impact");
  gsap.set(big, { textShadow: "0 0 0px rgba(217,119,87,0)" });
  to(big, t80 + 0.2, { textShadow: "0 0 60px rgba(217,119,87,0.65)", duration: 1.2 });

  const attr = cput(A.cam, `<div class="mono dim2" style="font-size:20px;letter-spacing:.25em">— DARIO AMODEI · CODE WITH CLAUDE · MAY 2026</div>`, 960, 870);
  inA(attr, t80 + 0.6, "fade", { dur: 0.8 });
  to(A.cam, S("o2"), { scale: 1.06, duration: E("o2") - S("o2") + 2, ease: "none" });

  /* ---------- B: five months later (month flipper) ---------- */
  const tB0 = S("o3") + 0.2, tB1 = at("o4", "eighty") - 0.15;
  const B = scene("open-months", tB0, tB1, { fin: 0.3, fout: 0.15 });
  const lab = cput(B.cam, `<div class="mono dim" style="font-size:22px;letter-spacing:.4em">FIVE MONTHS LATER</div>`, 960, 410);
  inA(lab, tB0 + 0.1, "fade", { dur: 0.5 });
  const months = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT"];
  const win = cput(B.cam, `<div style="height:200px;width:900px;overflow:hidden;position:absolute"></div>`, 960, 540);
  const col = put(win, `<div style="position:absolute;left:0;top:0;width:900px"></div>`);
  months.forEach((m) => put(col, `<div class="disp" style="height:200px;line-height:200px;font-size:180px;text-align:center">${m} <span class="dim2" style="font-weight:300">2026</span></div>`));
  const step = (E("o3") - S("o3") - 0.4) / (months.length - 1);
  months.slice(1).forEach((_, i) => {
    const t = S("o3") + 0.5 + i * step;
    to(col, t, { y: -(i + 1) * 200, duration: Math.min(0.42, step * 0.8), ease: "expo.inOut" });
    cueSfx(t, "tick");
  });
  const lineB = cput(B.cam, `<div style="width:900px;height:2px;background:var(--ink4)"></div>`, 960, 660);
  inA(lineB, tB0 + 0.2, "wipe", { dur: 0.8 });

  /* ---------- C: -$80.7B ---------- */
  const tC0 = at("o4", "eighty") - 0.15, tC1 = at("o5", "how strong") - 0.1;
  const C = scene("open-loss", tC0, tC1, { fin: 0, fout: 0.2 });
  const loss = cput(C.cam, `<div class="disp black red nowrap" style="font-size:330px;letter-spacing:-.05em;text-shadow:0 0 80px rgba(255,74,61,.45)">−$80.7B</div>`, 960, 500);
  inA(loss, tC0, "slam", { dur: 0.55 });
  hit(tC0 + 0.05, { amp: 26, peak: 0.55, color: "#ff4a3d" });
  glitch(tC0 + 0.02, 0.4, 1);
  cueSfx(tC0, "impact_big");
  const sub = cput(C.cam, `<div class="mono" style="font-size:28px;letter-spacing:.35em;color:var(--ink2)">NET LOSS · SIX MONTHS</div>`, 960, 720);
  inA(sub, at("o4", "in six") - 0.1, "wipe", { dur: 0.7 });
  to(C.cam, tC0, { scale: 1.08, duration: 5, ease: "none" });

  // rewind
  const tR = S("o5") + 0.05;
  const rw = put(C.cam, `<div class="mono" style="position:absolute;left:120px;top:150px;font-size:34px;letter-spacing:.2em;color:var(--ink)">◀◀ REWIND</div>`);
  gsap.set(rw, { opacity: 0 });
  to(rw, tR, { opacity: 1, duration: 0.05 });
  to(rw, tR + 0.3, { opacity: 0.2, duration: 0.15, repeat: 5, yoyo: true });
  const scan = put(C.el, `<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 2px,transparent 2px 6px);mix-blend-mode:screen"></div>`);
  gsap.set(scan, { opacity: 0 });
  to(scan, tR, { opacity: 1, duration: 0.1 });
  glitch(tR, 0.9, 0.8);
  cueSfx(tR, "rewind");
  to(loss, tR + 0.1, { scale: 0.35, y: -250, filter: "blur(10px)", opacity: 0, duration: tC1 - tR - 0.2, ease: "power2.in" });
  to(sub, tR, { opacity: 0, duration: 0.3 });

  /* ---------- D: "how strong is it, really?" ---------- */
  const tD0 = tC1 - 0.05, tD1 = E("o5") + 0.35;
  const D = scene("open-how", tD0, tD1, { fin: 0.15, fout: 0.25 });
  const hs = cput(D.cam, `<div class="nowrap" style="text-align:center"><div class="disp" style="font-size:150px;line-height:1">HOW STRONG</div>
      <div class="serif ital clay" style="font-size:140px;line-height:1.05">is it, really?</div></div>`, 960, 540);
  inA(hs.children[0], tD0, "up", { dur: 0.8 });
  inA(hs.children[1], tD0 + 0.35, "blur", { dur: 0.9 });
  cueSfx(tD0, "whoosh");
  to(D.cam, tD0, { scale: 1.05, duration: tD1 - tD0, ease: "none" });

  /* ---------- E: TITLE ---------- */
  const tT0 = E("o5") + 0.3, tT1 = S("c1_0") - 0.35;
  const T = scene("title", tT0, tT1, { fin: 0, fout: 0.35, z: 2 });
  const the = cput(T.cam, `<div class="mono dim" style="font-size:34px;letter-spacing:.9em;padding-left:.9em">THE</div>`, 960, 300);
  const b80 = cput(T.cam, `<div class="disp black nowrap" style="font-size:236px;line-height:1;letter-spacing:-.045em"><span class="clay">$80</span><span class="sweep" style="margin-left:.24em">BILLION</span></div>`, 960, 455);
  const par = cput(T.cam, `<div class="serif ital nowrap" style="font-size:270px;line-height:1">Paradox</div>`, 960, 660);
  const subT = cput(T.cam, `<div class="mono dim2 nowrap" style="font-size:20px;letter-spacing:.32em">AN INDEPENDENT EXPLAINER · ANTHROPIC’S DRAFT IPO FILING</div>`, 960, 850);
  const rule = cput(T.cam, `<div style="width:680px;height:2px;background:var(--clay)"></div>`, 960, 790);
  inA(the, tT0, "fade", { dur: 0.6 });
  inA(b80.querySelector(".clay"), tT0 + 0.05, "slam", { dur: 0.6 });
  b80.querySelector(".sweep").style.display = "inline-block";
  inA(b80.querySelector(".sweep"), tT0 + 0.12, "wipe", { dur: 0.9 });
  inA(par, tT0 + 0.45, "blur", { dur: 1.1 });
  inA(rule, tT0 + 0.9, "wipe", { dur: 0.9 });
  inA(subT, tT0 + 1.2, "fade", { dur: 0.8 });
  hit(tT0 + 0.05, { amp: 18, peak: 0.45, color: "#d97757" });
  cueSfx(tT0, "braam");
  // light sweep over BILLION
  const sweep = b80.querySelector(".sweep");
  Object.assign(sweep.style, {
    background: "linear-gradient(100deg,#f3efe6 0%,#f3efe6 42%,#ffffff 50%,#f3efe6 58%,#f3efe6 100%)",
    backgroundSize: "300% 100%", backgroundPosition: "100% 0", webkitBackgroundClip: "text", backgroundClip: "text",
  });
  sweep.style.color = "transparent";
  to(sweep, tT0 + 1.4, { backgroundPosition: "0% 0", duration: 1.6, ease: "power2.inOut" });
  to(T.cam, tT0, { scale: 1.07, duration: tT1 - tT0, ease: "none" });
  to(T.cam, tT1 - 0.5, { scale: 1.4, filter: "blur(16px)", duration: 0.5, ease: "power3.in" });
  cueSfx(tT1 - 0.5, "whoosh");
}
