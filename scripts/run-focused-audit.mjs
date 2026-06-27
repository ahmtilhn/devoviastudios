import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const child = spawn(process.execPath, ['scripts/focused-interaction-check.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
child.stdout.on('data', (chunk) => { output += chunk; });
child.stderr.on('data', (chunk) => { output += chunk; });
child.on('close', (code) => {
  const result = output.trimEnd().split(/\r?\n/).slice(-120).join('\n');
  writeFileSync('focused-audit-result.txt', result);
  console.log(result);
  process.exit(code ?? 1);
});
