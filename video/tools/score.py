"""Original score, composed in code.

Orchestral layers are written as MIDI (mido) and rendered with FluidSynth +
the MuseScore General soundfont; hybrid layers (pulses, kicks, risers, drones,
Shepard tones, ticks) are synthesized with numpy. Every cue is placed from the
narration timeline, so musical hits land on the story beats.
D minor, 120 BPM: one bar = 2 s, matching the bar-snapped chapter starts.
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
from dsp import (SR, bp, env_ad, env_adsr, hp, lp, midi_hz, noise, norm, osc, place, reverb, secs, softclip,  # noqa: E402
                 stereo, supersaw, sweep_filter, t_axis)

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"
SF2 = "/usr/share/sounds/sf2/MuseScore_General_Full.sf2"
BEAT, BAR = 0.5, 2.0

TL = json.loads((BUILD / "timeline.json").read_text())
DUR = TL["duration"]


def S(i):
    return TL["lines"][i]["start"]


def E(i):
    return TL["lines"][i]["end"]


def at(i, word, nth=0):
    """Same estimate the visuals use (engine.js `at`)."""
    l = TL["lines"][i]
    s = l["say"].lower()
    idx, frm = -1, 0
    for _ in range(nth + 1):
        idx = s.index(word.lower(), frm)
        frm = idx + 1

    def w(k):
        c = s[k]
        if c == "." and k + 1 < len(s) and s[k + 1] == ".":
            return 3
        if c in ".?!":
            return 9
        if c in ",:;":
            return 5
        return 1

    tot = sum(w(k) for k in range(len(s)))
    bef = sum(w(k) for k in range(idx))
    return l["start"] + 0.04 + (l["dur"] - 0.12) * bef / tot


SEC = TL["sections"]

# ------------------------------------------------------------------ harmony
CHORDS = {
    "Dm": (50, [0, 3, 7]), "Bb": (46, [0, 4, 7]), "F": (41, [0, 4, 7]), "C": (48, [0, 4, 7]),
    "Gm": (43, [0, 3, 7]), "A": (45, [0, 4, 7]), "Eb": (51, [0, 4, 7]), "Am": (45, [0, 3, 7]),
    "Dsus": (50, [0, 2, 7]), "A7": (45, [0, 4, 10]),
}


def voicing(name, oct_shift=0):
    root, iv = CHORDS[name]
    r = root + 12 * oct_shift
    return [r, r + iv[1], r + iv[2], r + 12, r + 12 + iv[1]]


# ------------------------------------------------------------------ MIDI side
INST = {  # name: (program, group)
    "strings": (48, "strings"), "slow": (49, "strings"), "trem": (44, "strings"), "pizz": (45, "strings"),
    "cello": (42, "strings"), "basses": (43, "strings"),
    "horn": (60, "brass"), "brass": (61, "brass"), "trombone": (57, "brass"), "tuba": (58, "brass"),
    "piano": (0, "keys"), "celesta": (8, "keys"), "glock": (9, "keys"), "marimba": (12, "keys"), "harp": (46, "keys"),
    "choir": (52, "choir"),
    "timp": (47, "perc"), "taiko": (116, "perc"), "drums": (None, "perc"),
}


class Score:
    def __init__(self):
        self.notes = defaultdict(list)  # inst -> [(t, d, pitch, vel)]
        self.ccs = defaultdict(list)    # inst -> [(t, cc, val)]

    def n(self, inst, t, d, p, v=80):
        if t < 0 or t >= DUR:
            return
        self.notes[inst].append((t, max(0.03, d), int(p), int(max(1, min(127, v)))))

    def chord(self, inst, t, d, ps, v=70):
        for p in ps:
            self.n(inst, t, d, p, v)

    def ramp(self, inst, t0, t1, v0, v1, cc=11, steps=24):
        for k in range(steps + 1):
            u = k / steps
            self.ccs[inst].append((t0 + (t1 - t0) * u, cc, int(v0 + (v1 - v0) * u)))
        self.ccs[inst].append((t1 + 0.05, cc, 100))  # back to the default expression

    def render(self, out_dir):
        stems = {}
        groups = defaultdict(list)
        for inst in set(self.notes) | set(self.ccs):
            groups[INST[inst][1]].append(inst)
        for g, insts in groups.items():
            mid = mido.MidiFile(ticks_per_beat=480)
            meta = mido.MidiTrack()
            meta.append(mido.MetaMessage("set_tempo", tempo=500000, time=0))
            mid.tracks.append(meta)
            ch_next = 0
            for inst in sorted(insts):
                prog = INST[inst][0]
                if prog is None:
                    ch = 9
                else:
                    ch = ch_next if ch_next != 9 else 10
                    ch_next = ch + 1
                evs = []
                if prog is not None:
                    evs.append((0, mido.Message("program_change", program=prog, channel=ch)))
                    evs.append((0, mido.Message("control_change", control=11, value=100, channel=ch)))
                    evs.append((0, mido.Message("control_change", control=91, value=0, channel=ch)))
                    evs.append((0, mido.Message("control_change", control=93, value=0, channel=ch)))
                for t, d, p, v in self.notes[inst]:
                    evs.append((int(t * 960), mido.Message("note_on", note=p, velocity=v, channel=ch)))
                    evs.append((int((t + d) * 960), mido.Message("note_off", note=p, velocity=0, channel=ch)))
                for t, cc, val in self.ccs[inst]:
                    evs.append((int(t * 960), mido.Message("control_change", control=cc, value=max(0, min(127, val)), channel=ch)))
                evs.sort(key=lambda e: (e[0], 0 if e[1].type == "note_off" else 1))
                tr = mido.MidiTrack()
                last = 0
                for tick, msg in evs:
                    tr.append(msg.copy(time=tick - last))
                    last = tick
                mid.tracks.append(tr)
            mp = Path(out_dir) / f"{g}.mid"
            wp = Path(out_dir) / f"{g}.wav"
            mid.save(mp)
            subprocess.run(["fluidsynth", "-ni", "-q", "-R", "0", "-C", "0", "-g", "0.45", "-r", str(SR),
                            "-F", str(wp), SF2, str(mp)], check=True, stdout=subprocess.DEVNULL)
            x, sr = sf.read(wp, dtype="float32", always_2d=True)
            assert sr == SR
            buf = np.zeros((secs(DUR) + SR * 6, 2), np.float32)
            n = min(len(x), len(buf))
            buf[:n] = x[:n]
            stems[g] = buf
            print(f"  rendered {g:8s} ({', '.join(sorted(insts))})")
        return stems


# ------------------------------------------------------------------ synth side
SYN = np.zeros((secs(DUR) + SR * 6, 2), np.float32)   # hybrid layers (reverbed lightly)
LOW = np.zeros((secs(DUR) + SR * 6, 2), np.float32)   # kicks / sub / drones (dry)
_cache = {}


def cached(key, fn):
    if key not in _cache:
        _cache[key] = fn()
    return _cache[key]


def kick(t, g=1.0):
    def mk():
        d = 0.5
        tt = t_axis(d)
        f = 45 + 110 * np.exp(-tt * 30)
        x = osc(f, d) * env_ad(d, 0.002, 7)
        c = hp(noise(0.012, 1), 2000) * env_ad(0.012, 0.0005, 6) * 0.25
        x[: len(c)] += c
        x = softclip(x * 1.6, 1.4)
        return stereo(x)
    place(LOW, cached("kick", mk), t, 0.55 * g)


def hat(t, g=1.0, open_=False):
    def mk():
        d = 0.18 if open_ else 0.05
        x = hp(noise(d, 7 if open_ else 8), 7000) * env_ad(d, 0.001, 6 if open_ else 14)
        return stereo(x, 0.15, 0.2)
    place(SYN, cached(("hat", open_), mk), t, 0.10 * g)


def clap(t, g=1.0):
    def mk():
        d = 0.35
        x = np.zeros(secs(d), np.float32)
        for k, o in enumerate([0, 0.011, 0.022]):
            b = bp(noise(0.25, 30 + k), 900, 4000) * env_ad(0.25, 0.001, 14 if k < 2 else 8)
            x[secs(o): secs(o) + len(b)] += b[: len(x) - secs(o)]
        return stereo(x, 0, 0.4)
    place(SYN, cached("clap", mk), t, 0.22 * g)


def pluck(t, m, d=0.24, cutoff=1500, g=1.0, pan=0.0):
    cb = int(round(cutoff / 250) * 250)

    def mk():
        x = supersaw(midi_hz(m), d, 3, 0.006, m) * env_ad(d, 0.002, 7)
        tt = t_axis(d)
        y = lp(x * np.exp(-tt * 10), cb) + lp(x, cb * 0.35) * 0.4
        return y.astype(np.float32)
    x = cached(("pluck", m, round(d, 3), cb), mk)
    place(SYN, stereo(x, pan), t, 0.32 * g)


def subbass(t, m, d, g=1.0):
    def mk():
        x = supersaw(midi_hz(m), d, 3, 0.004, m) * 0.6 + osc(midi_hz(m), d) * 0.6
        x = lp(x, 420) * env_adsr(d, 0.01, 0.05, 0.85, 0.08)
        return stereo(softclip(x * 1.3, 1.2))
    place(LOW, cached(("sub", m, round(d, 3)), mk), t, 0.30 * g)


def drone(t0, t1, m, g=1.0, cutoff=500, glide_to=None):
    d = t1 - t0
    f = midi_hz(m)
    if glide_to is not None:
        tt = t_axis(d)
        f = f * (glide_to ** (tt / d))
    x = supersaw(f, d, 5, 0.006, 5) * 0.5 + osc(f / 2 if np.ndim(f) == 0 else f / 2, d) * 0.5
    x = lp(x, cutoff)
    fade = min(2.0, d / 3)
    e = np.minimum(1, np.minimum(t_axis(d) / fade, (d - t_axis(d)) / fade))
    place(LOW, stereo(x * e, 0, 0.6), t0, 0.22 * g)


def riser(t0, t1, g=1.0, seed=3):
    d = t1 - t0
    n = noise(d, seed)
    x = sweep_filter(n, 250, 8000, "bp", 64, 0.6) * np.linspace(0, 1, secs(d)) ** 2.2
    tt = t_axis(d)
    tone = lp(osc(70 * 2 ** (4 * (tt / d) ** 1.6), d, "saw"), 5000) * np.linspace(0, 1, secs(d)) ** 3 * 0.3
    place(SYN, stereo((x + tone).astype(np.float32), 0, 0.6), t0, 0.32 * g)


def shepard(t0, t1, g=1.0, rate=0.1):
    d = t1 - t0
    tt = t_axis(d)
    out = np.zeros(len(tt), np.float32)
    for k in range(8):
        pos = (k / 8 + rate * tt) % 1.0          # position in 8-octave window
        f = 40 * 2 ** (pos * 7)
        amp = np.exp(-((pos - 0.5) ** 2) / 0.04)
        ph = np.cumsum(f) / SR
        out += (np.sin(2 * np.pi * ph) * amp).astype(np.float32)
    out *= np.minimum(1, np.minimum(tt / 2, (d - tt) / 0.5)) * np.linspace(0.4, 1, len(tt))
    place(SYN, stereo(out / 4, 0, 0.5), t0, 0.35 * g)


def tick(t, hi=True, g=1.0):
    def mk(h=hi):
        d = 0.03
        x = bp(noise(d, 40 + h), 1800 if h else 1200, 5000 if h else 3000) * env_ad(d, 0.0005, 16)
        return stereo(x, 0.2 if h else -0.2)
    place(SYN, cached(("tick", hi), mk), t, 0.16 * g)


def heartbeat(t, g=1.0):
    def mk():
        d = 0.5
        out = np.zeros(secs(d), np.float32)
        for o, a in [(0, 1.0), (0.18, 0.7)]:
            tt = t_axis(0.25)
            b = osc(55 + 40 * np.exp(-tt * 25), 0.25) * env_ad(0.25, 0.004, 9) * a
            out[secs(o): secs(o) + len(b)] += b[: len(out) - secs(o)]
        return stereo(lp(out, 300))
    place(LOW, cached("hb", mk), t, 0.6 * g)


def pad(t0, t1, notes, g=1.0, cutoff=1800, seed=11):
    d = t1 - t0
    x = sum(supersaw(midi_hz(m), d, 5, 0.008, seed + i) for i, m in enumerate(notes)) / len(notes)
    x = lp(x, cutoff)
    fade = min(1.5, d / 3)
    tt = t_axis(d)
    x *= np.minimum(1, np.minimum(tt / fade, (d - tt) / fade))
    place(SYN, stereo(x.astype(np.float32), 0, 0.9), t0, 0.16 * g)


def grid(t):
    return round(t / BAR) * BAR


def bars(t0, t1):
    t = np.ceil((t0 - 1e-6) / BAR) * BAR
    while t < t1 - 1e-6:
        yield float(t)
        t += BAR


def prog_at(progression, t, t0):
    k = int((t - t0 + 1e-6) // BAR) % len(progression)
    return progression[k]


ARP = [0, 7, 12, 7, 15, 12, 19, 12, 0, 7, 12, 19, 15, 12, 7, 12]


def arp_bar(t, name, cutoff, g=1.0, octave=0, pattern=ARP, step=0.125):
    root, iv = CHORDS[name]
    third = iv[1]
    for k in range(int(BAR / step)):
        rel = pattern[k % len(pattern)]
        rel = {15: 12 + third, 3: third, 4: third, 19: 19 if iv[2] == 7 else 12 + iv[2]}.get(rel, rel)
        pluck(t + k * step, root + 12 + rel + 12 * octave, 0.22, cutoff, g * (1.0 if k % 4 == 0 else 0.75), pan=0.25 * np.sin(k))


# ===================================================================== CUES
sc = Score()
MAIN = ["Dm", "Bb", "F", "C"]
EPIC = ["Bb", "F", "C", "Dm"]
MOTIF = [(0, 1, 69), (1, 1, 74), (2, 1, 76), (3, 1, 77), (4, 2, 77), (6, 1, 76), (7, 1, 74),
         (8, 2, 72), (10, 1, 69), (11, 1, 72), (12, 3, 76), (15, 1, 74)]  # beats, length, pitch


def motif(inst, t0, v=80, transpose=0, legato=1.0):
    for b, l, p in MOTIF:
        sc.n(inst, t0 + b * BEAT, l * BEAT * legato, p + transpose, v)


def strings_chords(t0, t1, progression, v=60, inst="strings", oct_shift=0, start=None):
    start = t0 if start is None else start
    for t in bars(t0, t1):
        name = prog_at(progression, t, start)
        sc.chord(inst, t, BAR * 0.98, voicing(name, oct_shift), v)


# ---------------------------------------------------------------- 0. OPEN
T_LOSS = at("o4", "eighty") - 0.15
T_REW = S("o5") + 0.05
T_TITLE = E("o5") + 0.3
for k in range(1, int(T_LOSS / 0.5)):
    tick(k * 0.5, k % 2 == 0, 0.8 if k * 0.5 < 17 else 1.2)
drone(0.0, T_LOSS + 0.1, 38, 0.8, cutoff=380)
pad(1.0, T_LOSS, [50, 57, 62], 0.5, cutoff=900)
for i, (dt, p) in enumerate([(0.3, 74), (1.3, 69), (2.3, 65), (3.3, 64), (4.3, 62)]):
    sc.n("piano", S("o2") + dt, 1.4, p, 52)
T80 = at("o2", "eighty")
sc.chord("piano", T80, 3.0, [38, 50], 80)
sc.chord("slow", T80, 4.0, [50, 57, 62, 64, 69], 62)
sc.ramp("slow", T80, T80 + 3.0, 60, 110)
for k in range(int((T_LOSS - S("o3")) / 0.25)):  # nervous low pulse under the month flipper
    t = S("o3") + k * 0.25
    sc.n("basses", t, 0.2, 38, 50 + int(40 * k / ((T_LOSS - S("o3")) / 0.25)))
riser(S("o3") + 0.5, T_LOSS, 0.6)
# after the slam: sub + dissonant tremolo
drone(T_LOSS, T_REW + 0.3, 26, 1.2, cutoff=200)
sc.chord("trem", T_LOSS + 0.3, T_REW - T_LOSS, [50, 51, 57], 40)
# rewind: everything pitch-drops (drone glide) then silence; riser into the title
drone(T_REW, T_REW + 1.2, 38, 0.8, cutoff=500, glide_to=0.25)
riser(T_TITLE - 2.6, T_TITLE, 1.0, seed=8)
# title: big Dm
for inst, ps, v in [("strings", voicing("Dm", 0) + [74], 95), ("brass", [50, 57, 62, 65], 90), ("choir", [62, 65, 69, 74], 80),
                    ("basses", [26, 38], 100), ("timp", [38], 110)]:
    sc.chord(inst, T_TITLE, 5.0, ps, v)
sc.ramp("strings", T_TITLE, T_TITLE + 5.0, 110, 70)
for k in range(24):  # timpani roll into chapter 1
    sc.n("timp", SEC["ch1"] - 2.0 + k * (2.0 / 24), 0.1, 38, 50 + k * 3)
kick(T_TITLE, 1.4)
drone(T_TITLE, SEC["ch1"] + 0.5, 38, 0.8, cutoff=700)

# ---------------------------------------------------------------- 1. ASCENT
C1, C1_END = SEC["ch1"], E("c1_25") + 1.9
EX = [S("c1_0"), S("c1_6"), S("c1_9"), S("c1_14"), S("c1_18"), S("c1_20")]
EX = [grid(e) for e in EX]
ELEV = EX[5]
for t in EX:
    sc.n("drums", t, 1.5, 49, 100)   # crash on every exhibit
for t in bars(C1, ELEV):
    name = prog_at(MAIN, t, C1)
    u = (t - C1) / (ELEV - C1)
    cutoff = 900 + 2600 * u
    breakdown = EX[4] <= t < ELEV
    arp_bar(t, name, cutoff * (0.6 if breakdown else 1.0), 0.8 if breakdown else 1.0)
    root = CHORDS[name][0]
    # strings pad all the way, growing
    v = int(50 + 35 * u)
    sc.chord("strings", t, BAR * 0.98, voicing(name), v)
    if t >= EX[2]:
        sc.chord("slow", t, BAR * 0.98, voicing(name, 1)[:3], v - 10)
    if not breakdown:
        # kick: half-time until exhibit 3, then four on the floor
        hits = [0, 1.0] if t < EX[2] else [0, 0.5, 1.0, 1.5]
        for o in hits:
            kick(t + o, 0.9 if o in (0, 1.0) else 0.6)
        if t >= EX[1]:
            for o in np.arange(0.25, 2.0, 0.5):
                hat(t + o, 0.9)
            for o in [0, 0.75, 1.0, 1.5]:
                subbass(t + o, root - 12 if root >= 48 else root, 0.24 if o else 0.45, 0.9)
        if t >= EX[3]:
            for o in np.arange(0.125, 2.0, 0.25):
                hat(t + o, 0.45)
        if EX[2] <= t < EX[3]:
            clap(t + 1.0, 1.0)
        elif t >= EX[3]:
            clap(t + 0.5, 0.9)
            clap(t + 1.5, 0.9)
        if t >= EX[2]:
            sc.chord("brass", t, BAR * 0.95, voicing(name)[:3], 55 + int(25 * u))
        if t >= EX[3]:
            sc.chord("choir", t, BAR * 0.98, voicing(name, 1)[:3], 60)
            sc.chord("basses", t, BAR * 0.98, [root - 12], 80)
# the heroic melody in exhibit 4, answered in exhibit 5 by the piano
for t0 in np.arange(EX[3], EX[4] - 7.9, 8.0):
    motif("horn", t0, 92)
    motif("strings", t0, 70, 12)
for t0 in np.arange(EX[4], ELEV - 7.9, 8.0):
    motif("piano", t0, 70, 12, legato=0.9)
riser(ELEV - 3.0, ELEV, 0.8)
for k in range(16):
    sc.n("drums", ELEV - 2.0 + k * 0.125, 0.1, 38, 50 + k * 4)
# the elevator: rising harmony, every stop a hit
STOPS = [at("c1_21", "sixty"), at("c1_22", "one eighty"), at("c1_23", "three eighty"), at("c1_24", "nine hundred")]
Q2T = at("c1_25", "two trillion") + 1.0
ELEV_PROG = [(ELEV, "Dm"), (grid(STOPS[0]) - 0.0, "Bb"), (grid(STOPS[1]), "F"), (grid(STOPS[2]), "C"),
             (grid(STOPS[3]), "Dm"), (grid(STOPS[3]) + 2, "Bb"), (grid(Q2T) - 2, "C"), (grid(Q2T), "A")]
for t in bars(ELEV, C1_END):
    name = "Dm"
    for t_, n_ in ELEV_PROG:
        if t >= t_ - 1e-6:
            name = n_
    arp_bar(t, name, 4200, 1.0, octave=0)
    sc.chord("strings", t, BAR * 0.98, voicing(name), 90)
    sc.chord("brass", t, BAR * 0.95, voicing(name)[:4], 88)
    sc.chord("choir", t, BAR * 0.98, voicing(name, 1)[:3], 75)
    sc.chord("basses", t, BAR * 0.98, [CHORDS[name][0] - 12], 95)
    for o in [0, 0.5, 1.0, 1.5]:
        kick(t + o, 1.0)
    for o in np.arange(0.25, 2.0, 0.5):
        hat(t + o, 1.0, open_=True)
    clap(t + 0.5)
    clap(t + 1.5)
for s_ in STOPS:
    sc.n("drums", s_, 1.5, 49, 105)
    sc.n("timp", s_, 0.5, 38, 110)
riser(STOPS[3] + 0.5, Q2T, 1.2, seed=12)
for k in range(32):
    sc.n("drums", Q2T - 4 + k * 0.125, 0.1, 38, 40 + k * 2)
kick(Q2T, 1.6)
sc.chord("brass", Q2T, C1_END - Q2T, [45, 52, 57, 61, 64], 115)
sc.chord("strings", Q2T, C1_END - Q2T, [45, 52, 57, 61, 64, 69], 110)
sc.n("timp", Q2T, 0.8, 33, 127)

# ---------------------------------------------------------------- 2. THE LEAK
C2 = SEC["ch2"]
T_DOC = C2 - 2.4
T_LOSS2 = at("c2_2", "eighty") - 0.1
T_MATH = S("c2_4") - 0.1
T_CAL = S("c2_7") - 0.1
T_STAMP = at("c2_7", "valentine") + 0.05
T_RB = S("c2_8") - 0.15
T_TW1 = SEC["ch3"] - 2.5
drone(T_DOC, T_MATH + 1, 26, 1.0, cutoff=220)
for t in np.arange(C2 - 1.0, T_MATH, 1.0):
    heartbeat(t, 0.8)
sc.chord("slow", C2, T_LOSS2 - C2, [50, 57], 35)
sc.chord("trem", T_LOSS2 + 0.2, T_MATH - T_LOSS2, [50, 51, 57, 58], 55)
sc.ramp("trem", T_LOSS2 + 0.2, T_LOSS2 + 3.5, 30, 110)
sc.chord("basses", T_LOSS2, 3.0, [26], 110)
sc.n("timp", T_LOSS2, 1.0, 38, 120)
# scary math: ticking, semitone ostinato, building
for t in bars(T_MATH, T_CAL):
    u = (t - T_MATH) / (T_CAL - T_MATH)
    alt = int((t - T_MATH) // BAR) % 2
    for k in range(16):
        subbass(t + k * 0.125, 38 + (1 if alt and k >= 8 else 0), 0.11, 0.7 + 0.4 * u)
        if k % 2 == 0:
            tick(t + k * 0.125, k % 4 == 0, 1.0 + u)
    for o in [0, 1.0]:
        kick(t + o, 0.8)
    sc.chord("strings", t, BAR * 0.98, [50, 51 + alt * 0, 57] if not alt else [51, 55, 58], int(55 + 40 * u))
riser(T_CAL - 0.2, T_STAMP, 1.0, seed=14)
for t in np.arange(T_CAL, T_STAMP, 0.25):
    kick(t, 0.5 + 0.5 * (t - T_CAL) / (T_STAMP - T_CAL))
sc.chord("brass", T_STAMP, 2.5, [38, 45, 50, 51], 120)
sc.chord("strings", T_STAMP, 2.5, [50, 51, 57, 58, 62], 115)
kick(T_STAMP, 1.6)
pad(T_RB, T_TW1, [50, 52, 57, 58], 0.9, cutoff=1200)
sc.chord("trem", T_RB + 0.3, T_TW1 - T_RB - 0.3, [62, 64, 69], 50)

# ---------------------------------------------------------------- 3. THE PHANTOM
C3 = SEC["ch3"]
P_SCALE, P_LINE, P_MIRROR = S("c3_7") - 0.1, S("c3_9") - 0.1, S("c3_10") - 0.1
P_CB, P_STRIP, P_FAKE = S("c3_13") - 0.1, S("c3_14") - 0.1, S("c3_15") - 0.1
PH = ["Dm", "Gm", "A", "Dm"]
PIZZ = [0, 7, 12, 7, 3, 7, 12, 15]
sc.chord("choir", C3 - 2.2, 3.0, [62, 65, 69], 55)
for t in bars(C3, P_FAKE):
    name = prog_at(PH if t < P_MIRROR else ["Dm", "Bb", "Gm", "A"], t, C3)
    root, iv = CHORDS[name]
    if P_LINE <= t < P_MIRROR:
        continue
    dense = t >= P_MIRROR and t < P_CB
    step = 0.125 if dense else 0.25
    for k in range(int(BAR / step)):
        rel = PIZZ[k % len(PIZZ)]
        rel = {3: iv[1], 15: 12 + iv[1]}.get(rel, rel)
        sc.n("pizz", t + k * step, 0.2, root + 12 + rel, 72 if k % 4 == 0 else 58)
    sc.n("basses", t, BAR * 0.9, root - 12 if root > 47 else root, 60)
    kick(t, 0.6)
    if S("c3_3") <= t < P_SCALE:
        for k in range(8):
            sc.n("marimba", t + k * 0.25, 0.2, voicing(name, 1)[k % 3] + (12 if k % 4 == 3 else 0), 55)
        for o in np.arange(0.125, 2.0, 0.25):
            hat(t + o, 0.35)
    if t >= P_SCALE:
        u = (t - P_SCALE) / (P_LINE - P_SCALE) if t < P_LINE else 0.6
        sc.chord("strings", t, BAR * 0.98, voicing(name), int(50 + 45 * min(u, 1)))
        sc.n("timp", t, 0.3, CHORDS[name][0] - 12 if CHORDS[name][0] > 45 else CHORDS[name][0], int(60 + 50 * min(u, 1)))
        if t < P_LINE:
            kick(t + 1.0, 0.6)
    if dense:
        for o in [0.5, 1.5]:
            clap(t + o, 0.6)
        for o in np.arange(0.25, 2.0, 0.5):
            hat(t + o, 0.6)
for t, p in [(at("c3_1", "seventy-two"), 86), (at("c3_1", "not one dollar"), 81), (at("c3_4", "ten times"), 93),
             (at("c3_5", "a hundred"), 98), (at("c3_6", "spend"), 74)]:
    sc.n("celesta", t, 1.0, p, 80)
    sc.n("glock", t, 0.8, p, 55)
pad(at("c3_1", "seventy-two"), S("c3_2"), [62, 69, 74, 77], 0.6, cutoff=2500, seed=21)
riser(P_LINE - 2.5, P_LINE, 0.8)
for inst, ps, v in [("strings", [50, 57, 62, 64, 69], 110), ("brass", [38, 50, 57, 62], 105), ("choir", [62, 65, 69, 74], 90),
                    ("basses", [26, 38], 110), ("timp", [38], 120)]:
    sc.chord(inst, P_LINE, P_MIRROR - P_LINE - 0.2, ps, v)
sc.ramp("strings", P_LINE, P_MIRROR - 0.2, 115, 50)
kick(P_LINE, 1.4)
for t in np.arange(P_STRIP, P_FAKE, 0.25):
    sc.n("celesta", t, 0.3, [93, 89, 86, 81, 77, 74, 69, 65][int((t - P_STRIP) / 0.25) % 8], 60)
sc.chord("slow", P_FAKE, SEC["ch4"] - P_FAKE - 0.4, [55, 58, 62, 69], 55)   # Gm(add9): a question
sc.n("harp", P_FAKE, 2.0, 74, 60)

# ---------------------------------------------------------------- 4. THE BILL
C4 = SEC["ch4"]
B_TW, B_COMP, B_TOWER = S("c4_1") - 0.15, S("c4_2") - 0.15, S("c4_3") - 0.15
B_LOCK = at("c4_9", "eighty") - 0.2
B_CASH0, B_25 = S("c4_10") - 0.1, at("c4_11", "twenty-five") - 0.15
B_RES, B_LOOP, B_CUST, C5 = S("c4_12") - 0.2, S("c4_14") - 0.15, S("c4_17") - 0.15, SEC["ch5"]
for inst, ps, v in [("brass", [26, 38, 45], 120), ("trombone", [38, 45, 50], 120), ("taiko", [45], 127), ("timp", [38], 127)]:
    sc.chord(inst, C4, 1.5, ps, v)
kick(C4, 1.6)
drone(C4, B_CASH0 + 0.3, 26, 1.1, cutoff=260)
for t in np.arange(B_TW, B_COMP, 1.0):
    sc.n("taiko", t, 0.4, 45, 70)
TAIKO = [0, 0.75, 1.0, 1.5, 1.75]
for t in bars(B_COMP, B_CASH0):
    tower = t >= B_TOWER
    u = (t - B_TOWER) / (B_CASH0 - B_TOWER) if tower else 0
    for k in range(16 if tower else 8):
        st = 0.125 if tower else 0.25
        sc.n("strings" if tower else "cello", t + k * st, st * 0.8, [38, 38, 41, 38, 39, 38, 41, 43][k % 8] + (12 if tower else 0), 70 + int(30 * u))
    for o in (TAIKO if tower else [0, 1.0]):
        sc.n("taiko", t + o, 0.4, 45 if o == 0 else 41, int(90 + 30 * u))
        if o in (0, 1.0):
            kick(t + o, 0.8 + 0.5 * u)
    if tower:
        sc.chord("brass", t, BAR * 0.95, [38, 45, 50] if int((t - B_TOWER) // BAR) % 2 == 0 else [39, 46, 51], 70 + int(40 * u))
        sc.chord("basses", t, BAR * 0.98, [26], 90)
        if t >= at("c4_4", "google") - 1:
            sc.chord("choir", t, BAR * 0.98, [62, 65, 69], int(50 + 50 * u))
shepard(B_TOWER + 2.0, B_CASH0 + 0.2, 1.0, rate=0.09)
sc.chord("brass", B_LOCK, 2.0, [38, 50, 57, 63], 120)
sc.n("timp", B_LOCK, 1.0, 38, 120)
# the cash: almost silence, then the 25x hit, then real silence
drone(B_CASH0, B_25, 26, 0.9, cutoff=160)
for inst, ps, v in [("brass", [26, 38, 45, 51], 125), ("choir", [50, 57, 63], 110), ("timp", [33, 38], 127), ("taiko", [41, 45], 127)]:
    sc.chord(inst, B_25, 1.6, ps, v)
kick(B_25, 1.8)
# somber resumption
for t in bars(B_RES, B_LOOP):
    name = prog_at(["Dm", "Bb", "Gm", "A"], t, grid(B_RES))
    sc.chord("slow", t, BAR * 0.98, voicing(name), 50)
    for k, p in enumerate(voicing(name, 1)[:3] + [voicing(name, 1)[1]]):
        sc.n("piano", t + k * 0.5, 0.9, p, 48)
# the loop: mechanical ostinato
for t in bars(B_LOOP, B_CUST + 3):
    name = prog_at(["Dm", "Dm", "Bb", "A"], t, grid(B_LOOP))
    u = (t - B_LOOP) / (B_CUST - B_LOOP)
    arp_bar(t, name, 1400 + 1200 * u, 0.85, pattern=[0, 12, 7, 12, 3, 12, 7, 12])
    for o in [0, 1.0]:
        kick(t + o, 0.7)
    for o in np.arange(0.25, 2.0, 0.5):
        tick(t + o, True, 1.2)
    sc.chord("strings", t, BAR * 0.98, voicing(name), 55 + int(25 * u))
sc.chord("trombone", at("c4_16", "warns") - 0.3, 3.0, [38, 44, 50], 85)
sc.ramp("trombone", at("c4_16", "warns") - 0.3, at("c4_16", "warns") + 2.7, 40, 110)
pad(B_CUST, C5 - 0.3, [50, 53, 57, 60], 0.8, cutoff=1000)

# ---------------------------------------------------------------- 5. THE VERDICT
V_LENS, V_BULL, V_BEAR, V_IPO, C6 = S("c5_1") - 0.1, S("c5_5") - 0.15, S("c5_6") - 0.1, S("c5_7") - 0.15, SEC["outro"]
sc.chord("slow", C5 - 0.3, 3.2, [50, 57, 62, 64], 60)
sc.ramp("slow", C5 - 0.3, C5 + 2.9, 50, 110)
riser(C5 + 0.4, V_LENS, 0.5)
for t in bars(V_LENS, V_IPO):
    name = prog_at(MAIN if t < V_BULL else (["Bb", "C", "Bb", "C"] if t < V_BEAR else ["Gm", "A", "Gm", "A"]), t, grid(V_LENS))
    root, iv = CHORDS[name]
    vv = voicing(name, 1)
    for k in range(8):
        sc.n("piano", t + k * 0.25, 0.3, [vv[0], vv[2], vv[1], vv[2]][k % 4] + (12 if k == 7 else 0), 58 if k % 4 else 66)
    sc.chord("strings", t, BAR * 0.98, voicing(name), 55 if t < V_BULL else 75)
    kick(t, 0.6)
    if t >= V_BULL:
        kick(t + 1.0, 0.7)
        clap(t + 1.0, 0.6)
        for o in np.arange(0.25, 2.0, 0.5):
            hat(t + o, 0.6)
        subbass(t, root - 12 if root >= 48 else root, 1.9, 0.8)
        sc.chord("brass", t, BAR * 0.95, voicing(name)[:3], 70)
# the IPO lift: VI - III - VII - i, then a bright suspended landing
lift = [(V_IPO, "Bb"), (V_IPO + 2, "F"), (V_IPO + 4, "C"), (V_IPO + 6, "Dm"), (V_IPO + 8, "Bb")]
for i, (t, name) in enumerate(lift):
    d = 2.0 if i < 4 else C6 - t - 0.6
    sc.chord("strings", t, d, voicing(name) + [voicing(name)[2] + 12], 85 + i * 5)
    sc.chord("brass", t, d, voicing(name)[:4], 80 + i * 6)
    sc.chord("choir", t, d, voicing(name, 1)[:3], 70 + i * 5)
    sc.chord("basses", t, d, [CHORDS[name][0] - 12], 90)
    sc.n("timp", t, 0.4, 38 if name == "Dm" else CHORDS[name][0] - 12, 100)
    kick(t, 1.0)
motif("horn", V_IPO, 95, 0)
sc.ramp("strings", V_IPO + 8, C6 - 0.6, 110, 30)

# ---------------------------------------------------------------- 6. OUTRO
O_CLOSE, O_WHICH, O_END = S("c6_4") - 0.15, S("c6_5") - 0.1, E("c6_5") + 1.4
for t in bars(C6, O_CLOSE):
    name = prog_at(MAIN, t, C6)
    sc.chord("slow", t, BAR * 0.98, voicing(name), 55)
    sc.n("basses", t, BAR * 0.9, CHORDS[name][0] - 12, 55)
for t0 in np.arange(C6, O_CLOSE - 7.9, 8.0):
    motif("piano", t0, 64, 12, legato=0.95)
for t in [at("c6_1", "real demand"), at("c6_2", "mostly"), at("c6_3", "a snapshot")]:
    sc.n("celesta", t, 1.2, 86, 70)
for i, name in enumerate(["Bb", "F", "C", "Dm"]):
    t = O_CLOSE + i * ((O_WHICH - O_CLOSE) / 4)
    sc.chord("strings", t, (O_WHICH - O_CLOSE) / 4, voicing(name) + [voicing(name)[2] + 12], 70 + i * 10)
    sc.chord("brass", t, (O_WHICH - O_CLOSE) / 4, voicing(name)[:3], 60 + i * 10)
sc.chord("strings", O_WHICH, O_END - O_WHICH + 0.5, [46, 53, 57, 60, 64, 69], 95)   # Bbmaj7(#11): unresolved
sc.chord("choir", O_WHICH, O_END - O_WHICH + 0.5, [62, 64, 69], 80)
sc.ramp("strings", O_WHICH, O_END, 90, 120)
riser(O_WHICH, O_END, 0.7, seed=31)
# end card: home, finally — a low D, held
sc.chord("piano", O_END, 7.0, [26, 38, 50, 57, 62], 85)
sc.chord("slow", O_END, 7.5, [38, 50, 57, 62, 65], 70)
sc.ramp("slow", O_END, O_END + 7.5, 100, 0)
kick(O_END, 1.0)
drone(O_END, DUR, 38, 0.7, cutoff=400)


# ---------------------------------------------------------------- render & mix
def main():
    with tempfile.TemporaryDirectory() as td:
        stems = sc.render(td)
    n = secs(DUR) + SR * 6
    lvl = {"strings": 0.9, "brass": 0.8, "keys": 0.8, "choir": 0.6, "perc": 0.85}
    wet = {"strings": 0.45, "brass": 0.4, "keys": 0.35, "choir": 0.5, "perc": 0.3}
    out = np.zeros((n, 2), np.float32)
    for g, x in stems.items():
        y = reverb(x, wet=wet[g], rt60=2.6)[:n]
        out[: len(y)] += y * lvl[g]
    syn = reverb(SYN, wet=0.25, rt60=1.8)[:n]
    out += syn
    out += LOW
    out = out[: secs(DUR)]
    # hard cut to black after the elevator: gate the music (reverb tails included) until the leak begins
    g = np.ones(len(out), np.float32)
    a, b = secs(C1_END), secs(T_DOC - 0.3)
    g[a:b] = 0.0
    g[a - secs(0.04):a] = np.linspace(1, 0, secs(0.04))
    g[b:b + secs(0.5)] = np.linspace(0, 1, secs(0.5))
    out *= g[:, None]
    # gentle bus glue: soft-knee limiting
    peak = np.max(np.abs(out))
    out = softclip(out / max(peak, 1e-9) * 1.2, 1.1) * 0.8
    # final fade so the end card resolves to silence
    fade = secs(3.0)
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    sf.write(BUILD / "music.wav", out, SR, subtype="FLOAT")
    print(f"music.wav: {len(out) / SR:.1f}s")


if __name__ == "__main__":
    main()
