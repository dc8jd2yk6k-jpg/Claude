"""Build a labelled contact sheet from a directory of stills (t0012.50.png ...)."""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

src = Path(sys.argv[1])
out = Path(sys.argv[2]) if len(sys.argv) > 2 else src / "contact.png"
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
tw = int(sys.argv[4]) if len(sys.argv) > 4 else 640

files = sorted(p for p in src.glob("t*.png"))
if not files:
    sys.exit("no stills")
first = Image.open(files[0])
th = round(tw * first.height / first.width)
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (tw + 8) + 8, rows * (th + 34) + 8), (40, 40, 40))
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf", 18)
except OSError:
    font = ImageFont.load_default()
for i, f in enumerate(files):
    r, c = divmod(i, cols)
    x, y = 8 + c * (tw + 8), 8 + r * (th + 34)
    sheet.paste(Image.open(f).convert("RGB").resize((tw, th), Image.LANCZOS), (x, y + 26))
    draw.text((x, y + 2), f"t={float(f.stem[1:]):.2f}s", fill=(255, 210, 120), font=font)
sheet.save(out)
print(out, sheet.size)
