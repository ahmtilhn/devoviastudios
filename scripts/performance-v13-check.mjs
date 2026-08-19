import { readFile } from 'node:fs/promises';

const paths = {
  index: 'index.html',
  main: 'src/main.jsx',
  sudoku: 'src/ui/sudoku-development-v13.js',
  performance: 'src/ui/performance-v13.css',
  package: 'package.json',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, file]) => [key, await readFile(file, 'utf8')])),
);

const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });

check('Global pointer stylesheet is no longer loaded', !source.index.includes('pointer-v11.css'), paths.index);
check('Global pointer runtime is no longer loaded', !source.index.includes('pointer-v11.js'), paths.index);
check('Unused pointer assets are not copied into production', !source.package.includes('copy-pointer-v11.mjs'), paths.package);
check('Performance V13 stylesheet is loaded', source.main.includes("./ui/performance-v13.css"), paths.main);
check('Off-screen rendering uses content-visibility', source.performance.includes('content-visibility: auto'), paths.performance);
check('Lite motion disables expensive atmosphere layers', source.performance.includes('html.ux-lite-motion .m10-atmosphere'), paths.performance);
check('Mobile mode removes expensive backdrop filters', source.performance.includes('backdrop-filter: none !important'), paths.performance);
check('Sudoku integration has no permanent MutationObserver', !source.sudoku.includes('new MutationObserver'), paths.sudoku);
check('Sudoku SPA integration follows history changes', source.sudoku.includes("wrapHistoryMethod('pushState')"), paths.sudoku);
check('Sudoku product card has explicit alignment hardening', source.sudoku.includes('.products-grid [data-sudoku-product-card]'), paths.sudoku);
check('Sudoku mobile product layout collapses to one column', source.sudoku.includes('grid-template-columns:1fr!important'), paths.sudoku);

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nPerformance V13 checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
