import fs from 'node:fs';
import path from 'node:path';
import appData from '../data/apps.json' with { type: 'json' };

const dist = path.resolve('dist');
const index = path.join(dist, 'index.html');
const siteUrl = 'https://devoviastudio.com';

const copyTargets = [
  ['app-ads.txt', 'app-ads.txt'],
  ['privacy.html', 'privacy.html'],
  ['privacy', 'privacy'],
  ['apps', 'apps'],
  ['data', 'data'],
];

for (const [source, target] of copyTargets) {
  if (fs.existsSync(source)) {
    fs.cpSync(source, path.join(dist, target), { recursive: true });
  }
}

function inlineLegalFragments() {
  const privacyDir = path.join(dist, 'privacy');
  if (!fs.existsSync(privacyDir)) return;

  for (const fileName of ['app-1.html', 'app-2.html', 'app-4.html']) {
    const pagePath = path.join(privacyDir, fileName);
    if (!fs.existsSync(pagePath)) continue;

    let html = fs.readFileSync(pagePath, 'utf8');
    html = html.replace(/<script\s+type="module"\s+src="\.\/legal-fragments\.js"><\/script>\s*/g, '');
    html = html.replace(/<div([^>]*?)data-legal-fragment="([^"]+)"([^>]*)><\/div>/g, (match, before, source, after) => {
      const fragmentPath = path.resolve(privacyDir, source);
      if (!fragmentPath.startsWith(privacyDir) || !fs.existsSync(fragmentPath)) {
        throw new Error(`Missing legal fragment: ${source} in ${fileName}`);
      }
      const fragment = fs.readFileSync(fragmentPath, 'utf8');
      const attributes = `${before}${after}`
        .replace(/\s*aria-busy="true"/g, '')
        .replace(/\s*data-legal-fragment="[^"]+"/g, '');
      return `<div${attributes}>${fragment}</div>`;
    });

    if (html.includes('data-legal-fragment=')) {
      throw new Error(`Unresolved legal fragment remains in ${fileName}`);
    }
    fs.writeFileSync(pagePath, html);
  }
}

inlineLegalFragments();

function routeSlug(app) {
  return app.id === 'app-1' ? 'stock-manager' : app.slug;
}

function writeRoute(route) {
  const cleanRoute = route.replace(/^\/|\/$/g, '');
  const routeDir = cleanRoute ? path.join(dist, cleanRoute) : dist;
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(index, path.join(routeDir, 'index.html'));
}

const blogSlugs = [
  'google-play-closed-testing-checklist',
  'google-play-launch-checklist-indie-developers',
  'mobile-app-landing-page-trust',
  'offline-first-business-tools',
  'flutter-product-quality-release-notes',
  'indie-game-store-readiness',
];

const routes = [
  '/',
  '/admin',
  '/products',
  '/services',
  '/services/mobile-app-development',
  '/services/game-development',
  '/services/web-development',
  '/services/google-play-test-support',
  '/updates',
  '/blog',
  '/support',
  '/contact',
  ...appData.apps.map((app) => `/products/${routeSlug(app)}`),
  ...appData.apps.map((app) => `/projects/${app.slug}`),
  ...blogSlugs.map((slug) => `/blog/${slug}`),
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
      .filter((route) => !route.startsWith('/projects') && route !== '/admin')
      .map((route) => `  <url><loc>${siteUrl}${route === '/' ? '/' : `${route}/`}</loc></url>`),
    `  <url><loc>${siteUrl}/privacy.html</loc></url>`,
    `  <url><loc>${siteUrl}/privacy/app-1.html</loc></url>`,
    `  <url><loc>${siteUrl}/privacy/app-2.html</loc></url>`,
    `  <url><loc>${siteUrl}/privacy/app-3.html</loc></url>`,
    `  <url><loc>${siteUrl}/privacy/app-4.html</loc></url>`,
    '</urlset>',
    '',
  ].join('\n'),
);
