import { spawn } from 'node:child_process';

const child = spawn(process.execPath, ['scripts/browser-journey-check.mjs'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let output = '';
child.stdout.on('data', (chunk) => { output += chunk; });
child.stderr.on('data', (chunk) => { output += chunk; });

child.on('close', (code) => {
  const lines = output.trimEnd().split(/\r?\n/);
  console.log(lines.slice(-120).join('\n'));
  process.exit(code ?? 1);
});
