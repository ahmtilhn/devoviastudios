import { readFile } from 'node:fs/promises';

const files = {
  main: 'src/main.jsx',
  motion: 'src/ui/motion-system-v10.js',
  motionCss: 'src/ui/motion-system-v10.css',
  motionHardening: 'src/ui/motion-system-v10-hardening.css',
  enhancer: 'src/ui/enhancer.js',
  atmosphere: 'src/ui/full-site-atmosphere.js',
  targets: 'src/ui/full-site-targets.js',
  internalMotion: 'src/ui/full-site-motion.js',
  internalCss: 'src/ui/full-site-motion-v4.css',
  app: 'src/App.jsx',
  privacy: 'privacy/privacy-v2.js',
  privacyCss: 'privacy/privacy-motion-v10.css',
};

const contents = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

const checks = [];
const check = (name, condition, detail) => checks.push({ name, condition: Boolean(condition), detail });
const count = (text, token) => text.split(token).length - 1;

check('Site uses one contextual V10 motion orchestrator', contents.main.includes("./ui/motion-system-v10.js"), files.main);
check('V10 styles load after legacy presentation styles', contents.main.indexOf('premium-motion-v8.css') < contents.main.indexOf('motion-system-v10.css'), files.main);
check('Legacy homepage and V8 orchestrators are disconnected', !contents.main.includes("./redesign/immersive-motion.js") && !contents.main.includes("./ui/premium-motion-v8.js"), files.main);
check('Internal compatibility enhancer remains loaded', contents.main.includes("./ui/enhancer.js"), files.main);
check('Legacy internal enhancer is disconnected', !contents.enhancer.includes('legacy-enhancer'), files.enhancer);
check('Internal atmosphere remains scoped away from homepage', contents.atmosphere.includes("const ROOT_SELECTOR = '.app-shell';"), files.atmosphere);
check('Internal atmosphere has no global observer side effect', !contents.atmosphere.includes('new MutationObserver'), files.atmosphere);
check('Internal targets have no global pointer listener', !contents.targets.includes("addEventListener('pointermove'"), files.targets);
check('V10 orchestrator owns one pointer listener', count(contents.motion, "addEventListener('pointermove'") === 1, files.motion);
check('V10 supports page-specific profiles', ['home','catalog','product-detail','services','service-detail','updates','blog','article','support','contact'].every((profile) => contents.motion.includes(`'${profile}'`)), files.motion);
check('V10 has region progress choreography', contents.motion.includes('--m10-region-progress') && contents.motion.includes('updateRegions'), files.motion);
check('V10 has product and editorial continuity', contents.motion.includes('m10-shared-title') && contents.motion.includes('markSharedTitle'), files.motion);
check('V10 has filter FLIP choreography', contents.motion.includes('captureFilterLayout') && contents.motion.includes('runFilterFlip'), files.motion);
check('V10 guards synthetic route events', contents.motion.includes('if (!event.isTrusted)'), files.motion);
check('V10 preserves BFCache behavior', contents.motion.includes('if (event.persisted) return;') && contents.motion.includes("window.addEventListener('pageshow'"), files.motion);
check('V10 styles support reduced motion', contents.motionCss.includes('@media (prefers-reduced-motion: reduce)'), files.motionCss);
check('V10 browser-safe atmosphere override is active', contents.main.includes('motion-system-v10-hardening.css') && contents.motionHardening.includes('--m10-ambient-x'), files.motionHardening);
check('Internal content visibility performance guard exists', contents.internalCss.includes('content-visibility: auto'), files.internalCss);
check('Legal pages use dedicated calm motion', contents.privacy.includes('privacy-motion-v10.css') && contents.privacyCss.includes('privacy-reading-progress'), files.privacy);
check('Legal pages support reduced motion', contents.privacyCss.includes('@media (prefers-reduced-motion: reduce)'), files.privacyCss);
check('All major public route families remain present', [
  "'/products'", "'/services'", "'/updates'", "'/support'", "'/blog'", "'/contact'",
].every((route) => contents.app.includes(route)), files.app);

const failures = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'}  ${item.name}  [${item.detail}]`);
}

console.log(`\nUX contract checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
