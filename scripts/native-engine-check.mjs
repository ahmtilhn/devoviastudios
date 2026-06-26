import { readFile } from 'node:fs/promises';

const paths = {
  main: 'src/main.jsx',
  engine: 'src/ui/native-web-engine.js',
  css: 'src/ui/native-web-engine.css',
  english: 'src/ui/english-only.js',
  app: 'src/App.jsx',
  home: 'src/redesign/DevoviaHome.jsx',
  data: 'data/apps.json',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });
const turkishCharacters = /[çğıöşüÇĞİÖŞÜ]/;
const appPublicCopy = source.app.replace(
  /const trText = \{[\s\S]*?\n\};\n\nfunction detectLocale/,
  'function detectLocale',
);

check('English bootstrap loads before App', source.main.indexOf("./ui/english-only.js") >= 0 && source.main.indexOf("./ui/english-only.js") < source.main.indexOf("./App.jsx"), paths.main);
check('Native engine JS is loaded', source.main.includes("./ui/native-web-engine.js"), paths.main);
check('Native engine CSS is loaded', source.main.includes("./ui/native-web-engine.css"), paths.main);
check('English document language is locked', source.english.includes("document.documentElement.lang = 'en'"), paths.english);
check('Turkish language query is removed', source.english.includes("searchParams.delete('lang')"), paths.english);
check('Navigator language is forced to English', source.english.includes("['language', englishLanguage]"), paths.english);
check('View Transition API is used', source.engine.includes('document.startViewTransition'), paths.engine);
check('Cross-document events are used', source.engine.includes("'pageswap'") && source.engine.includes("'pagereveal'"), paths.engine);
check('SPA interception is limited to known routes', source.engine.includes('function isAppRoute') && source.engine.includes('isAppRoute(nextPath)'), paths.engine);
check('Navigation engine adds no pointermove loop', !source.engine.includes("addEventListener('pointermove'"), paths.engine);
check('Speculation Rules prefetch has fallback', source.engine.includes("supports?.('speculationrules')") && source.engine.includes("link.rel = 'prefetch'"), paths.engine);
check('Cross-document CSS opt-in exists', source.css.includes('@view-transition') && source.css.includes('navigation: auto'), paths.css);
check('View timelines are used', source.css.includes('animation-timeline: view(block)'), paths.css);
check('Root scroll timeline is used', source.css.includes('animation-timeline: scroll(root block)'), paths.css);
check('Reduced motion disables native animations', source.css.includes('@media (prefers-reduced-motion: reduce)'), paths.css);
check('Public App copy is English', !turkishCharacters.test(appPublicCopy), paths.app);
check('Homepage copy is English', !turkishCharacters.test(source.home), paths.home);
check('Product data copy is English', !turkishCharacters.test(source.data), paths.data);

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nNative engine checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
