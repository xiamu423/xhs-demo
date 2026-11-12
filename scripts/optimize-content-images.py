"""Generate committed display assets. Run with Python + Pillow after importing notes.

Original evidence stays untouched. Crop using the existing 2664x1594 SVG viewport,
then encode small list previews and readable detail images with fixed dimensions.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
frames = json.loads((ROOT / 'src/media-frames.json').read_text())
manifest = {}
original_bytes = 0
preview_bytes = 0
detail_bytes = 0
for folder in ('beauty', 'scenes'):
    for source in sorted((PUBLIC / 'assets' / folder).rglob('*')):
        if source.suffix.lower() not in ('.png', '.jpg', '.jpeg'):
            continue
        url = '/' + source.relative_to(PUBLIC).as_posix()
        image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
        if url in frames:
            x, y, w, h = frames[url]
            sx, sy = image.width / 2664, image.height / 1594
            image = image.crop((round(x*sx), round(y*sy), round((x+w)*sx), round((y+h)*sy)))
        entry = {'width': image.width, 'height': image.height, 'cropped': url in frames}
        for label, size in (('preview', 480), ('detail', 1200)):
            output = PUBLIC / 'assets/optimized' / folder / source.parent.name / f'{source.stem}-{label}.webp'
            output.parent.mkdir(parents=True, exist_ok=True)
            resized = image.copy()
            resized.thumbnail((size, size * 2), Image.Resampling.LANCZOS)
            resized.save(output, 'WEBP', quality=84 if label == 'detail' else 78, method=6)
            entry[label] = '/' + output.relative_to(PUBLIC).as_posix()
            if label == 'preview': preview_bytes += output.stat().st_size
            else: detail_bytes += output.stat().st_size
        original_bytes += source.stat().st_size
        manifest[url] = entry
(ROOT / 'src/image-assets.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'{len(manifest)} images: original {original_bytes/1e6:.2f} MB; previews {preview_bytes/1e6:.2f} MB; details {detail_bytes/1e6:.2f} MB')
