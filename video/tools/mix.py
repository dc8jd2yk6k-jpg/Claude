"""Final mix: VO cleanup, music ducked under the narration, SFX, two-pass
loudness normalisation to -14 LUFS / -1.5 dBTP (streaming targets)."""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.ndimage import maximum_filter1d, uniform_filter1d

sys.path.insert(0, str(Path(__file__).parent))
from dsp import SR, reverb  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"


def ff(*args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-y", *args], check=True, capture_output=True, text=True)


def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


def main():
    tl = json.loads((BUILD / "timeline.json").read_text())
    n = int(tl["duration"] * SR)

    # 1) voice: high-pass, gentle compression, presence, de-mud
    ff("-i", str(BUILD / "vo_track.wav"), "-af",
       "highpass=f=75,lowpass=f=15500,equalizer=f=220:t=q:w=1.2:g=-2,equalizer=f=3200:t=q:w=1.4:g=2.5,"
       "acompressor=threshold=-22dB:ratio=3:attack=4:release=140:makeup=2dB",
       "-ar", str(SR), "-ac", "1", "-c:a", "pcm_f32le", str(BUILD / "vo_proc.wav"))
    vo, _ = sf.read(BUILD / "vo_proc.wav", dtype="float32")
    vo = np.pad(vo, (0, max(0, n - len(vo))))[:n]
    active = np.abs(vo) > 1e-3
    vo *= 10 ** ((-19.0 - rms_db(vo[active])) / 20)       # speech-active RMS -> -19 dBFS
    vo_st = np.stack([vo, vo], 1)
    vo_st = reverb(vo_st, wet=0.07, rt60=0.9, pre=0.01, bright=6000)[:n]

    # 2) music, ducked by the narration envelope
    mu, _ = sf.read(BUILD / "music.wav", dtype="float32", always_2d=True)
    mu = np.pad(mu, ((0, max(0, n - len(mu))), (0, 0)))[:n]
    mu *= 10 ** ((-22.5 - rms_db(mu)) / 20)
    env = np.abs(vo)
    env = maximum_filter1d(env, size=int(0.30 * SR))         # hold through short gaps
    env = uniform_filter1d(env, size=int(0.12 * SR))          # smooth attack / release
    speak = np.clip(env / 0.03, 0, 1)
    duck_db = -8.5 * speak
    mu *= (10 ** (duck_db / 20))[:, None]

    # 3) sound design
    fx, _ = sf.read(BUILD / "sfx_track.wav", dtype="float32", always_2d=True)
    fx = np.pad(fx, ((0, max(0, n - len(fx))), (0, 0)))[:n]
    fx *= 0.55 / (np.max(np.abs(fx)) + 1e-9)
    fx *= (10 ** ((-2.5 * speak) / 20))[:, None]              # tuck small effects slightly under speech

    mix = vo_st + mu + fx
    mix /= max(1.0, np.max(np.abs(mix)) / 0.95)
    sf.write(BUILD / "premaster.wav", mix, SR, subtype="FLOAT")

    # 4) two-pass loudnorm
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
