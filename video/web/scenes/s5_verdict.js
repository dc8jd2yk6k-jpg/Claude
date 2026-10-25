// Verdict (3:07–3:38) + end screen (3:38–3:49).
import { statement, drift } from "./kit.js";

export default function verdict(X) {
  const { S, E, at, atEnd, put, cput, inA, outA, to, set, setHTML, scene, hit, punch, cueSfx, counter, during, sv, svgLayer, source, chapterLabel } = X;
  const t0 = X.sec("verdict");
  chapterLabel("05 · The verdict", t0, X.sec("end") - 0.3);

  /* ---- v1: strong or fragile + valuation range ---- */
  const Q = scene("ver-q", t0 - 0.05, S("v2") - 0.05, { fin: 0.1, fout: 0.15 });
  drift(X, Q, 0.04);
  const q = cput(Q.cam, `<div class="nowrap" style="text-align:center"><span class="hero glow-mint a" style="font-size:180px;display:inline-block">STRONG</span>
      <span class="serif ital b" style="font-size:130px;display:inline-block;margin:0 36px;color:var(--ink2)">or</span>
      <span class="hero glow-red c" style="font-size:180px;display:inline-block">FRAGILE?</span></div>`, 960, 330);
  inA(q.querySelector(".a"), at("v1", "strong") - 0.1, "right", { dur: 0.4 });
  inA(q.querySelector(".b"), at("v1", "or") - 0.1, "fade", { dur: 0.3 });
  inA(q.querySelector(".c"), at("v1", "fragile") - 0.1, "left", { dur: 0.4 });
  const vr = put(Q.cam, `<div style="position:absolute;left:160px;top:560px;width:1600px;height:320px"></div>`);
  const vsv = svgLayer(vr, 1600, 320);
  const lx = (v) => 60 + (Math.log10(v / 100) / Math.log10(2500 / 100)) * 1480;
  const dd = sv("defs", {}, vsv);
  const g2 = sv("linearGradient", { id: "vgr", x1: 0, y1: 0, x2: 1, y2: 0 }, dd);
  sv("stop", { offset: "0%", "stop-color": "#ff4a3d" }, g2);
  sv("stop", { offset: "100%", "stop-color": "#3de0b0" }, g2);
  sv("line", { x1: lx(100), x2: lx(2500), y1: 140, y2: 140, stroke: "rgba(243,239,230,.25)", "stroke-width": 4 }, vsv);
  const bar = sv("line", { x1: lx(144), x2: lx(2000), y1: 140, y2: 140, stroke: "url(#vgr)", "stroke-width": 16, "stroke-linecap": "round", pathLength: 1 }, vsv);
  const tR = at("v1", "valuations") - 0.1;
  X.draw(bar, tR, 1.2);
  [[144, "$144B", "NEW CONSTRUCTS", 0], [965, "$965B", "MAY ROUND", 0.4], [2000, "$2T", "IPO TALK", 0.8]].forEach(([v, a, b, d]) => {
    const g = sv("g", { opacity: 0 }, vsv);
    sv("circle", { cx: lx(v), cy: 140, r: 16, fill: "#f3efe6" }, g);
    const ta = sv("text", { x: lx(v), y: 96, "text-anchor": "middle", fill: "#f3efe6", "font-size": 52, "font-weight": 800 }, g);
    ta.textContent = a;
    const tb = sv("text", { x: lx(v), y: 206, "text-anchor": "middle", fill: "rgba(243,239,230,.65)", "font-size": 24 }, g);
    tb.textContent = b;
    set(g, (v === 144 ? at("v1", "one hundred") : v === 2000 ? at("v1", "two trillion") : tR + 0.6) - 0.05, { attr: { opacity: 1 } });
  });
  const lab = put(vr, `<div class="label" style="position:absolute;left:60px;top:260px;font-size:22px">WHAT IS IT WORTH? · VALUATION VIEWS · LOG SCALE</div>`);
  inA(lab, tR + 0.3, "fade");
  source("The Next Web (New Constructs); Orrick/Reuters; Reuters/Bloomberg", Q.t0 + 0.4, Q.t1);

  /* ---- v2–v5: the three numbers, relabelled ---- */
  const N = scene("ver-numbers", S("v2") - 0.05, S("v6") - 0.05, { fin: 0.1, fout: 0.2 });
  drift(X, N, 0.04);
  const hdr = cput(N.cam, `<div class="kicker" style="font-size:28px;color:var(--ink2)">THE THREE NUMBERS, AGAIN</div>`, 960, 230);
  inA(hdr, N.t0 + 0.05, "wipe", { dur: 0.4 });
  [
    { x: 330, v: "+$16.3B", cls: "glow-mint", old: "REVENUE", neu: "REAL DEMAND", col: "#3de0b0", id: "v3", w: "real demand" },
    { x: 960, v: "−$80.7B", cls: "glow-red", old: "NET LOSS", neu: "MOSTLY THE PRICE<br>OF SUCCESS", col: "#6f9bff", id: "v4", w: "mostly" },
    { x: 1590, v: "$20.28B", cls: "", old: "CASH", neu: "A SNAPSHOT,<br>NOT A RUNWAY", col: "#ffc857", id: "v5", w: "a snapshot" },
  ].forEach((d, i) => {
    const e = cput(N.cam, `<div style="text-align:center;width:600px">
        <div class="hero num ${d.cls}" style="font-size:${i === 1 ? 150 : 128}px">${d.v}</div>
        <div class="label lab" style="font-size:30px;margin-top:22px;line-height:1.4;min-height:90px">${d.old}</div></div>`, d.x, 540);
    inA(e, N.t0 + 0.15 + i * 0.12, "up", { dur: 0.45 });
    const l = e.querySelector(".lab"), t = at(d.id, d.w) - 0.1;
    setHTML(l, t, d.neu);
    to(l, t, { color: d.col, duration: 0.3 });
    to(e, t, { scale: 1.1, duration: 0.35, ease: "back.out(2)" });
    to(e, t + 0.5, { scale: 1, duration: 0.5 });
    if (i === 1) {
      const strip = put(e, `<div style="margin:18px auto 0;width:440px;height:24px;display:flex;border-radius:5px;overflow:hidden">
          <div style="width:${(72 / 80.7) * 100}%;background:repeating-linear-gradient(45deg,rgba(111,155,255,.7) 0 9px,rgba(111,155,255,.18) 9px 18px)"></div><div style="flex-grow:1;background:#ff4a3d"></div></div>`);
      inA(strip, t + 0.25, "wipe", { dur: 0.5 });
    }
  });

  /* ---- v6: going public ---- */
  const IP = scene("ver-ipo", S("v6") - 0.05, S("v7") - 0.05, { fin: 0.1, fout: 0.15 });
  const ocean = cput(IP.cam, `<div style="width:340px;height:340px;border-radius:170px;background:radial-gradient(circle,#3f86d6 0%,#1a3e6b 55%,rgba(26,62,107,0) 72%)"></div>`, 1180, 560);
  const pond = cput(IP.cam, `<div style="width:150px;height:150px;border-radius:75px;background:radial-gradient(circle,#ff8a5c 0%,#9a3a20 60%,rgba(0,0,0,0) 72%)"></div>`, 420, 600);
  const pl = cput(IP.cam, `<div class="label" style="font-size:24px">PRIVATE ROUNDS</div>`, 420, 720);
  const ol = cput(IP.cam, `<div class="hero" style="font-size:64px">PUBLIC MARKETS</div>`, 1180, 560);
  inA([pond, pl], IP.t0, "pop", { dur: 0.4 });
  const tPub = at("v6", "going public") - 0.15;
  inA(ocean, tPub, "pop", { dur: 0.45 });
  inA(ol, tPub + 0.15, "fade", { dur: 0.3 });
  to(ocean, tPub + 0.3, { scale: 3.4, duration: E("v6") - tPub + 0.6, ease: "power2.inOut" });
  const t1 = put(IP.cam, `<div style="position:absolute;left:140px;top:170px"><div class="kicker">WHY GO PUBLIC?</div>
      <div class="serif ital nowrap" style="font-size:96px;line-height:1.02;margin-top:14px">the deepest pool of<br>capital on Earth</div></div>`);
  inA([...t1.children], at("v6", "deepest") - 0.4, "up", { dur: 0.45, stagger: 0.12 });
  const nov = put(IP.cam, `<div class="label" style="position:absolute;left:140px;top:900px;font-size:22px">LISTING TARGETED FOR NOVEMBER 2026, PER REUTERS</div>`);
  inA(nov, tPub + 0.4, "fade");
  cueSfx(tPub, "swell", 0.8, 2);

  /* ---- v7: the closing line ---- */
  const C = scene("ver-close", S("v7") - 0.05, X.sec("end") - 0.05, { fin: 0.1, fout: 0.2 });
  drift(X, C, 0.05);
  const l1 = cput(C.cam, `<div class="hero nowrap" style="font-size:110px">Anthropic’s strength is <span class="glow-mint">real.</span></div>`, 960, 260);
  const l2 = cput(C.cam, `<div class="hero nowrap" style="font-size:110px">So is <span class="glow-hot">the bill.</span></div>`, 960, 400);
  inA(l1, S("v7") - 0.05, "up", { dur: 0.45 });
  inA(l2, at("v7", "so is") - 0.1, "up", { dur: 0.45 });
  const csv = svgLayer(C.cam);
  const p1 = sv("path", { d: "M 200 1000 C 700 980 1000 920 1300 840 S 1600 760 1700 720", fill: "none", stroke: "#3de0b0", "stroke-width": 8, "stroke-linecap": "round", pathLength: 1 }, csv);
  const p2 = sv("path", { d: "M 200 980 C 700 970 1000 940 1300 830 S 1600 690 1700 670", fill: "none", stroke: "#ff5a36", "stroke-width": 8, "stroke-linecap": "round", "stroke-dasharray": "1 1", pathLength: 1 }, csv);
  const tq = at("v7", "the only") - 0.1;
  X.draw(p1, tq, 2.4, "power2.inOut");
  X.draw(p2, tq + 0.1, 2.4, "power2.inOut");
  const la = sv("text", { x: 1720, y: 730, fill: "#3de0b0", "font-size": 28, opacity: 0 }, csv);
  la.textContent = "STRENGTH";
  const lb = sv("text", { x: 1720, y: 676, fill: "#ff5a36", "font-size": 28, opacity: 0 }, csv);
  lb.textContent = "THE BILL";
  set([la, lb], tq + 2.4, { attr: { opacity: 1 } });
  const which = cput(C.cam, `<div class="serif ital nowrap" style="font-size:110px">Which one grows faster?</div>`, 960, 590);
  inA(which, at("v7", "which one") - 0.1, "blur", { dur: 0.5 });
  punch(at("v7", "which one"), 0.05);

  /* ---- end screen (YouTube end-screen-safe) ---- */
  const tE = X.sec("end");
  to("#hud", tE - 0.3, { opacity: 0, duration: 0.3 });
  const EC = scene("endscreen", tE - 0.05, X.TL.duration + 0.1, { fin: 0.3, fout: 0 });
  const ttl = cput(EC.cam, `<div class="nowrap" style="text-align:center"><span class="hero glow-hot" style="font-size:90px">$80 BILLION</span> <span class="serif ital" style="font-size:96px">Paradox</span></div>`, 960, 150);
  inA(ttl, tE, "up", { dur: 0.5 });
  [520, 1400].forEach((x, i) => {
    const box = cput(EC.cam, `<div style="width:760px;height:428px;border:3px dashed rgba(243,239,230,.25);border-radius:16px;display:flex;align-items:center;justify-content:center">
        <div class="label" style="font-size:24px;color:var(--ink3)">${i ? "BEST FOR YOU" : "WATCH NEXT"}</div></div>`, x, 520);
    inA(box, tE + 0.2 + i * 0.12, "up", { dur: 0.5 });
  });
  const sub = cput(EC.cam, `<div class="pill" style="font-size:40px;background:#ff3d3d;color:#fff;padding:18px 44px">SUBSCRIBE</div>`, 960, 820);
  inA(sub, at("e1", "subscribe") - 0.1, "pop", { dur: 0.45 });
  const fine = cput(EC.cam, `<div class="label" style="font-size:18px;text-align:center;line-height:1.7">FIGURES FROM PRESS REPORTS OF A DRAFT, UNAUDITED S-1 · SEP–OCT 2026 · SOURCES IN THE DESCRIPTION<br>INDEPENDENT EXPLAINER · NOT AFFILIATED WITH ANTHROPIC · NOT INVESTMENT ADVICE · AI NARRATION</div>`, 960, 980);
  inA(fine, tE + 0.6, "fade", { dur: 0.6 });
}
