"""Sound design: every effect is synthesized from scratch, then placed on the
timeline from build/sfx_cues.json (exported by the motion-graphics page)."""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
from dsp import (SR, bp, env_ad, env_adsr, hp, lp, midi_hz, noise, norm, osc, place, reverb, secs, softclip,  # noqa: E402
                 stereo, supersaw, sweep_filter, t_axis)

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"


def thump(f0=110, f1=42, d=0.6, click=0.3, seed=1):
    t = t_axis(d)
    f = f1 + (f0 - f1) * np.exp(-t * 18)
    body = osc(f, d) * env_ad(d, 0.002, 6)
    c = hp(noise(0.02, seed), 1500) * env_ad(0.02, 0.0005, 8) * click
    body[: len(c)] += c
    return body


def whoosh(d=0.9, f0=300, f1=3500, seed=2, pan0=-0.6, pan1=0.6):
    n = noise(d, seed)
    x = sweep_filter(n, f0, f1, "bp", blocks=48, q_bw=0.9)
    e = np.sin(np.pi * np.clip(t_axis(d) / d, 0, 1)) ** 2
    x = x * e
    pans = np.linspace(pan0, pan1, len(x))
    l, r = np.cos((pans + 1) * np.pi / 4), np.sin((pans + 1) * np.pi / 4)
    return norm(np.stack([x * l, x * r], 1), 0.8)


def impact(big=False, seed=3):
    d = 3.2 if big else 1.4
    b = thump(140 if big else 120, 34 if big else 48, d, 0.6, seed) * (1.0 if big else 0.8)
    crack = lp(noise(d, seed + 1), 5000) * env_ad(d, 0.001, 16 if big else 22) * (0.5 if big else 0.3)
    x = b + crack
    if big:
        sub = osc(32, d) * env_ad(d, 0.01, 2.5) * 0.6
        ring = (osc(midi_hz(50), d) + 0.5 * osc(midi_hz(57), d)) * env_ad(d, 0.003, 5) * 0.08
        x = x + sub + ring
    x = softclip(x * 1.4, 1.5)
    return norm(reverb(stereo(x, 0, 0.3), wet=0.35 if big else 0.25, rt60=2.8 if big else 1.6), 0.95)


def braam(soft=False, seed=4):
    d = 4.5
    notes = [26, 38, 45, 50] if not soft else [38, 45, 50, 57]
    x = sum(supersaw(midi_hz(m), d, 5, 0.01, seed + i) for i, m in enumerate(notes)) / len(notes)
    x = sweep_filter(x, 200, 2200 if not soft else 1400, "lp", blocks=40)
    x = x * env_adsr(d, 0.03, 0.6, 0.55, 2.2)
    x = softclip(x * (3.0 if not soft else 1.6), 2.0)
    if not soft:
        th = thump(90, 30, 2.5, 0.2, seed)
        x[: len(th)] += th * 0.7
    return norm(reverb(stereo(x, 0, 0.6), wet=0.45, rt60=3.2), 0.9)


def tick(f=3200, d=0.03, seed=5):
    x = bp(noise(d, seed), f * 0.6, f * 1.6) * env_ad(d, 0.0005, 18)
    x += osc(f * 0.5, d) * env_ad(d, 0.0005, 30) * 0.3
    return norm(stereo(x), 0.6)


def pop(f0=520, f1=980, d=0.12):
    t = t_axis(d)
    x = osc(f0 + (f1 - f0) * (t / d), d) * env_ad(d, 0.002, 9)
    return norm(reverb(stereo(x, 0, 0.2), 0.15, 0.8), 0.6)


def bell(m=88, d=1.6):
    f = midi_hz(m)
    x = sum(a * osc(f * k, d) * env_ad(d, 0.001, 3 + 2 * i) for i, (k, a) in enumerate([(1, 1), (2.01, 0.4), (2.76, 0.25), (5.4, 0.1)]))
    return norm(reverb(stereo(x, 0, 0.3), 0.3, 1.8), 0.5)


def node(seed=6):
    d = 0.7
    t = t_axis(d)
    x = osc(330 + 330 * np.minimum(t / 0.06, 1), d) * env_ad(d, 0.003, 7) + 0.3 * osc(1320, d) * env_ad(d, 0.002, 12)
    return norm(reverb(stereo(x, 0, 0.3), 0.3, 1.4), 0.55)


def stair(seed=7):
    d = 0.5
    x = thump(160, 70, d, 0.4, seed) * 0.8 + osc(midi_hz(74), d) * env_ad(d, 0.002, 9) * 0.25
    return norm(reverb(stereo(x, 0, 0.2), 0.2, 1.2), 0.7)


def stamp_fx(seed=8):
    d = 0.5
    x = thump(180, 60, d, 0.9, seed) + lp(noise(d, seed), 2500) * env_ad(d, 0.001, 25) * 0.6
    return norm(reverb(stereo(x), 0.15, 0.9), 0.8)


def typing(d=1.6, seed=9):
    r = np.random.default_rng(seed)
    out = np.zeros((secs(d), 2), np.float32)
    t = 0.0
    while t < d - 0.05:
        k = tick(2000 + r.random() * 2500, 0.025, int(r.random() * 1000)) * (0.4 + 0.4 * r.random())
        place(out, k, t)
        t += 0.05 + r.random() * 0.06
    return out


def counter_fx(d=1.4):
    out = np.zeros((secs(d) + SR // 4, 2), np.float32)
    t, i = 0.0, 0
    while t < d:
        place(out, tick(1800 + 120 * i, 0.025, i), t, 0.5)
        t += max(0.035, 0.11 * (1 - t / d))
        i += 1
    return out


def riser(d=1.4, seed=10):
    n = noise(d, seed)
    x = sweep_filter(n, 300, 7000, "bp", 48, 0.7) * np.linspace(0, 1, secs(d)) ** 2
    t = t_axis(d)
    tone = osc(110 * 2 ** (3 * (t / d) ** 2), d, "saw") * np.linspace(0, 1, secs(d)) ** 3 * 0.25
    x = x + lp(tone, 4000)
    return norm(reverb(stereo(x, 0, 0.5), 0.3, 1.5), 0.7)


def rewind(d=1.6, seed=11):
    t = t_axis(d)
    f = 900 + 700 * np.sin(2 * np.pi * 9 * t) + 1500 * (t / d)
    x = osc(f, d, "saw") * 0.2 + bp(noise(d, seed), 1500, 6000) * 0.4
    x = x * np.minimum(1, (d - t) * 4) * np.minimum(1, t * 20)
    return norm(stereo(lp(x, 7000), 0, 0.3), 0.55)


def glitch_fx(d=0.35, seed=12):
    r = np.random.default_rng(seed)
    x = np.zeros(secs(d), np.float32)
    i = 0
    while i < len(x):
        n = int(r.integers(300, 3000))
        kind = r.integers(0, 3)
        seg = osc(r.integers(200, 4000), n / SR, "square") if kind == 0 else (r.standard_normal(n) if kind == 1 else np.zeros(n))
        seg = np.round(seg * 4) / 4
        x[i:i + n] = seg[: len(x[i:i + n])] * (0.5 + 0.5 * r.random())
        i += n
    return norm(stereo(hp(x, 200), 0, 0.5), 0.45)


def paper(d=1.2, seed=13):
    x = bp(noise(d, seed), 800, 6000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 3 * t_axis(d)))) * env_adsr(d, 0.2, 0.3, 0.6, 0.6)
    return norm(stereo(x, 0, 0.3), 0.4)


def scan(d=2.4):
    t = t_axis(d)
    x = osc(300 + 900 * (t / d), d) * 0.3 + osc(600 + 1800 * (t / d), d) * 0.1
    x *= np.sin(np.pi * t / d) * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * t))
    return norm(stereo(x, 0, 0.2), 0.3)


def marker(d=0.32, seed=14):
    x = bp(noise(d, seed), 2200, 5200) * np.sin(np.pi * t_axis(d) / d)
    return norm(stereo(x), 0.35)


def clock_fast(d=4.2):
    out = np.zeros((secs(d) + SR // 2, 2), np.float32)
    t, i = 0.0, 0
    while t < d:
        place(out, tick(2600 if i % 2 else 1900, 0.03, i), t, 0.7)
        t += max(0.06, 0.25 * (1 - t / d))
        i += 1
    return out


def flip_run(d=3.6, seed=15):
    out = np.zeros((secs(d) + SR // 2, 2), np.float32)
    t, i = 0.0, 0
    while t < d:
        f = bp(noise(0.06, seed + i), 1500, 7000) * env_ad(0.06, 0.003, 7)
        place(out, stereo(f, 0, 0.2), t, 0.5)
        t += max(0.045, 0.22 * (1 - t / d) ** 1.5)
        i += 1
    return out


def fuse(d=3.5, seed=16):
    r = np.random.default_rng(seed)
    x = np.zeros(secs(d), np.float32)
    for _ in range(int(d * 140)):
        i = r.integers(0, len(x) - 200)
        x[i:i + 60] += r.standard_normal(60) * r.random()
    x = bp(x, 1500, 9000) + lp(noise(d, seed), 800) * 0.15
    x *= np.minimum(1, t_axis(d) * 4) * np.minimum(1, (d - t_axis(d)) * 2)
    return norm(stereo(x, 0.3, 0.3), 0.4)


def split(d=0.9, seed=17):
    x = sweep_filter(noise(d, seed), 6000, 300, "bp", 40, 0.5) * env_ad(d, 0.01, 4)
    x += thump(100, 50, d, 0.3) * 0.5
    return norm(reverb(stereo(x, 0, 0.4), 0.3, 1.6), 0.7)


def inflate(d=4.0, seed=18):
    x = sweep_filter(noise(d, seed), 200, 1800, "bp", 48, 0.5) * np.linspace(0.2, 1, secs(d))
    t = t_axis(d)
    squeak = osc(400 + 300 * t / d + 30 * np.sin(2 * np.pi * 6 * t), d, "tri") * 0.06 * np.linspace(0, 1, len(t))
    return norm(stereo(x + squeak, 0, 0.3), 0.45)


def dissolve(d=2.2, seed=19):
    r = np.random.default_rng(seed)
    out = np.zeros((secs(d) + SR, 2), np.float32)
    for k in range(70):
        t = r.random() * d * 0.8
        m = 96 - int(28 * t / d) + r.integers(-3, 4)
        g = bell(m, 0.5) * (0.15 + 0.2 * r.random())
        g = np.stack([g[:, 0] * (0.5 + r.random() * 0.5), g[:, 1] * (0.5 + r.random() * 0.5)], 1)
        place(out, g, t)
    return norm(out, 0.5)


def lock_fx(seed=20):
    out = np.zeros((secs(1.0), 2), np.float32)
    place(out, stamp_fx(seed) * 0.7, 0)
    place(out, tick(1400, 0.04, seed) * 1.2, 0.12)
    place(out, bell(79, 0.8) * 0.5, 0.12)
    return out


def alert(d=0.9):
    t = t_axis(d)
    x = osc(np.where(t < 0.2, 880, np.where(t < 0.4, 660, np.where(t < 0.6, 880, 660))), d, "tri") * env_adsr(d, 0.01, 0.1, 0.6, 0.3) * 0.5
    return norm(reverb(stereo(x), 0.2, 1.0), 0.4)


def swell(d=4.0, seed=21):
    x = sum(supersaw(midi_hz(m), d, 5, 0.008, seed + i) for i, m in enumerate([50, 57, 62, 65, 69])) / 5
    x = sweep_filter(x, 300, 3500, "lp", 40) * np.linspace(0, 1, secs(d)) ** 1.5
    return norm(reverb(stereo(x, 0, 0.8), 0.5, 3.0), 0.6)


def lens_fx():
    out = np.zeros((secs(1.6), 2), np.float32)
    place(out, whoosh(0.5, 1500, 6000, 22) * 0.5, 0)
    place(out, bell(93, 1.2) * 0.6, 0.12)
    return out


def exhibit_fx():
    out = np.zeros((secs(2.6), 2), np.float32)
    rv = whoosh(0.5, 200, 4000, 23)[::-1] * 0.6
    place(out, rv, 0)
    place(out, impact(False, 24) * 0.9, 0.45)
    place(out, bell(74, 1.6) * 0.35, 0.45)
    return out


def twist_fx():
    out = np.zeros((secs(4.0), 2), np.float32)
    place(out, impact(True, 25), 0)
    place(out, glitch_fx(0.4, 26) * 0.8, 0)
    place(out, swell(2.5, 27)[::-1] * 0.25, 0)
    return out


def block_fx(small=False, seed=28):
    d = 0.9 if small else 1.6
    x = thump(90 if small else 70, 40 if small else 30, d, 0.7, seed) + lp(noise(d, seed), 900) * env_ad(d, 0.002, 10) * 0.5
    return norm(reverb(stereo(softclip(x * 1.5, 1.2), 0, 0.3), 0.25, 1.8), 0.8 if small else 0.95)


def build_library():
    return {
        "whoosh": whoosh(0.8), "whoosh_soft": whoosh(0.7, 400, 2500, 31) * 0.6, "whoosh_up": whoosh(1.1, 200, 6000, 32),
        "impact": impact(False), "impact_big": impact(True), "braam": braam(False), "braam_soft": braam(True),
        "tick": tick(), "tick_soft": tick(2400, 0.02, 33) * 0.6, "pop": pop(), "node": node(), "chip": stamp_fx(34) * 0.5,
        "stair": stair(), "stamp": stamp_fx(), "typing": typing(), "counter": counter_fx(), "riser_short": riser(),
        "elevator": whoosh(0.9, 200, 5000, 35) * 0.8, "ding": bell(88), "marker": marker(), "paper": paper(),
        "scan": scan(), "clock_fast": clock_fast(), "flip_run": flip_run(), "fuse": fuse(), "glitch": glitch_fx(0.6, 36),
        "glitch_short": glitch_fx(0.3, 37), "rewind": rewind(), "split": split(), "inflate": inflate(),
        "dissolve": dissolve(), "lock": lock_fx(), "alert": alert(), "swell": swell(), "lens": lens_fx(),
        "exhibit": exhibit_fx(), "twist": twist_fx(), "block": block_fx(False), "block_small": block_fx(True),
    }


LEVEL = {  # per-type trim (linear)
    "impact": 0.55, "impact_big": 0.7, "braam": 0.65, "braam_soft": 0.45, "tick": 0.35, "tick_soft": 0.25,
    "pop": 0.3, "node": 0.3, "chip": 0.3, "stair": 0.45, "stamp": 0.5, "typing": 0.35, "counter": 0.3,
    "riser_short": 0.35, "elevator": 0.3, "ding": 0.25, "marker": 0.3, "paper": 0.35, "scan": 0.3,
    "clock_fast": 0.4, "flip_run": 0.45, "fuse": 0.35, "glitch": 0.35, "glitch_short": 0.3, "rewind": 0.45,
    "split": 0.45, "inflate": 0.35, "dissolve": 0.4, "lock": 0.45, "alert": 0.25, "swell": 0.35, "lens": 0.3,
    "exhibit": 0.5, "twist": 0.6, "block": 0.6, "block_small": 0.45, "whoosh": 0.35, "whoosh_soft": 0.25, "whoosh_up": 0.35,
}


def main():
    tl = json.loads((BUILD / "timeline.json").read_text())
    cues = json.loads((BUILD / "sfx_cues.json").read_text())
    lib = build_library()
    track = np.zeros((secs(tl["duration"]) + SR * 5, 2), np.float32)
    missing = set()
    for c in cues:
        s = lib.get(c["type"])
        if s is None:
            missing.add(c["type"])
            continue
        place(track, s, c["t"], LEVEL.get(c["type"], 0.4) * c.get("gain", 1.0))
    track = track[: secs(tl["duration"])]
    sf.write(BUILD / "sfx_track.wav", track, SR, subtype="FLOAT")
    print(f"sfx: {len(cues)} cues, peak {np.max(np.abs(track)):.2f}, missing {sorted(missing)}")


if __name__ == "__main__":
    main()
