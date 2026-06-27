import fs from 'node:fs';
import path from 'node:path';
import appData from '../data/apps.json' with { type: 'json' };

const dist = path.resolve('dist');
const index = path.join(dist, 'index.html');
const siteUrl = 'https://devoviastudio.com';

const privacyPolicies = [
  { id: 'app-1', fileName: 'app-1.html', slug: 'stock-manager' },
  { id: 'app-2', fileName: 'app-2.html', slug: 'daily-hadith' },
  { id: 'app-3', fileName: 'app-3.html', slug: 'tinysteps' },
  { id: 'app-4', fileName: 'app-4.html', slug: 'arrow-escape' },
];

const privacyRouteById = new Map(
  privacyPolicies.map((policy) => [policy.id, `/privacy/${policy.slug}`]),
);

const cleanPrivacyPathMap = new Map([
  ['/privacy.html', '/privacy'],
  ...privacyPolicies.map((policy) => [`/privacy/${policy.fileName}`, `/privacy/${policy.slug}`]),
]);

const productAliases = new Map([
  ['/products/stockflow-inventory', '/products/stock-manager'],
  ['/projects/stockflow-inventory', '/products/stock-manager'],
  ['/projects/stock-manager', '/products/stock-manager'],
  ['/projects/arrow-escape', '/products/arrow-escape'],
  ['/projects/daily-hadith', '/products/daily-hadith'],
  ['/projects/tinysteps', '/products/tinysteps'],
]);

const legacyRedirects = new Map([
  ...cleanPrivacyPathMap,
  ...productAliases,
]);

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

function normalizePublicReference(value) {
  if (!value || /^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(value)) return value;

  let normalized = value;
  if (normalized.startsWith('../')) normalized = `/${normalized.slice(3)}`;
  else if (normalized === './') normalized = '/';
  else if (normalized.startsWith('./privacy/')) normalized = `/privacy/${normalized.slice('./privacy/'.length)}`;
  else if (normalized.startsWith('./products/')) normalized = `/products/${normalized.slice('./products/'.length)}`;
  else if (normalized === './products') normalized = '/products';
  else if (normalized === './support') normalized = '/support';
  else if (normalized === './devovia-logo.png') normalized = '/devovia-logo.png';
  else if (normalized === './privacy-v2.css') normalized = '/privacy/privacy-v2.css';
  else if (normalized === './privacy-v2.js') normalized = '/privacy/privacy-v2.js';

  const url = new URL(normalized, siteUrl);
  const canonicalPath = cleanPrivacyPathMap.get(url.pathname.replace(/\/+$/, '') || '/');
  if (canonicalPath) return `${canonicalPath}${url.search}${url.hash}`;
  return `${url.pathname}${url.search}${url.hash}`;
}

function addCanonicalMetadata(html, canonicalPath) {
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const withoutExisting = html
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/\s*<meta\s+property="og:url"[^>]*>/gi, '');
  return withoutExisting.replace(
    '</head>',
    `  <link rel="canonical" href="${canonicalUrl}" />\n  <meta property="og:url" content="${canonicalUrl}" />\n</head>`,
  );
}

function normalizeStaticPrivacyDocument(html, canonicalPath) {
  let normalized = html.replace(/\b(href|src)="([^"]+)"/g, (match, attribute, value) => {
    const nextValue = normalizePublicReference(value);
    return `${attribute}="${nextValue}"`;
  });

  for (const [legacyPath, cleanPath] of cleanPrivacyPathMap) {
    normalized = normalized.replaceAll(`href="${legacyPath}"`, `href="${cleanPath}"`);
  }

  normalized = normalized
    .replaceAll('href="/privacy.html"', 'href="/privacy"')
    .replaceAll("link.href = './privacy-motion-v10.css';", "link.href = '/privacy/privacy-motion-v10.css';");

  return addCanonicalMetadata(normalized, canonicalPath);
}

function writeHtmlRoute(route, html) {
  const cleanRoute = route.replace(/^\/|\/$/g, '');
  const routeDir = cleanRoute ? path.join(dist, cleanRoute) : dist;
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), html);
}

function redirectDocument(destination) {
  const canonicalUrl = `${siteUrl}${destination}`;
  const safeDestination = JSON.stringify(destination);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="noindex,follow" />
  <meta http-equiv="refresh" content="0; url=${destination}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <title>Page moved — Devovia Studio</title>
  <script>location.replace(${safeDestination} + location.search + location.hash);</script>
</head>
<body>
  <p>This page has moved to <a href="${destination}">${canonicalUrl}</a>.</p>
</body>
</html>
`;
}

function publishCleanPrivacyRoutes() {
  const hubSource = path.join(dist, 'privacy.html');
  if (!fs.existsSync(hubSource)) throw new Error('Missing privacy center source');
  writeHtmlRoute('/privacy', normalizeStaticPrivacyDocument(fs.readFileSync(hubSource, 'utf8'), '/privacy'));

  for (const policy of privacyPolicies) {
    const source = path.join(dist, 'privacy', policy.fileName);
    if (!fs.existsSync(source)) throw new Error(`Missing privacy policy source: ${policy.fileName}`);
    const route = `/privacy/${policy.slug}`;
    writeHtmlRoute(route, normalizeStaticPrivacyDocument(fs.readFileSync(source, 'utf8'), route));
  }
}

function writeLegacyRedirects() {
  for (const [legacyPath, destination] of legacyRedirects) {
    if (legacyPath.endsWith('.html')) {
      fs.writeFileSync(path.join(dist, legacyPath.slice(1)), redirectDocument(destination));
    } else {
      writeHtmlRoute(legacyPath, redirectDocument(destination));
    }
  }
}

function rewritePublishedAppData() {
  const dataPath = path.join(dist, 'data', 'apps.json');
  if (!fs.existsSync(dataPath)) return;
  const publishedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  for (const app of publishedData.apps || []) {
    const privacyRoute = privacyRouteById.get(app.id);
    if (!privacyRoute) continue;
    app.privacy_url = privacyRoute;
    app.privacy_official_url = `${siteUrl}${privacyRoute}`;
  }
  fs.writeFileSync(dataPath, `${JSON.stringify(publishedData, null, 2)}\n`);
}

inlineLegalFragments();
publishCleanPrivacyRoutes();
rewritePublishedAppData();

function routeSlug(app) {
  return app.id === 'app-1' ? 'stock-manager' : app.slug;
}

function writeReactRoute(route) {
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
  ...blogSlugs.map((slug) => `/blog/${slug}`),
];

fs.copyFileSync(index, path.join(dist, '404.html'));
for (const route of routes) writeReactRoute(route);
writeLegacyRedirects();

const canonicalRoutes = [
  ...routes,
  '/privacy',
  ...privacyPolicies.map((policy) => `/privacy/${policy.slug}`),
];

fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  [
    'User-agent: *',
    'Allow: /',
    'Disallow: /privacy/fragments/',
    'Disallow: /apps/',
    'Sitemap: https://devoviastudio.com/sitemap.xml',
    '',
  ].join('\n'),
);

fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...canonicalRoutes
      .filter((route) => route !== '/admin')
      .map((route) => `  <url><loc>${siteUrl}${route === '/' ? '/' : route}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n'),
);

fs.writeFileSync(
  path.join(dist, '_redirects'),
  [
    ...[...legacyRedirects].map(([from, to]) => `${from} ${to} 301!`),
    '/* /index.html 200',
    '',
  ].join('\n'),
);
