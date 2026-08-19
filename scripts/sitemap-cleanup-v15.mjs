import fs from 'node:fs';
import path from 'node:path';

const sitemapPath = path.resolve('dist/sitemap.xml');
if (!fs.existsSync(sitemapPath)) process.exit(0);

const input = fs.readFileSync(sitemapPath, 'utf8');
const cleaned = input
  .split('\n')
  .filter((line) => !/<loc>https:\/\/devoviastudio\.com\/[^<]*\.html<\/loc>/.test(line))
  .join('\n');

fs.writeFileSync(sitemapPath, cleaned.endsWith('\n') ? cleaned : `${cleaned}\n`);
