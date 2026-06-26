import { readFile } from 'node:fs/promises';

const files = {
  main: 'src/main.jsx',
  home: 'src/redesign/DevoviaHome.jsx',
  homeMotion: 'src/redesign/immersive-motion.js',
  homeCss: 'src/redesign/devovia-home.css',
  homeV4: 'src/redesign/devovia-motion-v4.css',
  atmosphere: 'src/ui/full-site-atmosphere.js',
  targets: 'src/ui/full-site-targets.js',
  internalMotion: 'src/ui/full-site-motion.js',
  internalCss: 'src/ui/full-site-motion-v4.css',
  internalEntry: 'src/ui/full-site-ux.css',
  app: 'src/App.jsx',
};

const contents = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

const checks = [];
const check = (name, condition, detail) => checks.push({ name, condition: Boolean(condition), detail });
const count = (text, token) => text.split(token).length - 1;

check('Homepage uses one dedicated motion orchestrator', contents.main.includes("./redesign/immersive-motion.js"), files.main);
check('Internal motion is loaded through enhancer', contents.main.includes("./ui/enhancer.js"), files.main);
check('Internal atmosphere is scoped away from homepage', contents.atmosphere.includes("const ROOT_SELECTOR = '.app-shell';"), files.atmosphere);
check('Internal atmosphere has no global observer side effect', !contents.atmosphere.includes('new MutationObserver'), files.atmosphere);
check('Internal targets have no global pointer listener', !contents.targets.includes("addEventListener('pointermove'"), files.targets);
check('Internal orchestrator owns one pointer listener', count(contents.internalMotion, "addEventListener('pointermove'") === 1, files.internalMotion);
check('Homepage orchestrator does not duplicate pointer listener', !contents.homeMotion.includes("addEventListener('pointermove'"), files.homeMotion);
check('Homepage v4 stylesheet is active', contents.homeCss.includes("devovia-motion-v4.css"), files.homeCss);
check('Legacy homepage motion styles are not imported', !contents.homeCss.includes('devovia-motion-v2.css') && !contents.homeCss.includes('devovia-motion-fixes.css'), files.homeCss);
check('Internal v4 stylesheet is active', contents.internalEntry.includes("full-site-motion-v4.css"), files.internalEntry);
check('Homepage supports reduced motion', contents.homeV4.includes('@media (prefers-reduced-motion: reduce)'), files.homeV4);
check('Internal pages support reduced motion', contents.internalCss.includes('@media (prefers-reduced-motion: reduce)'), files.internalCss);
check('Homepage has section progress choreography', contents.homeMotion.includes('--zone-progress') && contents.homeMotion.includes('--product-progress'), files.homeMotion);
check('Internal pages have section progress choreography', contents.internalMotion.includes('--ux-section-progress'), files.internalMotion);
check('Content visibility performance guard exists', contents.internalCss.includes('content-visibility: auto'), files.internalCss);
check('All major public route families remain present', [
  "'/products'", "'/services'", "'/updates'", "'/support'", "'/blog'", "'/contact'",
].every((route) => contents.app.includes(route)), files.app);

const failures = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'}  ${item.name}  [${item.detail}]`);
}

console.log(`\nUX contract checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
