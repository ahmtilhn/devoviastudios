import fs from 'node:fs';
import path from 'node:path';
import appData from '../data/apps.json' with { type: 'json' };

const dist = path.resolve('dist');
const index = path.join(dist, 'index.html');

for (const [source, target] of [
  ['app-ads.txt', 'app-ads.txt'],
  ['privacy', 'privacy'],
  ['apps', 'apps'],
  ['data', 'data'],
]) {
  if (fs.existsSync(source)) {
    fs.cpSync(source, path.join(dist, target), { recursive: true });
  }
}

fs.copyFileSync(index, path.join(dist, '404.html'));

for (const app of appData.apps) {
  const projectDir = path.join(dist, 'projects', app.slug);
  fs.mkdirSync(projectDir, { recursive: true });
  fs.copyFileSync(index, path.join(projectDir, 'index.html'));
}
