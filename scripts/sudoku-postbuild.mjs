import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://devoviastudio.com';
const route = '/products/sudoku-duel';
const file = path.resolve('dist', 'products', 'sudoku-duel', 'index.html');

if (!fs.existsSync(file)) {
  throw new Error(`Missing generated Sudoku Duel route: ${file}`);
}

const title = 'Sudoku Duel — In Development | Devovia Studio';
const description = 'Sudoku Duel is a competitive Sudoku game in active development with career progression, ranked online duels, achievements, friends, virtual rewards and Android/iOS release foundations.';
const image = `${siteUrl}/products/sudoku-duel/icon.svg`;
const canonical = `${siteUrl}${route}`;

let html = fs.readFileSync(file, 'utf8');
html = html
  .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
  .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/i, `<meta name="description" content="${description}" />`)
  .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${title}" />`)
  .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${description}" />`)
  .replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/i, `<meta property="og:image" content="${image}" />`);

html = html
  .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '')
  .replace(/\s*<meta\s+property="og:url"[^>]*>/gi, '');

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Sudoku Duel',
  url: canonical,
  image,
  description,
  applicationCategory: 'Game',
  genre: ['Puzzle', 'Strategy'],
  operatingSystem: ['Android', 'iOS'],
  author: {
    '@type': 'Organization',
    name: 'Devovia Studio',
    url: siteUrl,
  },
};

html = html.replace(
  '</head>',
  `  <link rel="canonical" href="${canonical}" />\n  <meta property="og:url" content="${canonical}" />\n  <meta name="robots" content="index,follow" />\n  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>\n</head>`,
);

fs.writeFileSync(file, html);
console.log(`Sudoku Duel static metadata written to ${route}`);
