import {readdirSync, readFileSync, existsSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist/client');
const base = '/xhs-demo/';
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes(`${base}assets/`)) throw new Error('Missing Pages base path in HTML');
const jsFiles = readdirSync(path.join(root, 'assets')).filter(name => name.endsWith('.js'));
const code = jsFiles.map(name => readFileSync(path.join(root, 'assets', name), 'utf8')).join('\n');
if (/["'`]\/assets\//.test(code)) throw new Error('Root-relative asset URL remains in Pages bundle');
for (const folder of ['content', 'beauty', 'scenes', 'iphone', 'android', 'status']) {
  if (!code.includes(`${base}assets/${folder}/`)) throw new Error(`Missing prefixed ${folder} URLs`);
  if (!existsSync(path.join(root, 'assets', folder))) throw new Error(`Missing ${folder} assets`);
}
const urls = [...new Set(code.match(/\/xhs-demo\/assets\/[^"'`\s<>]+\.(?:png|jpg|svg|webp)/g) || [])];
for (const url of urls) {
  if (!existsSync(path.join(root, url.slice(base.length)))) throw new Error(`Missing asset: ${url}`);
}
writeFileSync(path.join(root, '.nojekyll'), '');
console.log(`Pages build verified: ${urls.length} static asset URLs; ${base}`);
