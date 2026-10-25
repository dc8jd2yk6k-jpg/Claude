"""Audio QC: fails the build if the music cuts out, the mix pumps, sound
effects repeat too much, or loudness is off. Prints v1-vs-v2 numbers."""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
from mix import duck_curve  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"
# measured on v1 (commit 35b77aa) with the same methods as the "v1-method" rows below;
# v1 had 10 dropouts including its final fade, 9 excluding it (v2 excludes the fade too)
V1 = {"dropouts (v1 method: >=0.5s, >18dB)": 9, "abrupt drops (v1 method: >15dB/0.25s)": 134,
      "sfx per minute": 19.1, "big hits": 5}


def rms_db(x, win):
    h = int(win * 48000)
    n = len(x) // h
    return 20 * np.log10(np.sqrt((x[: n * h].reshape(n, h) ** 2).mean(1)) + 1e-9)


def main():
    tl = json.loads((BUILD / "timeline.json").read_text())
    dur = tl["duration"]
    fails, rep = [], {}

    m, sr = sf.read(BUILD / "music.wav", dtype="float32", always_2d=True)
    x = m.mean(1)
    body = slice(int(0.5 * sr), int((dur - 3.5) * sr))
    r5 = rms_db(x[body], 0.5)
    med = np.median(r5)
    drops = int(np.sum(r5 < med - 12))
    r25 = rms_db(x[body], 0.25)
    abrupt = int(np.sum(np.diff(r25) < -8))
    # the same measurements used to diagnose v1
    r25all = rms_db(x, 0.25)
    med_all = np.median(r25all)
    low = r25all < med_all - 18
    runs, i = 0, 0
    while i < len(low) - int(3.5 / 0.25):
        if low[i]:
            j = i
            while j < len(low) and low[j]:
                j += 1
            runs += (j - i) * 0.25 >= 0.5
            i = j
        else:
            i += 1
    rep["dropouts (v1 method: >=0.5s, >18dB)"] = int(runs)
    rep["abrupt drops (v1 method: >15dB/0.25s)"] = int(np.sum(np.diff(r25all[: -int(3.5 / 0.25)]) < -15))
    rep["strict: windows >12dB below median"], rep["strict: drops >8dB/0.25s"] = drops, abrupt
    if drops:
        fails.append(f"music has {drops} half-second windows >12 dB below its median")
    if abrupt:
        fails.append(f"music has {abrupt} drops >8 dB within 0.25 s")

    g = duck_curve()
    d = np.sign(np.diff(g[:: sr // 50]))  # 50 Hz
    d = d[d != 0]
    turns = int(np.sum(d[1:] != d[:-1])) if len(d) > 1 else 0
    rep["duck direction changes / 4s"] = round(turns / (dur / 4), 2)
    if turns / (dur / 4) > 1.0:
        fails.append(f"ducking changes direction {turns} times (pumping)")

    used = json.loads((BUILD / "sfx_used.json").read_text())
    per_min = len(used) / (dur / 60)
    big = sum(u["type"] == "impact_big" for u in used)
    reuse = 0
    last = {}
    for u in used:
        k = (u["type"], u["variant"])
        if k in last and u["t"] - last[k] < 30:
            reuse += 1
        last[k] = u["t"]
    rep["sfx per minute"], rep["identical sfx reuse < 30s"], rep["big hits"] = round(per_min, 1), reuse, big
    if per_min > 6.5 or big > 3 or reuse:
        fails.append("sfx budget broken")

    master = BUILD / "master.wav"
    if master.exists():
        p = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(master), "-af", "ebur128=peak=true", "-f", "null", "-"],
                           capture_output=True, text=True).stderr
        summ = p[p.rfind("Summary:"):]
        lufs = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summ).group(1))
        tp = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summ).group(1))
        rep["integrated LUFS"], rep["true peak dBTP"] = lufs, tp
        if abs(lufs + 14) > 0.5 or tp > -1.0:
            fails.append(f"loudness {lufs} LUFS / {tp} dBTP out of spec")

    print(f"{'metric':32s} {'v1':>8s} {'v2':>8s}")
    for k, v in rep.items():
        print(f"{k:32s} {str(V1.get(k, '')):>8s} {str(v):>8s}")
    if fails:
        print("\nQC FAILED:\n  " + "\n  ".join(fails))
        sys.exit(1)
    print("\nQC PASSED")


if __name__ == "__main__":
    main()
