import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const siteDir = resolve(root, 'site');

await rm(siteDir, { recursive: true, force: true });
await mkdir(siteDir, { recursive: true });
await mkdir(resolve(siteDir, 'brand'), { recursive: true });
await mkdir(resolve(siteDir, 'vendor'), { recursive: true });

for (const file of ['index.html', 'demo.css', 'demo.js', 'favicon.svg']) {
  await cp(resolve(root, file), resolve(siteDir, file));
}

await cp(resolve(root, 'brand', 'ninfinityn.svg'), resolve(siteDir, 'brand', 'ninfinityn.svg'));
await cp(
  resolve(root, 'node_modules', '@vercel', 'analytics', 'dist', 'index.mjs'),
  resolve(siteDir, 'vendor', 'vercel-analytics.mjs'),
);

await cp(resolve(root, 'dist'), resolve(siteDir, 'dist'), { recursive: true });
