// The leak (1:01–1:29): the draft S-1, three numbers, the 45-day panic math.
import { statement, heroNumber, drift } from "./kit.js";

export default function leak(X) {
  const { S, E, at, atEnd, put, cput, inA, outA, to, set, setHTML, scene, hit, glitch, punch, cueSfx, counter, during, typeSeq, source, chapterLabel } = X;
  const t0 = X.sec("leak");
  chapterLabel("02 · The leak", t0, X.sec("phantom") - 0.3);

  /* ---- l1: the document ---- */
  const D = scene("leak-doc", t0 - 0.4, S("l2") - 0.05, { fin: 0.2, fout: 0.15 });
  const doc = cput(D.cam, `<div style="width:760px;height:980px;background:#efeae0;color:#16140f;border-radius:6px;padding:64px 70px;box-shadow:0 60px 140px rgba(0,0,0,.7);position:absolute;overflow:hidden">
      <div style="font-family:'JetBrains Mono';font-size:16px;letter-spacing:.2em;color:#6b655b">SECURITIES AND EXCHANGE COMMISSION</div>
      <div style="font-family:'Instrument Serif';font-size:96px;line-height:1;margin-top:26px">FORM S-1</div>
      <div style="font-family:'JetBrains Mono';font-size:18px;letter-spacing:.16em;margin-top:12px">DRAFT · CONFIDENTIAL</div>
      <div style="height:3px;background:#16140f;margin:30px 0"></div><div class="rows"></div></div>`, 1240, 560);
  const rows = doc.querySelector(".rows");
  const rr = X.rng(3), hl = [];
  for (let i = 0; i < 15; i++) {
    const row = put(rows, `<div style="display:flex;gap:10px;margin-bottom:19px;align-items:center"></div>`);
    if (i === 3 || i === 7 || i === 11) {
      const k = (i - 3) / 4;
      put(row, `<div style="font-family:'Inter Display';font-weight:700;font-size:24px">${["Revenue", "Net loss", "Cash & ST investments"][k]}</div>`);
      put(row, `<div style="flex-grow:1;border-bottom:2px dotted #8a8478;height:16px"></div>`);
      const v = put(row, `<div style="font-family:'JetBrains Mono';font-weight:700;font-size:24px;position:relative">${["16,3••", "(80,7••)", "20,28•"][k]}<div class="hl" style="position:absolute;left:-10px;right:-10px;top:-5px;bottom:-5px;background:rgba(255,74,61,.45);mix-blend-mode:multiply;transform-origin:0 50%"></div></div>`);
      hl.push(v.querySelector(".hl"));
    } else {
      let w = 0;
      while (w < 600) {
        const ww = 30 + rr() * 120;
        put(row, `<div style="width:${ww}px;height:13px;background:${rr() < 0.12 ? "#16140f" : "rgba(22,20,15,.22)"};border-radius:2px"></div>`);
        w += ww + 10;
      }
    }
  }
  gsap.set(doc, { y: 760, rotation: 5 });
  to(doc, D.t0, { y: 0, rotation: -2, duration: 1.0, ease: "expo.out" });
  cueSfx(D.t0 + 0.05, "paper", 1, 1);
  const tag = put(D.cam, `<div style="position:absolute;left:130px;top:360px;width:640px">
      <div class="pill" style="font-size:28px;background:#ff4a3d;color:#07070a">● LEAKED</div>
      <div class="hero" style="font-size:110px;margin-top:30px">The draft<br>IPO filing</div>
      <div class="label" style="margin-top:26px">REUTERS · WSJ · FORTUNE</div></div>`);
  inA([...tag.children], D.t0 + 0.2, "up", { dur: 0.5, stagger: 0.12 });
  hl.forEach((h, i) => {
    gsap.set(h, { scaleX: 0 });
    to(h, at("l1", "three numbers") + i * 0.22, { scaleX: 1, duration: 0.25 });
  });
  to(D.cam, at("l1", "three numbers"), { scale: 1.12, x: -120, duration: 1.4, ease: "power2.inOut" });
  const illus = put(D.cam, `<div class="label" style="position:absolute;left:1500px;top:1010px;font-size:16px">ILLUSTRATION</div>`);
  inA(illus, D.t0 + 0.5, "fade");

  /* ---- l2–l4: the three numbers ---- */
  const N = scene("leak-numbers", S("l2") - 0.05, S("l5") - 0.05, { fin: 0.1, fout: 0.2 });
  drift(X, N, 0.04);
  const cols = [
    { x: 330, lab: "REVENUE · H1 2026", sub: "vs $1.1B a year earlier", cls: "glow-mint", to: 16.3, sign: "+", w: ["l2", "sixteen"] },
    { x: 960, lab: "NET LOSS · H1 2026", sub: "vs ~$13B a year earlier", cls: "glow-red", to: 80.7, sign: "−", w: ["l3", "eighty"] },
    { x: 1590, lab: "CASH · DEC 31 2025", sub: "cash + short-term investments", cls: "", to: 20.28, sign: "", w: ["l4", "twenty point"] },
  ].map((c, i) => {
    const t = at(c.w[0], c.w[1]);
    const lab = cput(N.cam, `<div class="label nowrap" style="font-size:26px;color:var(--ink)">${c.lab}</div>`, c.x, 400);
    inA(lab, N.t0 + 0.1 + i * 0.15, "up", { dur: 0.35 });
    const ph = cput(N.cam, `<div class="hero nowrap" style="font-size:110px;color:rgba(243,239,230,.12)">$???</div>`, c.x, 530);
    inA(ph, N.t0 + 0.2 + i * 0.15, "fade", { dur: 0.3 });
    to(ph, t - 0.1, { opacity: 0, duration: 0.1 });
    const num = heroNumber(X, N.cam, { x: c.x, y: 530, size: i === 1 ? 160 : 128, cls: c.cls, t, from: 0, to: c.to,
      fmt: (v) => `${c.sign}$${v.toFixed(i === 2 ? 2 : 1)}B`, dur: 0.6 });
    const sub = cput(N.cam, `<div class="label" style="font-size:22px">${c.sub}</div>`, c.x, 650);
    inA(sub, t + 0.4, "fade", { dur: 0.3 });
    if (i === 1) {
      hit(t + 0.05, { amp: 28, peak: 0.5, color: "#ff4a3d" });
      glitch(t, 0.3, 1);
      cueSfx(t - 0.04, "impact_big", 1, 3);
    } else {
      punch(t, 0.04);
      cueSfx(t - 0.04, "impact", 0.6, 1);
    }
    return { lab, num, sub };
  });
  source("Reuters, WSJ (Oct 20 2026); Fortune (Sep 29 2026) — draft S-1", N.t0 + 0.3, N.t1);

  /* ---- l5: the scary math ---- */
  const M = scene("leak-math", S("l5") - 0.05, S("l6") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, M, 0.04);
  const scary = cput(M.cam, `<div class="kicker" style="font-size:30px;color:#ff4a3d">THE SCARY MATH</div>`, 960, 220);
  inA(scary, M.t0 + 0.05, "wipe", { dur: 0.4 });
  const eq1 = cput(M.cam, `<div class="hero nowrap" style="font-size:100px"><span class="a">$80.7B ÷ 6 = </span><span class="b glow-red">$13.5B/mo</span></div>`, 960, 380);
  inA(eq1.querySelector(".a"), M.t0 + 0.1, "up", { dur: 0.4 });
  inA(eq1.querySelector(".b"), at("l5", "thirteen") - 0.05, "slam", { dur: 0.4 });
  const fuse = put(M.cam, `<div style="position:absolute;left:260px;top:560px;width:1400px">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><div class="label" style="font-size:30px;color:var(--ink)">$20B IN THE BANK</div><div class="hero num glow-red days" style="font-size:120px">45 DAYS</div></div>
      <div style="margin-top:20px;height:70px;border:3px solid var(--ink3);border-radius:10px;padding:7px"><div class="f" style="height:100%;width:100%;background:linear-gradient(90deg,#ff4a3d,#ff9a5c);border-radius:5px"></div></div></div>`);
  inA(fuse, at("l5", "at that rate") - 0.1, "up", { dur: 0.5 });
  const tf = at("l5", "forty-five") - 0.1;
  to(fuse.querySelector(".f"), tf, { width: "0%", duration: E("l5") - tf + 0.8, ease: "power1.in" });
  counter(fuse.querySelector(".days"), tf, E("l5") - tf + 0.8, 45, 0, (v) => `${Math.ceil(v)} DAYS`, "power1.in");
  punch(tf + 0.05, 0.04);

  /* ---- l6: Valentine's Day + the question ---- */
  const V = scene("leak-val", S("l6") - 0.05, X.sec("phantom") - 0.05, { fin: 0.1, fout: 0.15 });
  const cal = cput(V.cam, `<div style="width:520px;height:600px;background:#f2ede2;border-radius:18px;overflow:hidden;box-shadow:0 50px 120px rgba(0,0,0,.6);color:#16140f">
      <div class="mono mon" style="height:120px;background:#ff4a3d;color:#fff;display:flex;align-items:center;justify-content:center;font-size:40px;letter-spacing:.3em;font-weight:700">JANUARY</div>
      <div class="hero day" style="font-size:330px;line-height:420px;text-align:center">1</div></div>`, 620, 560);
  inA(cal, V.t0, "up", { dur: 0.4 });
  const dd = { d: 0 };
  const tV = at("l6", "valentine");
  to(dd, V.t0 + 0.15, { d: 44, duration: tV - V.t0 - 0.1, ease: "power2.in" });
  const dayEl = cal.querySelector(".day"), monEl = cal.querySelector(".mon");
  during(V.t0, V.t1, () => {
    const n = Math.round(dd.d);
    dayEl.textContent = String(n < 31 ? n + 1 : n - 30);
    monEl.textContent = n < 31 ? "JANUARY" : "FEBRUARY";
  });
  const stamp = cput(V.cam, `<div class="stamp" style="font-size:66px;color:#ff4a3d;transform:rotate(-10deg);background:rgba(7,7,10,.7)">DEAD?</div>`, 650, 600);
  inA(stamp, tV + 0.1, "slam", { dur: 0.35 });
  cueSfx(tV + 0.08, "stamp", 1, 2);
  const why = cput(V.cam, `<div style="text-align:center"><div class="serif ital" style="font-size:96px;color:var(--ink2)">so…</div><div class="hero" style="font-size:150px">why isn’t it?</div></div>`, 1380, 540);
  inA(why, at("l6", "why") - 0.15, "blur", { dur: 0.45 });
  punch(at("l6", "why"), 0.05);
}
