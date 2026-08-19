import { readFile } from 'node:fs/promises';

const main = await readFile('src/main.jsx', 'utf8');
const css = await readFile('src/ui/updates-layout-v14.css', 'utf8');

const checks = [
  ['Updates V14 stylesheet is loaded', main.includes("./ui/updates-layout-v14.css")],
  ['Updates layout uses a single balanced content column', css.includes(".updates-layout {\n  grid-template-columns: minmax(0, 1fr)")],
  ['Timeline uses equal desktop columns', css.includes(".timeline-list {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr))")],
  ['Five product stories use balanced 3 + 2 placement', css.includes('grid-column-start: 2') && css.includes('grid-column-start: 4')],
  ['Single filtered product cards are centered', css.includes('width: min(100%, 760px)')],
  ['Mobile filters scroll without wrapping', css.includes('overflow-x: auto') && css.includes('flex-wrap: nowrap')],
  ['Mobile cards collapse to one column', css.includes("grid-template-columns: minmax(0, 1fr) !important")],
];

let failures = 0;
for (const [name, pass] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}`);
  if (!pass) failures += 1;
}

console.log(`\nUpdates layout checks: ${checks.length - failures}/${checks.length} passed.`);
if (failures) process.exit(1);
