// Shared building blocks for the v2 scenes.

/** A full-screen statement whose pieces land on the words that say them.
 *  parts: [{ html, t }] — each piece pops in at its own time. */
export function statement(X, parent, parts, { x = 960, y = 540, size = 140, width = 1600, kind = "up", cls = "hero" } = {}) {
  const box = X.cput(parent, `<div class="${cls}" style="width:${width}px;text-align:center;font-size:${size}px;line-height:1.02"></div>`, x, y);
  const els = parts.map((p) => {
    const e = X.put(box, `<span style="display:inline-block;margin:0 .14em">${p.html}</span>`);
    X.inA(e, p.t - 0.06, kind, { dur: 0.45 });
    return e;
  });
  return { box, els };
}

/** Big number that counts up to its value as it slams in. */
export function heroNumber(X, parent, { x, y, size = 260, cls = "glow-red", t, from = 0, to, fmt, dur = 0.8, kind = "slam" }) {
  const e = X.cput(parent, `<div class="hero num ${cls}" style="font-size:${size}px;white-space:nowrap">${fmt(from)}</div>`, x, y);
  X.inA(e, t - 0.05, kind, { dur: 0.5 });
  X.counter(e, t - 0.05, dur, from, to, fmt, "expo.out");
  return e;
}

/** Slow constant push-in so no shot is ever static. */
export function drift(X, sc, amt = 0.05) {
  X.to(sc.cam, sc.t0, { scale: 1 + amt, duration: sc.t1 - sc.t0, ease: "none" });
}

export const B = (d = 1) => (v) => `$${v.toFixed(d)}B`;
