"""Final mix: VO chain, music ducked under narration at the *phrase* level
(gaps shorter than 1.6 s are bridged, so the bed rides smoothly instead of
pumping between sentences), budgeted SFX, two-pass loudnorm to -14 LUFS."""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
from dsp import SR, reverb  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"
DUCK_DB, BRIDGE, ATTACK, RELEASE = -6.0, 1.6, 0.15, 0.9


def ff(*args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-y", *args], check=True, capture_output=True, text=True)


def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


def duck_curve():
    """Per-sample music gain (linear) from the narration line spans in the timeline."""
    tl = json.loads((BUILD / "timeline.json").read_text())
    n = int(tl["duration"] * SR)
    spans = sorted((l["start"], l["end"]) for l in tl["lines"].values())
    merged = []
    for a, b in spans:
        if merged and a - merged[-1][1] < BRIDGE:
            merged[-1][1] = max(merged[-1][1], b)
        else:
            merged.append([a, b])
    target = np.zeros(n, np.float32)
    for a, b in merged:
        target[int(a * SR):int(b * SR)] = 1.0
    # asymmetric one-pole smoothing: quick-ish attack, slow release
    out = np.empty_like(target)
    ka, kr = 1 - np.exp(-1 / (ATTACK * SR)), 1 - np.exp(-1 / (RELEASE * SR))
    # lead the attack slightly so the duck is in place when the voice starts
    lead = int(ATTACK * SR)
    target = np.concatenate([target[lead:], np.zeros(lead, np.float32)])
    v = 0.0
    for i in range(n):  # simple loop, ~10M samples: fast enough with numpy scalars
        t = target[i]
        v += (ka if t > v else kr) * (t - v)
        out[i] = v
    return (10 ** (DUCK_DB * out / 20)).astype(np.float32)


def main():
    tl = json.loads((BUILD / "timeline.json").read_text())
    n = int(tl["duration"] * SR)

    ff("-i", str(BUILD / "vo_track.wav"), "-af",
       "highpass=f=80,lowpass=f=15500,equalizer=f=230:t=q:w=1.2:g=-2.5,equalizer=f=3400:t=q:w=1.3:g=3,"
       "acompressor=threshold=-24dB:ratio=4:attack=3:release=120:makeup=3dB,asoftclip=type=tanh:threshold=0.95",
       "-ar", str(SR), "-ac", "1", "-c:a", "pcm_f32le", str(BUILD / "vo_proc.wav"))
    vo, _ = sf.read(BUILD / "vo_proc.wav", dtype="float32")
    vo = np.pad(vo, (0, max(0, n - len(vo))))[:n]
    vo *= 10 ** ((-18.5 - rms_db(vo[np.abs(vo) > 1e-3])) / 20)
    vo_st = reverb(np.stack([vo, vo], 1), wet=0.06, rt60=0.8, pre=0.01, bright=6000)[:n]

    mu, _ = sf.read(BUILD / "music.wav", dtype="float32", always_2d=True)
    mu = np.pad(mu, ((0, max(0, n - len(mu))), (0, 0)))[:n]
    mu *= 10 ** ((-23.0 - rms_db(mu)) / 20)
    mu *= duck_curve()[:, None]

    fx, _ = sf.read(BUILD / "sfx_track.wav", dtype="float32", always_2d=True)
    fx = np.pad(fx, ((0, max(0, n - len(fx))), (0, 0)))[:n]
    fx *= 0.5 / (np.max(np.abs(fx)) + 1e-9)

    mix = vo_st + mu + fx
    mix /= max(1.0, np.max(np.abs(mix)) / 0.95)
    sf.write(BUILD / "premaster.wav", mix, SR, subtype="FLOAT")

    target = "I=-14:TP=-1.5:LRA=11"
    p = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(BUILD / "premaster.wav"), "-af",
                        f"loudnorm={target}:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
    m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", p.stderr, re.S).group(0))
    ff("-i", str(BUILD / "premaster.wav"), "-af",
       f"loudnorm={target}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
       f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample={SR}",
       "-c:a", "pcm_s24le", str(BUILD / "master.wav"))
    print(f"premaster: I={m['input_i']} LUFS TP={m['input_tp']} -> master.wav (-14 LUFS)")


if __name__ == "__main__":
    main()
