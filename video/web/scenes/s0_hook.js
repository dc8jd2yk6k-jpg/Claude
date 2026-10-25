// Hook (0:00–0:15): the loss, the valuation, the open loop, the title punch.
import { heroNumber, drift } from "./kit.js";

export default function hook(X) {
  const { S, E, at, put, cput, inA, outA, to, set, scene, hit, glitch, punch, cueSfx, counter } = X;
  const tTitle = E("h3") + 0.05, tEnd = X.sec("strength") - 0.05;

  const A = scene("hook", 0, tTitle + 0.05, { fin: 0, fout: 0.1 });
  drift(X, A, 0.06);

  // frame 0 is never empty: the company name is already on screen
  const name = cput(A.cam, `<div class="hero" style="font-size:150px;letter-spacing:.02em">ANTHROPIC</div>`, 960, 300);
  inA(name, 0.0, "rise", { dur: 0.5 });
  const flood = put(A.el, `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(255,74,61,.45),rgba(255,74,61,0) 65%)"></div>`);
  gsap.set(flood, { opacity: 0 });
  const tLost = at("h1", "lost"), tNum = at("h1", "eighty");
  to(flood, tLost, { opacity: 1, duration: 0.25 });
  to(flood, tNum + 0.6, { opacity: 0.35, duration: 1.2 });
  to(name, tNum - 0.1, { y: -90, scale: 0.55, opacity: 0.8, duration: 0.5, ease: "expo.out" });

  const grp = put(A.cam, `<div style="position:absolute;inset:0"></div>`);
  const loss = heroNumber(X, grp, { x: 960, y: 520, size: 330, cls: "glow-red", t: tNum, from: 0, to: 80.7, fmt: (v) => `−$${v.toFixed(1)}B`, dur: 0.75 });
  hit(tNum + 0.05, { amp: 30, peak: 0.55, color: "#ff4a3d" });
  glitch(tNum, 0.3, 1);
  cueSfx(tNum - 0.04, "impact_big", 1, 3);
  const six = cput(grp, `<div class="pill" style="font-size:40px;background:#ff4a3d;color:#07070a">IN JUST 6 MONTHS</div>`, 960, 760);
  inA(six, at("h1", "in six") - 0.05, "pop", { dur: 0.45 });

  // "and yet": the loss slides left, the valuation rises on the right
  const tYet = S("h2");
  to(loss, tYet, { x: -470, scale: 0.6, duration: 0.7, ease: "expo.inOut" });
  to(six, tYet, { x: -470, y: -120, scale: 0.7, duration: 0.7, ease: "expo.inOut" });
  to(name, tYet, { opacity: 0, duration: 0.3 });
  to(flood, tYet, { opacity: 0, duration: 0.6 });
  const yet = cput(grp, `<div class="serif ital" style="font-size:110px;color:var(--ink2)">and yet…</div>`, 960, 260);
  inA(yet, tYet + 0.05, "blur", { dur: 0.5 });
  const tT = at("h2", "two trillion");
  const val = heroNumber(X, grp, { x: 1430, y: 500, size: 260, cls: "glow-mint", t: tT, from: 0, to: 2.0, fmt: (v) => `$${v.toFixed(1)}T`, dur: 0.7 });
  const valLab = cput(grp, `<div class="label" style="color:var(--mint)">IPO VALUATION TALK ▲</div>`, 1430, 680);
  inA(valLab, tT + 0.2, "up", { dur: 0.45 });
  punch(tT + 0.05, 0.05);
  cueSfx(at("h2", "investors") - 0.1, "riser", 0.7, 1);

  // the open loop: one number is an illusion; the real threat is still hidden
  const tIll = at("h3", "illusion");
  const ill = cput(grp, `<div class="stamp" style="font-size:58px;color:#6f9bff;transform:rotate(-8deg);background:rgba(7,7,10,.75)">ILLUSION?</div>`, 490, 520);
  inA(ill, tIll - 0.05, "slam", { dur: 0.35 });
  glitch(tIll, 0.25, 0.7);
  to(loss, tIll, { opacity: 0.55, duration: 0.3 });
  to(yet, at("h3", "one of") - 0.1, { opacity: 0, duration: 0.3 });
  const tReal = at("h3", "really sink");
  to(grp, tReal - 0.2, { y: -190, scale: 0.72, opacity: 0.45, duration: 0.6, ease: "expo.inOut" });
  const secret = cput(A.cam, `<div style="text-align:center;padding:34px 70px;border:3px solid var(--hot);border-radius:20px;background:rgba(255,90,54,.08)">
      <div class="label" style="color:var(--hot)">THE NUMBER THAT COULD SINK IT</div>
      <div class="hero" style="font-size:190px;filter:blur(14px);margin-top:10px">$???B</div></div>`, 960, 700);
  inA(secret, tReal - 0.1, "up", { dur: 0.6 });
  const lock = cput(A.cam, `<div style="font-size:120px">🔒</div>`, 960, 740);
  inA(lock, at("h3", "on screen") - 0.1, "pop", { dur: 0.4 });
  punch(at("h3", "on screen"), 0.04);

  // title punch
  const T = scene("title", tTitle, tEnd, { fin: 0, fout: 0.12, z: 3 });
  T.el.insertBefore(X.h(`<div style="position:absolute;inset:0;background:#07070a"></div>`), T.cam);
  const ttl = cput(T.cam, `<div class="nowrap" style="text-align:center">
      <div class="kicker" style="font-size:30px">THE</div>
      <div class="hero" style="font-size:210px"><span class="glow-hot">$80 BILLION</span></div>
      <div class="serif ital" style="font-size:200px;line-height:.9">Paradox</div></div>`, 960, 540);
  inA(ttl, tTitle, "slam", { dur: 0.4 });
  hit(tTitle + 0.03, { amp: 14, peak: 0.25, color: "#ff5a36" });
  cueSfx(tTitle - 0.02, "whoosh", 1, 2);
  to(T.cam, tTitle, { scale: 1.08, duration: tEnd - tTitle, ease: "none" });
}
