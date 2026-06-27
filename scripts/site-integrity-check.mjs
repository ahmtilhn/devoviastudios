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

const productSlugs = appData.apps.map((app) => app.id === 'app-1' ? 'stock-manager' : app.slug);
const projectSlugs = appData.apps.map((app) => app.slug);
const blogSlugs = [
  'google-play-closed-testing-checklist',
  'google-play-launch-checklist-indie-developers',
  'mobile-app-landing-page-trust',
  'offline-first-business-tools',
  'flutter-product-quality-release-notes',
  'indie-game-store-readiness',
];
const routes = [
  '/', '/admin', '/products', '/services',
  '/services/mobile-app-development', '/services/game-development', '/services/web-development',
  '/services/google-play-test-support', '/updates', '/blog', '/support', '/contact',
  ...productSlugs.map((slug) => `/products/${slug}`),
  ...projectSlugs.map((slug) => `/projects/${slug}`),
  ...blogSlugs.map((slug) => `/blog/${slug}`),
];

for (const route of routes) {
  const output = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  check(`Built route ${route}`, fs.existsSync(output), output);
}

const privacyFiles = ['privacy.html', 'privacy/app-1.html', 'privacy/app-2.html', 'privacy/app-3.html', 'privacy/app-4.html'];
for (const file of privacyFiles) {
  check(`Built privacy page ${file}`, fs.existsSync(path.join(dist, file)));
}

const stockPolicy = fs.readFileSync(path.join(dist, 'privacy/app-1.html'), 'utf8');
const dailyPolicy = fs.readFileSync(path.join(dist, 'privacy/app-2.html'), 'utf8');
const arrowPolicy = fs.readFileSync(path.join(dist, 'privacy/app-4.html'), 'utf8');
check('Stock Manager legal fragments are inlined', stockPolicy.includes('22. Contact') && !stockPolicy.includes('data-legal-fragment'));
check('Daily Hadith legal fragments are inlined', dailyPolicy.includes('Terms of Service') && dailyPolicy.includes('EULA') && !dailyPolicy.includes('data-legal-fragment'));
check('Arrow Escape legal fragments are inlined', arrowPolicy.includes('21. Contact') && !arrowPolicy.includes('data-legal-fragment'));
check('Built policies do not depend on legal-fragments.js', ![stockPolicy, dailyPolicy, arrowPolicy].some((html) => html.includes('legal-fragments.js')));

const homeSource = read('src/redesign/DevoviaHome.jsx');
const appSource = read('src/App.jsx');
const normalizer = read('src/ui/link-normalizer-v6.js');
const nativeEngine = read('src/ui/native-web-engine.js');
const transitionCss = read('src/ui/shared-transitions-v6.css');
const performanceCss = read('src/ui/performance-v6.css');
const privacyCss = read('privacy/privacy-v2.css');

check('Visible app-ads links are removed at runtime', normalizer.includes("anchor.remove()") && normalizer.includes('app-ads\\.txt'));
check('Old Google Sites policies are normalized eagerly', normalizer.includes('MutationObserver') && normalizer.includes('normalizeTree()'));
check('Duplicate local privacy links are removed', normalizer.includes('dedupeLocalLinks'));
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

const allBuiltHtml = [];
function collectHtml(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(full);
    else if (entry.name.endsWith('.html')) allBuiltHtml.push(fs.readFileSync(full, 'utf8'));
  }
}
collectHtml(dist);
check('No built page exposes an app-ads link', !allBuiltHtml.some((html) => /<a[^>]+href=["'][^"']*app-ads\.txt/i.test(html)));
check('No built privacy page links to old Google Sites', !privacyFiles.some((file) => /sites\.google\.com\/view\/devoviastudio\/privacy-policy/i.test(fs.readFileSync(path.join(dist, file), 'utf8'))));

console.log(`Site integrity checks: ${passes.length}/${passes.length + failures.length} passed.`);
for (const item of passes) console.log(`PASS  ${item}`);
for (const item of failures) console.error(`FAIL  ${item}`);
if (failures.length) process.exit(1);
