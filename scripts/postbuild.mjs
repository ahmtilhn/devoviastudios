import fs from 'node:fs';
import path from 'node:path';
import appData from '../data/apps.json' with { type: 'json' };

const dist = path.resolve('dist');
const index = path.join(dist, 'index.html');
const siteUrl = 'https://devoviastudio.com';

const copyTargets = [
  ['app-ads.txt', 'app-ads.txt'],
  ['privacy', 'privacy'],
  ['apps', 'apps'],
  ['data', 'data'],
];

for (const [source, target] of copyTargets) {
  if (fs.existsSync(source)) {
    fs.cpSync(source, path.join(dist, target), { recursive: true });
  }
}

function routeSlug(app) {
  return app.id === 'app-1' ? 'stock-manager' : app.slug;
}

function writeRoute(route) {
  const cleanRoute = route.replace(/^\/|\/$/g, '');
  const routeDir = cleanRoute ? path.join(dist, cleanRoute) : dist;
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(index, path.join(routeDir, 'index.html'));
}

const routes = [
  '/',
  '/products',
  '/services',
  '/services/google-play-test-support',
  '/updates',
  '/blog',
  '/support',
  '/contact',
  ...appData.apps.map((app) => `/products/${routeSlug(app)}`),
  ...appData.apps.map((app) => `/projects/${app.slug}`),
];

fs.copyFileSync(index, path.join(dist, '404.html'));
for (const route of routes) writeRoute(route);

fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  [
    'User-agent: *',
    'Allow: /',
    'Sitemap: https://devoviastudio.com/sitemap.xml',
    '',
  ].join('\n'),
);

fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes
      .filter((route) => !route.startsWith('/projects'))
      .map((route) => `  <url><loc>${siteUrl}${route === '/' ? '/' : `${route}/`}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n'),
);
