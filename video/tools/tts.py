"""Narration -> per-line voice-over WAVs + master timeline.

Reads script/narration.json, renders each line with Kokoro-82M (ONNX), trims
edge silence, lays the lines out on a timeline (respecting `pre` gaps, `pause`
after each line and `bar` snapping to the 2-second music grid) and writes:

  build/vo/<id>.wav        per-line VO, 48 kHz mono
  build/vo_track.wav       full-length VO track, 48 kHz mono
  build/timeline.json      cue times consumed by the visuals, score and mixer
  ../dist/*.srt            captions
"""
import hashlib
import json
import math
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"
VO = BUILD / "vo"
CACHE = BUILD / "vo_cache"
DIST = ROOT.parent / "dist"
SR = 48000


def trim(x, sr, thresh_db=-48.0, keep=0.03):
    env = np.abs(x)
    thr = 10 ** (thresh_db / 20) * max(env.max(), 1e-9)
    idx = np.where(env > thr)[0]
    if len(idx) == 0:
        return x
    a = max(idx[0] - int(keep * sr), 0)
    b = min(idx[-1] + int(keep * 2 * sr), len(x))
    return x[a:b]


def fmt_srt(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def wrap(text, width=48):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > width and cur:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    lines.append(cur)
    return "\n".join(lines)


def split_cues(text, start, end, max_chars=96):
    """Split a long caption into sentence cues with proportional timing."""
    if len(text) <= max_chars:
        return [(start, end, text)]
    parts = re.split(r"(?<=[.?!…:])\s+", text)
    chunks, cur = [], ""
    for p in parts:
        if cur and len(cur) + len(p) + 1 > max_chars:
            chunks.append(cur)
            cur = p
        else:
            cur = f"{cur} {p}".strip()
    chunks.append(cur)
    total = sum(len(c) for c in chunks)
    out, t = [], start
    for c in chunks:
        d = (end - start) * len(c) / total
        out.append((t, t + d, c))
        t += d
    return out


def main():
    spec = json.loads((ROOT / "script" / "narration.json").read_text())
    VO.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    DIST.mkdir(parents=True, exist_ok=True)

    kokoro = None
    voice, speed = spec["voice"], spec["speed"]
    bar = spec["bar"]

    t = spec["lead_in"]
    lines_out, sections = [], {}
    for ln in spec["lines"]:
        say = ln.get("say", ln["text"])
        key = hashlib.sha1(f"{voice}|{speed}|{say}".encode()).hexdigest()[:16]
        cached = CACHE / f"{key}.wav"
        if not cached.exists():
            if kokoro is None:
                from kokoro_onnx import Kokoro
                kokoro = Kokoro(str(ROOT / "models" / "kokoro-v1.0.onnx"),
                                str(ROOT / "models" / "voices-v1.0.bin"))
            samples, sr = kokoro.create(say, voice=voice, speed=speed, lang="en-us")
            samples = trim(np.asarray(samples, dtype=np.float32), sr)
            samples = resample_poly(samples, SR, sr).astype(np.float32)
            sf.write(cached, samples, SR)
            print(f"  tts {ln['id']:6s} {len(samples)/SR:5.2f}s  {say[:60]}", file=sys.stderr)
        audio, _ = sf.read(cached, dtype="float32")
        sf.write(VO / f"{ln['id']}.wav", audio, SR)
        dur = len(audio) / SR

        t += ln.get("pre", 0.0)
        if ln.get("bar"):
            t = math.ceil((t - 1e-6) / bar) * bar
        if "section" in ln:
            sections[ln["section"]] = round(t, 3)
        lines_out.append({
            "id": ln["id"], "start": round(t, 3), "end": round(t + dur, 3),
            "dur": round(dur, 3), "text": ln["text"], "say": say,
        })
        t += dur + ln.get("pause", 0.4)

    duration = math.ceil((t + spec["tail"]) / bar) * bar
    timeline = {
        "fps": 30, "width": 1920, "height": 1080, "bar": bar,
        "duration": duration, "sections": sections,
        "lines": {l["id"]: l for l in lines_out}, "order": [l["id"] for l in lines_out],
    }
    (BUILD / "timeline.json").write_text(json.dumps(timeline, indent=1))

    track = np.zeros(int(duration * SR) + SR, dtype=np.float32)
    for l in lines_out:
        a, _ = sf.read(VO / f"{l['id']}.wav", dtype="float32")
        i = int(round(l["start"] * SR))
        track[i:i + len(a)] += a
    sf.write(BUILD / "vo_track.wav", track[: int(duration * SR)], SR)

    # loudness envelope at video frame rate, for audio-reactive visuals
    hop = SR // timeline["fps"]
    n = int(duration * timeline["fps"])
    env = np.array([np.sqrt(np.mean(track[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
    env = np.clip(env / (np.percentile(env[env > 1e-4], 95) + 1e-9), 0, 1.2)
    (BUILD / "vo_env.json").write_text(json.dumps([round(float(v), 3) for v in env]))

    cues = []
    for l in lines_out:
        cues += split_cues(l["text"], l["start"], l["end"])
    srt = "\n".join(
        f"{i}\n{fmt_srt(a)} --> {fmt_srt(b)}\n{wrap(txt)}\n" for i, (a, b, txt) in enumerate(cues, 1)
    )
    (DIST / "anthropic-80b-paradox.srt").write_text(srt)

    print(f"timeline: {len(lines_out)} lines, duration {duration:.1f}s "
          f"({int(duration // 60)}:{duration % 60:04.1f})")
    for k, v in sections.items():
        print(f"  {k:6s} @ {v:7.2f}s")


if __name__ == "__main__":
    main()
