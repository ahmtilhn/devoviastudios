import { readFile } from 'node:fs/promises';

const paths = {
  index: 'index.html',
  main: 'src/main.jsx',
  calm: 'src/ui/calm-runtime-v15.js',
  privacy: 'privacy/privacy-v2.js',
  css: 'pointer-v11.css',
  js: 'pointer-v11.js',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, file]) => [key, await readFile(file, 'utf8')])),
);

const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });

check('Application shell does not load legacy pointer stylesheet', !source.index.includes('href="/pointer-v11.css"'), paths.index);
check('Application shell does not load legacy pointer controller', !source.index.includes('src="/pointer-v11.js"'), paths.index);
check('Calm runtime loads before motion systems', source.main.indexOf('calm-runtime-v15.js') < source.main.indexOf('motion-system-v10.js'), paths.main);
check('Calm runtime forces legacy reduced-motion gates', source.calm.includes("'(prefers-reduced-motion: reduce)'") && source.calm.includes('matches: true'), paths.calm);
check('Privacy routes no longer inject global pointer assets', !source.privacy.includes("link.href = '/pointer-v11.css'") && !source.privacy.includes("script.src = '/pointer-v11.js'"), paths.privacy);
check('Privacy keeps reading progress without pointer tracking', source.privacy.includes('privacy-reading-progress') && !source.privacy.includes("addEventListener('pointermove'"), paths.privacy);
check('Legacy pointer implementation remains safely fine-pointer gated if reused', source.js.includes("'(hover: hover) and (pointer: fine)'") && source.js.includes('!finePointer?.matches'), paths.js);
check('Legacy pointer implementation remains reduced-motion gated if reused', source.js.includes("'(prefers-reduced-motion: reduce)'") && source.css.includes('@media (prefers-reduced-motion: reduce)'), paths.js);
check('Legacy pointer overlay never captures clicks', source.css.includes('pointer-events: none'), paths.css);

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nCalm pointer checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
