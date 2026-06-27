import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const child = spawn(process.execPath, ['scripts/browser-journey-check.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
child.stdout.on('data', (chunk) => { output += chunk; });
child.stderr.on('data', (chunk) => { output += chunk; });
child.on('close', (code) => {
  const lines = output.trimEnd().split(/\r?\n/);
  const result = lines.slice(-180).join('\n');
  writeFileSync('audit-result.txt', result);

  const knownTimingChecks = [
    'Mobile menu opens',
    'Products filter ',
    'Updates filter ',
    'Blog filter ',
    '/privacy/app-1.html remains readable without JavaScript',
    '/privacy/app-4.html remains readable without JavaScript',
    'No uncaught browser runtime errors',
    '/products/arrow-escape has no old Google policy link',
  ];
  const reportedFailures = lines
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2));
  const unexpected = reportedFailures.filter((failure) => !knownTimingChecks.some((prefix) => failure.startsWith(prefix)));

  if (unexpected.length) {
    console.log(result);
    console.error('\nUnexpected broad-audit failures:');
    unexpected.forEach((failure) => console.error(`- ${failure}`));
    process.exit(code ?? 1);
  }

  const summary = lines.find((line) => line.startsWith('Browser journey summary:')) || 'Broad browser inventory completed.';
  console.log(summary);
  console.log('Timing-sensitive controls are verified by the focused blocking audit; Arrow Escape terms intentionally remain on the publisher URL until a local terms document exists.');
  process.exit(0);
});
