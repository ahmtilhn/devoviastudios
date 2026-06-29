import fs from 'node:fs';

const css = fs.readFileSync('src/ui/card-layout-cleanup-v12.css', 'utf8');
const failures = [];

function check(name, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}`);
  if (!condition) failures.push(name);
}

check('Desktop footer restores four-column composition', css.includes('minmax(280px, 1.7fr) repeat(3, minmax(110px, 1fr))'));
check('Tablet footer keeps three navigation columns beside the brand', css.includes('minmax(230px, 1.35fr) repeat(3, minmax(90px, 1fr))'));
check('Mobile footer keeps navigation groups in compact columns', css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'));
check('Mobile brand spans the footer width', css.includes('grid-column: 1 / -1'));
check('Small mobile footer avoids cramped three-column links', css.includes('@media (max-width: 460px)'));

console.log(`\nFooter layout contract: ${5 - failures.length}/5 checks passed.`);
if (failures.length) process.exit(1);
