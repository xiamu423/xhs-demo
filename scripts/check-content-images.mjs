import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('../src/image-assets.json', import.meta.url)));
let original = 0, previews = 0, details = 0;
for (const [source, image] of Object.entries(manifest)) {
  assert(image.width > 0 && image.height > 0, `Missing reserved dimensions: ${source}`);
  original += statSync(`public${source}`).size;
  for (const variant of ['preview', 'detail']) {
    assert(image[variant].startsWith('/assets/optimized/'), `Unoptimized ${source}`);
    const data = readFileSync(`public${image[variant]}`);
    assert.equal(data.toString('ascii', 0, 4), 'RIFF');
    assert.equal(data.toString('ascii', 8, 12), 'WEBP');
    if (variant === 'preview') previews += data.length;
    else details += data.length;
  }
}
assert(previews < original * 0.15, 'Preview image payload regressed');
assert(details < original * 0.3, 'Detail image payload regressed');
console.log(`${Object.keys(manifest).length} image pairs verified; previews ${(previews/original*100).toFixed(1)}%, details ${(details/original*100).toFixed(1)}% of originals`);
