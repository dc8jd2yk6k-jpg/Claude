import * as X from "./engine.js";
import open from "./scenes/s0_open.js";
import ch1 from "./scenes/s1_strength.js";
import ch2 from "./scenes/s2_leak.js";
import ch3 from "./scenes/s3_phantom.js";
import ch4 from "./scenes/s4_bill.js";
import ch5 from "./scenes/s5_verdict.js";
import outro from "./scenes/s6_outro.js";

window.__ready = (async () => {
  await X.init();
  for (const build of [open, ch1, ch2, ch3, ch4, ch5, outro]) build(X);
  X.finalize();
  return { duration: window.__duration, fps: window.__fps };
})().catch((e) => { window.__error = String(e && e.stack || e); throw e; });
