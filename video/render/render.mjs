// Frame-accurate renderer: drives the motion-graphics page with Playwright,
// seeks every frame deterministically and pipes screenshots into ffmpeg.
//
//   node render/render.mjs --out build/video.mp4 [--workers 4] [--fps 30] [--from 0 --to 60] [--scale 1]
//   node render/render.mjs --stills 1.5,30,61 --outdir build/stills [--scale 0.5]
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { extname, join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]);
    return acc;
  }, [])
);

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".woff2": "font/woff2", ".woff": "font/woff", ".otf": "font/otf",
  ".ttf": "font/ttf", ".png": "image/png", ".svg": "image/svg+xml",
};
function serve() {
  return new Promise((ok) => {
    const srv = createServer(async (req, res) => {
      try {
        const p = join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
        if (!p.startsWith(ROOT)) throw new Error("forbidden");
        const body = await readFile(p);
        res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
        res.end(body);
      } catch {
        res.writeHead(404); res.end();
      }
    });
    srv.listen(0, "127.0.0.1", () => ok(srv));
  });
}

async function openPage(browser, port, scale) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  page.on("pageerror", (e) => console.error("[pageerror]", e.message));
  page.on("console", (m) => { if (m.type() === "error") console.error("[console]", m.text()); });
  await page.goto(`http://127.0.0.1:${port}/web/index.html`);
  await page.waitForFunction(() => window.__ready !== undefined || window.__error, null, { timeout: 60000 });
  const info = await page.evaluate(async () => { try { return await window.__ready; } catch (e) { return { error: window.__error || String(e) }; } });
  if (info.error) throw new Error(info.error);
  return { page, info };
}

async function shot(page, t, type) {
  await page.evaluate((tt) => window.__seek(tt), t);
  return page.screenshot({ type, quality: type === "jpeg" ? 94 : undefined, animations: "allow", caret: "initial" });
}

function ffmpegChunk(out, fps, codec) {
  const p = spawn("ffmpeg", [
    "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", codec, "-i", "-",
    "-vf", "scale=1920:1080:flags=lanczos,format=yuv420p",
    "-c:v", "libx264", "-preset", "medium", "-crf", "12", "-tune", "animation", "-g", String(fps * 2),
    "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", out,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  return p;
}
const write = (stream, buf) => new Promise((ok, ko) => stream.write(buf, (e) => (e ? ko(e) : ok())));

async function main() {
  const scale = Number(args.scale || 1);
  const srv = await serve();
  const port = srv.address().port;
  const browser = await chromium.launch({
    args: ["--force-color-profile=srgb", "--font-render-hinting=none", "--disable-lcd-text", "--hide-scrollbars",
      "--disable-background-timer-throttling", "--disable-renderer-backgrounding"],
  });

  try {
    if (args.stills) {
      const outdir = resolve(ROOT, args.outdir || "build/stills");
      await mkdir(outdir, { recursive: true });
      const { page } = await openPage(browser, port, scale);
      for (const ts of String(args.stills).split(",")) {
        const t = Number(ts);
        const buf = await shot(page, t, "png");
        await writeFile(join(outdir, `t${t.toFixed(2).padStart(7, "0")}.png`), buf);
      }
      console.log(`stills -> ${outdir}`);
      return;
    }

    const probe = await openPage(browser, port, scale);
    const { duration, fps: baseFps } = probe.info;
    const sfx = await probe.page.evaluate(() => window.__sfx);
    await writeFile(join(ROOT, "build", "sfx_cues.json"), JSON.stringify(sfx, null, 1));
    await probe.page.close();
    if (args.cues) { console.log(`${sfx.length} sfx cues -> build/sfx_cues.json`); return; }

    const fps = Number(args.fps || baseFps);
    const t0 = Number(args.from || 0), t1 = Number(args.to || duration);
    const f0 = Math.round(t0 * fps), f1 = Math.round(t1 * fps);
    const total = f1 - f0;
    const workers = Number(args.workers || 4);
    const out = resolve(ROOT, args.out || "build/video.mp4");
    const tmp = join(ROOT, "build", "chunks");
    await rm(tmp, { recursive: true, force: true });
    await mkdir(tmp, { recursive: true });
    const type = args.png ? "png" : "jpeg";
    const per = Math.ceil(total / workers);
    let done = 0;
    const started = Date.now();
    const timer = setInterval(() => {
      const el = (Date.now() - started) / 1000;
      const rate = done / el;
      process.stdout.write(`\r  ${done}/${total} frames  ${rate.toFixed(1)} fps  eta ${((total - done) / Math.max(rate, 0.01) / 60).toFixed(1)} min   `);
    }, 2000);

    const chunks = [];
    await Promise.all(Array.from({ length: workers }, async (_, w) => {
      const a = f0 + w * per, b = Math.min(f0 + (w + 1) * per, f1);
      if (a >= b) return;
      const file = join(tmp, `chunk_${String(w).padStart(2, "0")}.mp4`);
      chunks[w] = file;
      const { page } = await openPage(browser, port, scale);
      const ff = ffmpegChunk(file, fps, type === "png" ? "png" : "mjpeg");
      const closed = new Promise((ok, ko) => ff.on("close", (c) => (c === 0 ? ok() : ko(new Error(`ffmpeg ${c}`)))));
      for (let f = a; f < b; f++) {
        const buf = await shot(page, f / fps, type);
        await write(ff.stdin, buf);
        done++;
      }
      ff.stdin.end();
      await closed;
      await page.close();
    }));
    clearInterval(timer);

    const list = join(tmp, "list.txt");
    await writeFile(list, chunks.filter(Boolean).map((c) => `file '${c}'`).join("\n"));
    await new Promise((ok, ko) => {
      const p = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", out], { stdio: "inherit" });
      p.on("close", (c) => (c === 0 ? ok() : ko(new Error(`concat ${c}`))));
    });
    console.log(`\nrendered ${total} frames in ${((Date.now() - started) / 60000).toFixed(1)} min -> ${out}`);
  } finally {
    await browser.close();
    srv.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
