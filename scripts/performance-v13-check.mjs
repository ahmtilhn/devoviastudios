import { readFile } from 'node:fs/promises';

const paths = {
  index: 'index.html',
  main: 'src/main.jsx',
  sudoku: 'src/ui/sudoku-development-v13.js',
  performance: 'src/ui/performance-v13.css',
  sudokuLayout: 'src/ui/sudoku-layout-v13.css',
  privacyHub: 'privacy.html',
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
check('Balanced Sudoku layout stylesheet is loaded', source.main.includes("./ui/sudoku-layout-v13.css"), paths.main);
check('Off-screen rendering uses content-visibility', source.performance.includes('content-visibility: auto'), paths.performance);
check('Viewport-sized V10 atmosphere is disabled globally', source.performance.includes('.m10-atmosphere,') && source.performance.includes('.dv-pointer-aura') && source.performance.includes('display: none !important'), paths.performance);
check('Large ambient orbs are disabled', source.performance.includes('.dv-ambient-orb') && source.performance.includes('display: none !important'), paths.performance);
check('Card backdrop filters are disabled globally', source.performance.includes('.glass-panel,') && source.performance.includes('-webkit-backdrop-filter: none !important'), paths.performance);
check('Mobile mode removes remaining expensive filtered backgrounds', source.performance.includes('@media (max-width: 900px)') && source.performance.includes('filter: none !important'), paths.performance);
check('Sudoku integration has no permanent MutationObserver', !source.sudoku.includes('new MutationObserver'), paths.sudoku);
check('Sudoku SPA integration follows history changes', source.sudoku.includes("wrapHistoryMethod('pushState')"), paths.sudoku);
check('Sudoku product card has explicit alignment hardening', source.sudoku.includes('.products-grid [data-sudoku-product-card]'), paths.sudoku);
check('Sudoku mobile product layout collapses to one column', source.sudoku.includes('grid-template-columns:1fr!important'), paths.sudoku);
check('Five-card product layout uses centered three-plus-two composition', source.sudokuLayout.includes('repeat(6, minmax(0, 1fr))') && source.sudokuLayout.includes(':nth-child(4)') && source.sudokuLayout.includes(':nth-child(5)'), paths.sudokuLayout);
check('Homepage four-update composition uses two columns', source.sudokuLayout.includes('.dv-update-grid:has(> [data-sudoku-update])') && source.sudokuLayout.includes('repeat(2, minmax(0, 1fr))'), paths.sudokuLayout);
check('Tablet fifth product is centered', source.sudokuLayout.includes('width: min(100%, 540px)') && source.sudokuLayout.includes('justify-self: center'), paths.sudokuLayout);
check('Privacy center five-card layout is balanced', source.privacyHub.includes('.privacy-app-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }') && source.privacyHub.includes('.privacy-app-card:nth-child(5)'), paths.privacyHub);

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nPerformance V13 checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
