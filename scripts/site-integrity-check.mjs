import fs from 'node:fs';
import path from 'node:path';
import appData from '../data/apps.json' with { type: 'json' };

const root = process.cwd();
const dist = path.join(root, 'dist');
const failures = [];
const passes = [];

function check(name, condition, detail = '') {
  if (condition) passes.push(name);
  else failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function distFile(route) {
  return route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.replace(/^\//, ''), 'index.html');
}

const productSlugs = appData.apps.map((app) => app.id === 'app-1' ? 'stock-manager' : app.slug);
const blogSlugs = [
  'google-play-closed-testing-checklist',
  'google-play-launch-checklist-indie-developers',
  'mobile-app-landing-page-trust',
  'offline-first-business-tools',
  'flutter-product-quality-release-notes',
  'indie-game-store-readiness',
];
const reactRoutes = [
  '/', '/admin', '/products', '/services',
  '/services/mobile-app-development', '/services/game-development', '/services/web-development',
  '/services/google-play-test-support', '/updates', '/blog', '/support', '/contact',
  ...productSlugs.map((slug) => `/products/${slug}`),
  ...blogSlugs.map((slug) => `/blog/${slug}`),
];
const privacyRoutes = [
  '/privacy',
  '/privacy/stock-manager',
  '/privacy/daily-hadith',
  '/privacy/tinysteps',
  '/privacy/arrow-escape',
];
const legacyRedirects = new Map([
  ['/privacy.html', '/privacy'],
  ['/privacy/app-1.html', '/privacy/stock-manager'],
  ['/privacy/app-2.html', '/privacy/daily-hadith'],
  ['/privacy/app-3.html', '/privacy/tinysteps'],
  ['/privacy/app-4.html', '/privacy/arrow-escape'],
  ['/products/stockflow-inventory', '/products/stock-manager'],
  ['/projects/stockflow-inventory', '/products/stock-manager'],
  ['/projects/stock-manager', '/products/stock-manager'],
  ['/projects/arrow-escape', '/products/arrow-escape'],
  ['/projects/daily-hadith', '/products/daily-hadith'],
  ['/projects/tinysteps', '/products/tinysteps'],
]);

for (const route of [...reactRoutes, ...privacyRoutes]) {
  const output = distFile(route);
  check(`Built canonical route ${route}`, fs.existsSync(output), output);
}

for (const [legacyRoute, destination] of legacyRedirects) {
  const output = legacyRoute.endsWith('.html')
    ? path.join(dist, legacyRoute.slice(1))
    : distFile(legacyRoute);
  check(`Built legacy redirect ${legacyRoute}`, fs.existsSync(output), output);
  if (!fs.existsSync(output)) continue;
  const html = fs.readFileSync(output, 'utf8');
  check(`${legacyRoute} is noindex`, html.includes('content="noindex,follow"'));
  check(`${legacyRoute} points to ${destination}`, html.includes(`href="${destination}"`) && html.includes('location.replace'));
  check(`${legacyRoute} does not duplicate page content`, !html.includes('privacy-shell') && !html.includes('app-shell'));
}

const stockPolicy = fs.readFileSync(distFile('/privacy/stock-manager'), 'utf8');
const dailyPolicy = fs.readFileSync(distFile('/privacy/daily-hadith'), 'utf8');
const arrowPolicy = fs.readFileSync(distFile('/privacy/arrow-escape'), 'utf8');
check('Stock Manager legal fragments are inlined', stockPolicy.includes('22. Contact') && !stockPolicy.includes('data-legal-fragment'));
check('Daily Hadith legal fragments are inlined', dailyPolicy.includes('Terms of Service') && dailyPolicy.includes('EULA') && !dailyPolicy.includes('data-legal-fragment'));
check('Arrow Escape legal fragments are inlined', arrowPolicy.includes('21. Contact') && !arrowPolicy.includes('data-legal-fragment'));
check('Built policies do not depend on legal-fragments.js', ![stockPolicy, dailyPolicy, arrowPolicy].some((html) => html.includes('legal-fragments.js')));

for (const route of privacyRoutes) {
  const html = fs.readFileSync(distFile(route), 'utf8');
  const canonical = `https://devoviastudio.com${route}`;
  check(`${route} has its canonical URL`, html.includes(`<link rel="canonical" href="${canonical}"`), canonical);
  check(`${route} uses route-independent privacy assets`, html.includes('/privacy/privacy-v2.css') && html.includes('/privacy/privacy-v2.js'));
}

const publishedDataPath = path.join(dist, 'data', 'apps.json');
check('Published app data exists', fs.existsSync(publishedDataPath), publishedDataPath);
if (fs.existsSync(publishedDataPath)) {
  const publishedData = JSON.parse(fs.readFileSync(publishedDataPath, 'utf8'));
  for (const app of publishedData.apps || []) {
    check(`${app.name} publishes a clean privacy URL`, /^\/privacy\/[a-z0-9-]+$/.test(app.privacy_url), app.privacy_url);
    check(`${app.name} official privacy URL is first-party`, app.privacy_official_url === `https://devoviastudio.com${app.privacy_url}`, app.privacy_official_url);
  }
}

const homeSource = read('src/redesign/DevoviaHome.jsx');
const appSource = read('src/App.jsx');
const normalizer = read('src/ui/link-normalizer-v6.js');
const nativeEngine = read('src/ui/native-web-engine.js');
const transitionCss = read('src/ui/shared-transitions-v6.css');
const performanceCss = read('src/ui/performance-v6.css');
const privacyCss = read('privacy/privacy-v2.css');
const privacyRuntime = read('privacy/privacy-v2.js');

check('Visible app-ads links are removed at runtime', normalizer.includes('anchor.remove()') && normalizer.includes('app-ads\\.txt'));
check('Old Google Sites policies are normalized eagerly', normalizer.includes('MutationObserver') && normalizer.includes('normalizeTree()'));
check('Legacy local URLs are normalized eagerly', normalizer.includes("['/privacy/app-1.html', '/privacy/stock-manager']") && normalizer.includes("['/privacy.html', '/privacy']"));
check('Duplicate local privacy links are removed', normalizer.includes('dedupeLocalLinks'));
check('Privacy runtime uses an absolute motion stylesheet', privacyRuntime.includes("link.href = '/privacy/privacy-motion-v10.css'"));
check('Modified clicks keep native browser behavior', nativeEngine.includes('preserveModifiedClick') && nativeEngine.includes('stopImmediatePropagation'));
check('SPA navigation uses View Transition API', nativeEngine.includes('document.startViewTransition(update)'));
check('History navigation has a dedicated animation', nativeEngine.includes('function handlePopState') && nativeEngine.includes("translate: '-18px 0'"));
check('Transition lifecycle supports BFCache restoration', nativeEngine.includes("window.addEventListener('pageshow'"));
check('Shared element product transitions exist', transitionCss.includes('product-icon') && transitionCss.includes('product-preview'));
check('Page transition CSS exists', performanceCss.includes('::view-transition') || transitionCss.includes('::view-transition'));
check('Privacy pages use cross-document transitions', privacyCss.includes('@view-transition') && privacyCss.includes('navigation: auto'));
check('Reduced motion is respected by app CSS', performanceCss.includes('prefers-reduced-motion') && transitionCss.includes('prefers-reduced-motion'));
check('Reduced motion is respected by privacy CSS', privacyCss.includes('prefers-reduced-motion'));
check('Home contains all required navigation regions', ['#services', '#products', '#about', '/updates', '/support', '/contact'].every((href) => homeSource.includes(`href="${href}"`)));
check('App shell includes all primary destinations', ['/products', '/services', '/updates', '/blog', '/support', '/contact'].every((href) => appSource.includes(`'${href}'`) || appSource.includes(`"${href}"`)));

for (const app of appData.apps) {
  const paths = [app.icon_url, ...app.screenshots];
  for (const asset of paths) {
    check(`${app.name} asset ${asset}`, fs.existsSync(path.join(root, 'public', asset.replace(/^\//, ''))));
  }
  check(`${app.name} Play URL is HTTPS`, /^https:\/\/play\.google\.com\//.test(app.play_url));
}

const builtHtml = [];
function collectHtml(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(full);
    else if (entry.name.endsWith('.html')) builtHtml.push({ file: full, html: fs.readFileSync(full, 'utf8') });
  }
}
collectHtml(dist);

const publicAnchorProblem = /<a[^>]+href=["'][^"']*(?:\/privacy\.html|\/privacy\/app-[1-4]\.html|\/projects\/|\/products\/stockflow-inventory)[^"']*["']/i;
const anchorProblems = builtHtml.filter(({ html }) => publicAnchorProblem.test(html)).map(({ file }) => path.relative(dist, file));
check('No built page exposes a legacy public URL', anchorProblems.length === 0, anchorProblems.join(', '));
check('No built page exposes an app-ads link', !builtHtml.some(({ html }) => /<a[^>]+href=["'][^"']*app-ads\.txt/i.test(html)));
check('No canonical privacy page links to old Google Sites', !privacyRoutes.some((route) => /sites\.google\.com\/view\/devoviastudio\/privacy-policy/i.test(fs.readFileSync(distFile(route), 'utf8'))));

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
check('Sitemap contains every clean privacy route', privacyRoutes.every((route) => sitemap.includes(`<loc>https://devoviastudio.com${route}</loc>`)));
check('Sitemap exposes no HTML-extension URL', !/https:\/\/devoviastudio\.com\/[^<]*\.html/i.test(sitemap));
check('Sitemap exposes no duplicate project route', !sitemap.includes('/projects/'));
check('Sitemap exposes no old StockFlow product slug', !sitemap.includes('/products/stockflow-inventory'));

const redirects = fs.readFileSync(path.join(dist, '_redirects'), 'utf8');
check('Netlify redirect manifest covers all legacy paths', [...legacyRedirects].every(([from, to]) => redirects.includes(`${from} ${to} 301!`)));

console.log(`Site integrity checks: ${passes.length}/${passes.length + failures.length} passed.`);
for (const item of passes) console.log(`PASS  ${item}`);
for (const item of failures) console.error(`FAIL  ${item}`);
if (failures.length) process.exit(1);
