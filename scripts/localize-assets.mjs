import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import appData from '../data/apps.json' with { type: 'json' };

function download(url, file) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const out = fs.createWriteStream(file);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        out.close();
        fs.unlinkSync(file);
        download(res.headers.location, file).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`${res.statusCode} ${url}`));
        return;
      }
      res.pipe(out);
      out.on('finish', () => out.close(resolve));
    }).on('error', reject);
  });
}

for (const app of appData.apps) {
  const dir = `public/products/${app.slug}`;
  const iconFile = `${dir}/icon.png`;
  if (!fs.existsSync(iconFile)) await download(app.icon_url, iconFile);
  app.icon_url = `/products/${app.slug}/icon.png`;
  const localShots = [];
  for (let i = 0; i < app.screenshots.length; i += 1) {
    const shotFile = `${dir}/screenshot-${i + 1}.jpg`;
    if (!fs.existsSync(shotFile)) await download(app.screenshots[i], shotFile);
    localShots.push(`/products/${app.slug}/screenshot-${i + 1}.jpg`);
  }
  app.screenshots = localShots;
}
fs.writeFileSync('data/apps.json', `${JSON.stringify(appData, null, 2)}\n`);
