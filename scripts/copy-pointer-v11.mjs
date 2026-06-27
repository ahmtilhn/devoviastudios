import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
for (const file of ['pointer-v11.css', 'pointer-v11.js']) {
  const source = path.resolve(file);
  if (!fs.existsSync(source)) throw new Error(`Missing global pointer asset: ${file}`);
  fs.copyFileSync(source, path.join(dist, file));
}
