"""Small DSP toolkit shared by the score and sound-design generators (48 kHz)."""
import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000


def secs(n):
    return int(round(n * SR))


def t_axis(d):
    return np.arange(secs(d)) / SR


def rng(seed):
    return np.random.default_rng(seed)


def noise(d, seed=0):
    return rng(seed).standard_normal(secs(d)).astype(np.float32)


def lp(x, f, order=2):
    return sosfilt(butter(order, min(f, SR / 2 - 100) / (SR / 2), "low", output="sos"), x, axis=0)


def hp(x, f, order=2):
    return sosfilt(butter(order, f / (SR / 2), "high", output="sos"), x, axis=0)


def bp(x, f0, f1, order=2):
    return sosfilt(butter(order, [f0 / (SR / 2), min(f1, SR / 2 - 100) / (SR / 2)], "band", output="sos"), x, axis=0)


def sweep_filter(x, f_start, f_end, kind="lp", blocks=64, q_bw=0.6):
    """Time-varying filter by block-wise crossfaded filtering (cheap, smooth enough)."""
    n = len(x)
    out = np.zeros_like(x)
    edges = np.linspace(0, n, blocks + 1).astype(int)
    fs = np.geomspace(max(f_start, 20), max(f_end, 20), blocks)
    for i in range(blocks):
        a, b = edges[i], edges[i + 1]
        pad = min(a, 2048)
        seg = x[a - pad:b]
        f = fs[i]
        if kind == "lp":
            y = lp(seg, f)
        elif kind == "hp":
            y = hp(seg, f)
        else:
            y = bp(seg, f * (1 - q_bw / 2), f * (1 + q_bw / 2))
        out[a:b] = y[pad:]
    return out


def env_ad(d, a=0.005, curve=4.0):
    t = t_axis(d)
    e = np.where(t < a, t / max(a, 1e-6), np.exp(-curve * (t - a) / max(d - a, 1e-6)))
    return e.astype(np.float32)


def env_adsr(d, a, dcy, s, r):
    n = secs(d)
    e = np.ones(n, dtype=np.float32) * s
    na, nd, nr = secs(a), secs(dcy), secs(r)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nd:
        e[na:na + nd] = np.linspace(1, s, len(e[na:na + nd]))
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def osc(freq, d, kind="sine", phase=0.0):
    """freq may be scalar or per-sample array."""
    n = secs(d)
    f = np.broadcast_to(np.asarray(freq, dtype=np.float64), (n,)) if np.ndim(freq) else np.full(n, float(freq))
    ph = phase + np.cumsum(f) / SR
    if kind == "sine":
        return np.sin(2 * np.pi * ph).astype(np.float32)
    if kind == "saw":
        return (2 * (ph % 1.0) - 1).astype(np.float32)
    if kind == "square":
        return np.sign(np.sin(2 * np.pi * ph)).astype(np.float32)
    if kind == "tri":
        return (2 * np.abs(2 * (ph % 1.0) - 1) - 1).astype(np.float32)
    raise ValueError(kind)


def supersaw(freq, d, voices=7, detune=0.012, seed=1):
    r = rng(seed)
    out = np.zeros(secs(d), dtype=np.float32)
    for v in range(voices):
        k = 1 + detune * (v - (voices - 1) / 2) / ((voices - 1) / 2)
        out += osc(freq * k, d, "saw", phase=r.random())
    return out / voices


def stereo(x, pan=0.0, width=0.0, seed=3):
    """Mono -> stereo with constant-power pan; optional decorrelated width."""
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    out = np.stack([x * l, x * r], axis=1)
    if width > 0:
        d = int(0.011 * SR)
        side = np.zeros_like(x)
        side[d:] = x[:-d]
        out[:, 0] += width * side * 0.5
        out[:, 1] -= width * side * 0.5
    return out.astype(np.float32)


_IR = {}


def reverb_ir(rt60=2.4, pre=0.02, seed=9, bright=7000):
    key = (rt60, pre, seed, bright)
    if key in _IR:
        return _IR[key]
    n = secs(rt60 * 1.3)
    r = rng(seed)
    t = np.arange(n) / SR
    decay = np.exp(-6.9 * t / rt60)
    irs = []
    for ch in range(2):
        x = r.standard_normal(n) * decay
        x = lp(x, bright)
        x[: secs(pre)] = 0
        irs.append(x)
    ir = np.stack(irs, axis=1).astype(np.float32)
    ir /= np.sqrt(np.sum(ir ** 2) / 2)
    _IR[key] = ir
    return ir


def reverb(x, wet=0.3, rt60=2.4, pre=0.02, bright=7000):
    """x: (n,2). Returns dry+wet, length extended by the tail."""
    ir = reverb_ir(rt60, pre, bright=bright)
    wl = fftconvolve(x[:, 0], ir[:, 0])
    wr = fftconvolve(x[:, 1], ir[:, 1])
    w = np.stack([wl, wr], axis=1).astype(np.float32)
    out = np.zeros_like(w)
    out[: len(x)] += x * (1 - wet * 0.5)
    out += w * wet * 0.35
    return out


def place(track, sample, t, gain=1.0):
    """Mix a stereo sample into track at time t (seconds)."""
    i = secs(t)
    if i >= len(track):
        return
    if i < 0:
        sample = sample[-i:]
        i = 0
    n = min(len(sample), len(track) - i)
    track[i:i + n] += sample[:n] * gain


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) + 1e-9
    return (x * (peak / m)).astype(np.float32)


def softclip(x, drive=1.0):
    return (np.tanh(x * drive) / np.tanh(drive)).astype(np.float32)


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)
