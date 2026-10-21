#!/usr/bin/env bash
# End-to-end build: narration -> visuals -> sound design -> score -> mix -> final MP4.
# Usage: video/build.sh            (full 1080p30 render, ~35 min on 4 cores)
#        WORKERS=8 video/build.sh  (more parallel Chromium workers)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build ../dist models

echo "== 0. dependencies"
[ -d node_modules ] || npm install --no-audit --no-fund
python3 -c "import kokoro_onnx, soundfile, scipy, mido" 2>/dev/null || pip install kokoro-onnx soundfile scipy mido
command -v fluidsynth >/dev/null || { echo "install fluidsynth + musescore-general-soundfont-lossless (apt)"; exit 1; }
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -f "models/$f" ] || curl -sSL -o "models/$f" "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f"
done

echo "== 1. narration + timeline"
python3 tools/tts.py

echo "== 2. sound-design cues from the motion graphics"
node render/render.mjs --cues

echo "== 3. sound design, score, mix"
python3 tools/sfx.py
python3 tools/score.py
python3 tools/mix.py

echo "== 4. render frames"
node render/render.mjs --out build/video.mp4 --workers "${WORKERS:-4}"

echo "== 5. final encode + mux"
OUT=../dist/anthropic-80b-paradox.mp4
ffmpeg -hide_banner -y -i build/video.mp4 -i build/master.wav -i ../dist/anthropic-80b-paradox.srt \
  -map 0:v -map 1:a -map 2:s -c:v libx264 -preset slow -crf "${CRF:-21}" -tune film -pix_fmt yuv420p \
  -x264-params "aq-mode=3" -c:a aac -b:a 192k -c:s mov_text -metadata:s:s:0 language=eng \
  -metadata title="The \$80 Billion Paradox" -movflags +faststart -shortest "$OUT"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
