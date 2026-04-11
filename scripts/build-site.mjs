import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const siteDir = resolve(root, 'site');

await rm(siteDir, { recursive: true, force: true });
await mkdir(siteDir, { recursive: true });

for (const file of ['index.html', 'demo.css', 'demo.js']) {
  await cp(resolve(root, file), resolve(siteDir, file));
}

await cp(resolve(root, 'dist'), resolve(siteDir, 'dist'), { recursive: true });
