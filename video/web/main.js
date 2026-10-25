import * as X from "./engine.js";
import hook from "./scenes/s0_hook.js";
import strength from "./scenes/s1_strength.js";
import leak from "./scenes/s2_leak.js";
import phantom from "./scenes/s3_phantom.js";
import bill from "./scenes/s4_bill.js";
import verdict from "./scenes/s5_verdict.js";

window.__ready = (async () => {
  await X.init();
  for (const build of [hook, strength, leak, phantom, bill, verdict]) build(X);
  X.finalize();
  return { duration: window.__duration, fps: window.__fps };
})().catch((e) => { window.__error = String(e && e.stack || e); throw e; });
