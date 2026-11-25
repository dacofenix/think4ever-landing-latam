"""Corta clips en cuadros WebP numerados (f_0001.webp ...) para animarlos en canvas.

Uso:
  python tools/cortar_cuadros.py --out assets/mascota/blueprint --fps 15 --width 800 clip.mp4
  python tools/cortar_cuadros.py --out assets/como --fps 12 --width 1080 tramo1.mp4 tramo2.mp4

--blanco N  lleva a blanco puro todo lo que esté por encima de N (0-255) para que el fondo
            del clip desaparezca al mezclarlo con la página (mix-blend-mode: multiply).
Necesita: pip install imageio-ffmpeg pillow
"""
import argparse
import glob
import os
import subprocess
import tempfile

import imageio_ffmpeg
from PIL import Image

p = argparse.ArgumentParser()
p.add_argument("clips", nargs="+")
p.add_argument("--out", required=True)
p.add_argument("--fps", type=int, default=12)
p.add_argument("--width", type=int, default=1280)
p.add_argument("--quality", type=int, default=76)
p.add_argument("--blanco", type=int, default=0)
a = p.parse_args()

os.makedirs(a.out, exist_ok=True)
for old in glob.glob(os.path.join(a.out, "f_*.webp")):
    os.remove(old)

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
vf = f"fps={a.fps},scale={a.width}:-2:flags=lanczos"
if a.blanco:
    hi = a.blanco / 255
    vf += f",colorlevels=rimax={hi}:gimax={hi}:bimax={hi}"

n = 0
for clip in a.clips:
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run([ffmpeg, "-v", "error", "-i", clip, "-vf", vf, os.path.join(tmp, "%04d.png")], check=True)
        frames = sorted(glob.glob(os.path.join(tmp, "*.png")))
        if n and frames:      # el primer cuadro de un tramo repite el último del anterior
            frames = frames[1:]
        for f in frames:
            n += 1
            Image.open(f).convert("RGB").save(os.path.join(a.out, f"f_{n:04d}.webp"), quality=a.quality, method=6)
size = sum(os.path.getsize(f) for f in glob.glob(os.path.join(a.out, "f_*.webp")))
print(f"{a.out}: {n} cuadros, {size // 1024} KB")
