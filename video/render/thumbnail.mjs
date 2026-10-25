// Renders web/thumbnail.html to a 1280x720 PNG (YouTube thumbnail size).
//   node render/thumbnail.mjs ../dist/thumbnail.png
import { chromium } from "playwright";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(process.argv[2] || resolve(ROOT, "../dist/thumbnail.png"));
const browser = await chromium.launch({ args: ["--force-color-profile=srgb", "--font-render-hinting=none"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`file://${resolve(ROOT, "web/thumbnail.html")}`);
await page.evaluate(async () => {
  await Promise.all(["900 20px 'Inter Display'", "800 20px 'Inter Display'"].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
});
await page.screenshot({ path: out });
await browser.close();
console.log(`thumbnail -> ${out}`);
