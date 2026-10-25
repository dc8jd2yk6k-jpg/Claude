"""Original score v2 — one continuous piece, never silent.

D minor, 110 BPM, one chord per bar on a single chord timeline. A sustained
bed (synth pad + strings + sub) runs from the first frame to the final fade;
rhythmic layers (arp, kick, hats) are faded in and out with one-bar ramps,
and "drops" are filter dips rather than silences. Orchestral parts are MIDI
rendered with FluidSynth + MuseScore General; hybrid parts are numpy synths.
Accents are placed from the narration's word timestamps.
"""
import json
import subprocess
import sys
import tempfile
from collections import defaultdict
from pathlib import Path

import mido
import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
from dsp import (SR, bp, env_ad, hp, lp, midi_hz, noise, osc, place, reverb, secs, softclip,  # noqa: E402
                 stereo, supersaw, sweep_filter, t_axis)

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"
SF2 = "/usr/share/sounds/sf2/MuseScore_General_Full.sf2"

TL = json.loads((BUILD / "timeline.json").read_text())
DUR = TL["duration"]
BAR = 240.0 / TL["bpm"]
BEAT = BAR / 4
NBARS = int(round(DUR / BAR))
SEC = TL["sections"]


def S(i):
    return TL["lines"][i]["start"]


def E(i):
    return TL["lines"][i]["end"]


def at(i, phrase, nth=0):
    """Start time of `phrase` inside line i, from the TTS word timestamps."""
    norm = lambda w: "".join(c for c in w.lower() if c.isalnum() or c in "'-")  # noqa: E731
    q = [norm(w) for w in phrase.split()]
    ws = TL["lines"][i]["words"]
    seen = 0
    for k in range(len(ws) - len(q) + 1):
        if all(norm(ws[k + j][0]).startswith(q[j]) for j in range(len(q))):
            if seen == nth:
                return ws[k][1]
            seen += 1
    raise KeyError(f"{phrase!r} not in {i}")


def bar_of(t):
    return int(t // BAR)


def bar_t(b):
    return b * BAR


# ---------------------------------------------------------------- harmony
CH = {
    "Dm": (50, [0, 3, 7]), "Bb": (46, [0, 4, 7]), "F": (41, [0, 4, 7]), "C": (48, [0, 4, 7]),
    "Gm": (43, [0, 3, 7]), "A": (45, [0, 4, 7]), "Asus": (45, [0, 5, 7]), "Eb": (51, [0, 4, 7]),
}


def voicing(name, octave=0):
    r, iv = CH[name]
    r += 12 * octave
    return [r, r + iv[1], r + iv[2], r + 12]


def section_of(t):
    names = sorted(SEC, key=SEC.get)
    cur = names[0]
    for n in names:
        if t + 1e-6 >= (0 if n == "hook" else SEC[n]):
            cur = n
    return cur


B = bar_of
PROG = {}


def fill(b0, b1, seq):
    for k, b in enumerate(range(b0, b1)):
        PROG[b] = seq[k % len(seq)]


fill(0, B(SEC["strength"]), ["Dm", "Dm", "Bb", "Bb", "Gm", "A", "Asus"])
fill(B(SEC["strength"]), B(S("s7")), ["Dm", "Bb", "F", "C"])
fill(B(S("s7")), B(SEC["leak"]), ["Bb", "C", "Dm", "Bb", "C", "A"])
fill(B(SEC["leak"]), B(S("l6")), ["Dm", "Dm", "Bb", "A"])
fill(B(S("l6")), B(SEC["phantom"]), ["Gm", "A", "A"])
fill(B(SEC["phantom"]), B(S("p6")), ["Dm", "Gm", "C", "F"])
fill(B(S("p6")), B(S("p8")), ["Bb", "Gm", "A", "A"])
fill(B(S("p8")), B(S("p10")), ["Dm", "Bb", "Gm", "A"])
fill(B(S("p10")), B(SEC["bill"]), ["Asus", "A"])
fill(B(SEC["bill"]), B(S("b8")), ["Dm", "Dm", "Bb", "A"])
fill(B(S("b8")), B(SEC["verdict"]), ["Dm", "C", "Bb", "A"])
fill(B(SEC["verdict"]), B(S("v7")), ["Bb", "F", "C", "Dm"])
fill(B(S("v7")), 100, ["Bb", "C", "Dm", "Dm"])
fill(100, NBARS + 1, ["Bb", "F", "C", "Dm", "Dm", "Dm"])

# per-section layer levels (0..1); synth layers crossfade over one bar at boundaries
LEVELS = {  # pad, sub, arp, kick, hats
    "hook": (0.85, 0.9, 0.9, 0.8, 0.45),
    "strength": (0.7, 0.8, 1.0, 0.95, 0.75),
    "leak": (0.85, 0.95, 0.75, 0.6, 0.3),
    "phantom": (0.6, 0.6, 0.25, 0.5, 0.45),
    "bill": (0.85, 1.0, 0.7, 0.9, 0.55),
    "verdict": (0.8, 0.8, 0.85, 0.8, 0.6),
    "end": (0.9, 0.7, 0.5, 0.35, 0.25),
}
LAYERS = ["pad", "sub", "arp", "kick", "hats"]


def level_curve(layer):
    """Per-sample gain for a synth layer: section levels joined by one-bar ramps."""
    idx = LAYERS.index(layer)
    names = sorted(SEC, key=SEC.get)
    pts = []
    for n in names:
        t = 0.0 if n == "hook" else SEC[n]
        v = LEVELS[n][idx]
        pts += [(max(0.0, t - BAR / 2), None), (t + BAR / 2, v)]
    xs, ys, prev = [], [], LEVELS[names[0]][idx]
    for t, v in pts:
        xs.append(t)
        ys.append(prev if v is None else v)
        if v is not None:
            prev = v
    xs.append(DUR + 6)
    ys.append(prev)
    tt = np.arange(secs(DUR) + SR * 6) / SR
    g = np.interp(tt, xs, ys).astype(np.float32)
    if layer in ("arp", "kick", "hats"):  # strength builds as it goes
        a, b = SEC["strength"], SEC["leak"]
        ramp = np.clip((tt - a) / (b - a), 0, 1)
        g *= np.where((tt >= a) & (tt < b), 0.75 + 0.25 * ramp, 1.0).astype(np.float32)
    return g


# ---------------------------------------------------------------- MIDI side
INST = {
    "strings": (48, "strings"), "slow": (49, "strings"), "basses": (43, "strings"), "pizz": (45, "strings"),
    "horn": (60, "brass"), "brass": (61, "brass"), "trombone": (57, "brass"),
    "piano": (0, "keys"), "celesta": (8, "keys"), "glock": (9, "keys"),
    "choir": (52, "choir"), "oohs": (53, "choir"),
    "timp": (47, "perc"), "taiko": (116, "perc"), "drums": (None, "perc"),
}


class Score:
    def __init__(self):
        self.notes = defaultdict(list)

    def n(self, inst, t, d, p, v=80):
        if 0 <= t < DUR:
            self.notes[inst].append((t, max(0.04, min(d, DUR + 4 - t)), int(p), int(max(1, min(127, v)))))

    def chord(self, inst, t, d, ps, v=70):
        for p in ps:
            self.n(inst, t, d, p, v)

    def render(self, out_dir):
        stems, groups = {}, defaultdict(list)
        for inst in self.notes:
            groups[INST[inst][1]].append(inst)
        for g, insts in groups.items():
            mid = mido.MidiFile(ticks_per_beat=480)
            meta = mido.MidiTrack()
            meta.append(mido.MetaMessage("set_tempo", tempo=int(60e6 / TL["bpm"]), time=0))
            mid.tracks.append(meta)
            tps = 480 * TL["bpm"] / 60.0  # ticks per second
            ch_next = 0
            for inst in sorted(insts):
                prog = INST[inst][0]
                ch = 9 if prog is None else (ch_next if ch_next != 9 else 10)
                if prog is not None:
                    ch_next = ch + 1
                evs = []
                if prog is not None:
                    evs += [(0, mido.Message("program_change", program=prog, channel=ch)),
                            (0, mido.Message("control_change", control=91, value=0, channel=ch)),
                            (0, mido.Message("control_change", control=93, value=0, channel=ch))]
                for t, d, p, v in self.notes[inst]:
                    evs.append((int(t * tps), mido.Message("note_on", note=p, velocity=v, channel=ch)))
                    evs.append((int((t + d) * tps), mido.Message("note_off", note=p, velocity=0, channel=ch)))
                evs.sort(key=lambda e: (e[0], 0 if e[1].type == "note_off" else 1))
                tr, last = mido.MidiTrack(), 0
                for tick, msg in evs:
                    tr.append(msg.copy(time=tick - last))
                    last = tick
                mid.tracks.append(tr)
            mp, wp = Path(out_dir) / f"{g}.mid", Path(out_dir) / f"{g}.wav"
            mid.save(mp)
            subprocess.run(["fluidsynth", "-ni", "-q", "-R", "0", "-C", "0", "-g", "0.45", "-r", str(SR),
                            "-F", str(wp), SF2, str(mp)], check=True, stdout=subprocess.DEVNULL)
            x, _ = sf.read(wp, dtype="float32", always_2d=True)
            buf = np.zeros((secs(DUR) + SR * 6, 2), np.float32)
            buf[: min(len(x), len(buf))] = x[: len(buf)]
            stems[g] = buf
            print(f"  rendered {g:8s} ({', '.join(sorted(insts))})")
        return stems


# ---------------------------------------------------------------- synth side
N = secs(DUR) + SR * 6
ST = {k: np.zeros((N, 2), np.float32) for k in ["pad", "sub", "arp", "kick", "hats", "fx"]}
_cache = {}


def cached(key, fn):
    if key not in _cache:
        _cache[key] = fn()
    return _cache[key]


def pad_chord(t, d, notes, seed=0):
    """Long-attack, long-release pad; consecutive chords overlap so it never gaps."""
    def mk():
        x = sum(supersaw(midi_hz(m), d + 0.8, 5, 0.008, seed + i) for i, m in enumerate(notes)) / len(notes)
        x = lp(x, 1600)
        tt = t_axis(d + 0.8)
        e = np.minimum(1, tt / 0.35) * np.clip((d + 0.8 - tt) / 0.8, 0, 1)
        return stereo((x * e).astype(np.float32), 0, 0.9)
    place(ST["pad"], cached(("pad", tuple(notes), round(d, 3)), mk), t - 0.2, 0.2)


def sub_note(t, d, m):
    def mk():
        tt = t_axis(d + 0.3)
        x = osc(midi_hz(m), d + 0.3) * 0.8 + osc(midi_hz(m) * 2, d + 0.3) * 0.12
        e = np.minimum(1, tt / 0.06) * np.clip((d + 0.3 - tt) / 0.3, 0, 1)
        return stereo(softclip(x * e * 1.2, 1.1))
    place(ST["sub"], cached(("sub", m, round(d, 3)), mk), t - 0.05, 0.32)


def pluck(t, m, g=1.0, pan=0.0, cutoff=2400):
    def mk():
        d = 0.6
        x = supersaw(midi_hz(m), d, 3, 0.006, m) * np.exp(-t_axis(d) * 4.5)
        x = lp(x, cutoff) * np.minimum(1, t_axis(d) / 0.004)
        return x.astype(np.float32)
    place(ST["arp"], stereo(cached(("pl", m, cutoff), mk), pan), t, 0.26 * g)


def kick(t, g=1.0):
    def mk():
        d = 0.5
        f = 46 + 110 * np.exp(-t_axis(d) * 30)
        x = osc(f, d) * env_ad(d, 0.002, 6)
        c = hp(noise(0.012, 1), 2000) * env_ad(0.012, 0.0005, 6) * 0.25
        x[: len(c)] += c
        return stereo(softclip(x * 1.5, 1.3))
    place(ST["kick"], cached("kick", mk), t, 0.5 * g)


def hat(t, g=1.0, open_=False):
    def mk():
        d = 0.16 if open_ else 0.05
        return stereo(hp(noise(d, 7 if open_ else 8), 7500) * env_ad(d, 0.001, 6 if open_ else 14), 0.15, 0.2)
    place(ST["hats"], cached(("hat", open_), mk), t, 0.09 * g)


def swell_rev(t_end, d=1.6, g=1.0, seed=5):
    """Reverse-cymbal style swell ending exactly at t_end."""
    x = hp(noise(d, seed), 2500) * np.linspace(0, 1, secs(d)) ** 2.5
    place(ST["fx"], stereo(x.astype(np.float32), 0, 0.7), t_end - d, 0.16 * g)


def riser(t0, t1, g=1.0, seed=3):
    d = t1 - t0
    x = sweep_filter(noise(d, seed), 300, 7000, "bp", 48, 0.6) * np.linspace(0, 1, secs(d)) ** 2.2
    place(ST["fx"], stereo(x.astype(np.float32), 0, 0.6), t0, 0.16 * g)


# ======================================================================= CUES
sc = Score()
for b in range(NBARS + 1):
    t = bar_t(b)
    if t >= DUR:
        break
    name = PROG[b]
    sect = section_of(t + 0.01)
    root = CH[name][0]
    nxt = PROG.get(b + 1, name)
    # --- the continuous bed: pad, strings, sub, basses (always on, legato) ---
    pad_chord(t, BAR, voicing(name, 0)[1:] + [voicing(name, 1)[1]], seed=b % 3)
    sub_note(t, BAR, root - 12 if root >= 46 else root)
    sv = {"hook": 70, "strength": 66, "leak": 72, "phantom": 56, "bill": 80, "verdict": 76, "end": 74}[sect]
    # legato bed: each note ends just before the next bar so a repeated pitch is
    # never cut by the previous note's note-off (the soundfont release bridges it)
    sc.chord("slow", t, BAR - 0.01, voicing(name), sv)
    sc.n("basses", t, BAR - 0.01, root - 12, sv + 6)
    # --- arp (sustained plucks + delay later) ---
    patt = [0, 7, 12, 7, 15, 12, 19, 12] if sect != "leak" else [0, 12, 0, 13, 0, 12, 0, 10]
    step = BEAT / 2 if sect in ("hook", "strength", "verdict", "bill") else BEAT
    nsteps = int(round(BAR / step))
    for k in range(nsteps):
        rel = patt[k % len(patt)]
        rel = {15: 12 + CH[name][1][1], 19: 12 + CH[name][1][2]}.get(rel, rel)
        pluck(t + k * step, root + 12 + rel, 1.0 if k % 4 == 0 else 0.8, pan=0.3 * np.sin(k * 1.3))
    # --- drums ---
    if sect in ("hook", "strength", "verdict", "bill", "end"):
        for o in ([0, 2] if sect in ("hook", "end") else [0, 1, 2, 3]):
            kick(t + o * BEAT, 1.0 if o in (0, 2) else 0.7)
    elif sect == "leak":
        for o in [0, 0.75, 2, 2.75]:  # heartbeat feel
            kick(t + o * BEAT, 0.9 if o in (0, 2) else 0.55)
    else:  # phantom: light pulse
        for o in [0, 2]:
            kick(t + o * BEAT, 0.7)
    for k in range(8):
        hat(t + (k + 0.5) * BEAT / 2, 0.8 if k % 2 else 0.5, open_=(sect == "strength" and k % 4 == 3))
    # --- section colour ---
    if sect in ("strength", "verdict") and b % 2 == 0:
        sc.chord("brass", t, 2 * BAR - 0.05, voicing(name)[:3], 62 if sect == "strength" else 70)
    if sect == "bill":
        sc.chord("trombone", t, BAR - 0.05, [root - 12, root - 5], 78)
        for o, p in [(0, 45), (1.5, 41), (2, 45), (3, 41), (3.5, 41)]:
            sc.n("taiko", t + o * BEAT, 0.3, p, 92 if o in (0, 2) else 70)
    if sect == "phantom":
        for k in range(8):
            rel = [0, 7, 12, 7, 3 if CH[name][1][1] == 3 else 4, 7, 12, 15][k]
            sc.n("pizz", t + k * BEAT / 2, 0.25, root + 12 + rel, 74 if k % 4 == 0 else 60)
    if sect in ("verdict", "end", "hook"):
        sc.chord("choir", t, BAR - 0.01, voicing(name, 1)[:3], 46 if sect == "hook" else 58)

# main motif (piano / horn) — opens the strength chapter, returns for the verdict and end
MOTIF = [(0, 1, 69), (1, 1, 74), (2, 1, 76), (3, 1, 77), (4, 2, 77), (6, 1, 76), (7, 1, 74),
         (8, 2, 72), (10, 1, 69), (11, 1, 72), (12, 3, 76), (15, 1, 74)]


def motif(inst, t0, v=72, tr=0):
    for b_, l_, p in MOTIF:
        sc.n(inst, t0 + b_ * BEAT, l_ * BEAT * 0.95, p + tr, v)


for t0 in [SEC["strength"] + 4 * BAR, SEC["strength"] + 8 * BAR]:
    motif("horn", t0, 82)
for t0 in [SEC["verdict"], SEC["verdict"] + 4 * BAR, SEC["verdict"] + 8 * BAR]:
    motif("piano", t0, 70, 12)
motif("horn", bar_t(100), 84)
motif("piano", bar_t(100), 66, 12)

# accents on story beats (all continuous underneath)
HITS = [
    (at("h1", "eighty"), "big"), (E("h3") + 0.05, "title"), (at("s3", "eighty-x"), "mid"),
    (at("s8", "two trillion") + 0.9, "mid"), (at("l3", "eighty"), "big"), (at("p1", "seventy-two"), "mid"),
    (S("p7"), "swell"), (at("b1", "not so fast"), "mid"), (at("b6", "twenty-five"), "big"),
    (at("v7", "which one"), "swell"), (SEC["verdict"], "mid"),
]
for t, kind in HITS:
    if kind in ("big", "title"):
        sc.n("timp", t, 1.0, 38, 120)
        sc.chord("horn", t, 1.6, [38, 45, 50, 57], 112)
        sc.n("drums", t, 2.0, 49, 112)
        swell_rev(t, 1.4, 1.0)
        if kind == "title":
            sc.chord("oohs", t, 1.4, [62, 65, 69], 96)
    elif kind == "mid":
        sc.n("drums", t, 2.0, 49, 96)
        sc.n("timp", t, 0.6, 38, 96)
        swell_rev(t, 1.0, 0.7)
    else:
        swell_rev(t + 0.3, 2.0, 1.0)
        sc.chord("strings", t, 2.0, [62, 69, 74], 70)
for t in [at("b4", w) for w in ["google", "amazon", "microsoft", "nvidia", "broadcom-linked"]]:
    sc.n("taiko", t, 0.4, 41, 118)
    sc.n("timp", t, 0.4, 33, 100)
for t in [at("p4", "ten times"), at("p5", "nothing"), at("p9", "under")]:
    sc.n("celesta", t, 1.0, 86, 80)
    sc.n("glock", t, 0.8, 93, 55)
riser(at("s8", "two trillion") - 1.8, at("s8", "two trillion") + 0.9, 1.0, 11)
riser(SEC["phantom"] - 2.0, SEC["phantom"], 0.7, 12)
riser(at("v7", "the only") - 0.2, at("v7", "which one") + 0.4, 0.8, 13)

# filter dips instead of silences: (start, end, cutoff Hz)
DIPS = [
    (S("l6") + 0.9, SEC["phantom"] - 0.3, 500),
    (S("p10") - 0.1, SEC["bill"] - 0.2, 450),
    (S("b6") - 0.05, at("b6", "twenty-five") - 0.05, 380),
]


def dip_filter(x):
    """Smoothly lowpass a stereo stem inside the dip windows (bed keeps playing)."""
    y = x.copy()
    for a, b, f in DIPS:
        pad_ = 0.4
        i0, i1 = secs(max(0, a - pad_)), secs(b + pad_)
        seg = x[i0:i1]
        n = len(seg)
        filt = lp(seg, f, order=2)
        tt = np.arange(n) / SR
        w = np.clip(np.minimum(tt / pad_, (n / SR - tt) / pad_), 0, 1)[:, None]
        y[i0:i1] = seg * (1 - w) + filt * w
    return y


def dip_gain():
    g = np.ones(N, np.float32)
    tt = np.arange(N) / SR
    for a, b, _ in DIPS:
        w = np.clip(np.minimum((tt - a) / 0.4 + 1, (b - tt) / 0.4 + 1), 0, 1)
        g *= 1 - 0.55 * w
    return g


def main():
    with tempfile.TemporaryDirectory() as td:
        stems = sc.render(td)
    lvl = {"strings": 0.95, "brass": 0.7, "keys": 0.75, "choir": 0.5, "perc": 0.8}
    wet = {"strings": 0.4, "brass": 0.35, "keys": 0.35, "choir": 0.5, "perc": 0.3}
    out = np.zeros((N, 2), np.float32)
    for g, x in stems.items():
        y = reverb(x, wet=wet[g], rt60=2.4)[:N]
        out[: len(y)] += y * lvl[g]
    # tempo-synced delay on the arp keeps it from collapsing between notes
    arp = ST["arp"].copy()
    dly = secs(BEAT * 0.75)
    for k in range(1, 4):
        arp[dly * k:] += ST["arp"][: -dly * k] * (0.38 ** k)
    dg = dip_gain()[:, None]
    layers = {"pad": ST["pad"], "sub": ST["sub"], "arp": arp, "kick": ST["kick"], "hats": ST["hats"]}
    bright = np.zeros((N, 2), np.float32)
    for name, x in layers.items():
        g = level_curve(name)[:, None]
        if name in ("kick", "hats"):
            out += x * g * dg
        elif name == "sub":
            out += x * g
        else:
            bright += x * g
    bright = reverb(dip_filter(bright), wet=0.25, rt60=1.8)[:N]
    out += bright + reverb(ST["fx"], wet=0.3, rt60=2.0)[:N]
    out = out[: secs(DUR)]
    peak = np.max(np.abs(out))
    out = softclip(out / max(peak, 1e-9) * 1.15, 1.05) * 0.82
    fade = secs(3.0)
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    fi = secs(0.03)
    out[:fi] *= np.linspace(0, 1, fi)[:, None]
    sf.write(BUILD / "music.wav", out, SR, subtype="FLOAT")
    print(f"music.wav: {len(out) / SR:.1f}s, {NBARS} bars @ {TL['bpm']} BPM")


if __name__ == "__main__":
    main()
