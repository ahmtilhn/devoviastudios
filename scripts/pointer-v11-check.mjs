import { readFile } from 'node:fs/promises';

const paths = {
  index: 'index.html',
  css: 'pointer-v11.css',
  js: 'pointer-v11.js',
  privacy: 'privacy/privacy-v2.js',
  package: 'package.json',
  copy: 'scripts/copy-pointer-v11.mjs',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, file]) => [key, await readFile(file, 'utf8')])),
);

const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });

check('Application shell loads pointer stylesheet', source.index.includes('href="/pointer-v11.css"'), paths.index);
check('Application shell loads pointer controller', source.index.includes('src="/pointer-v11.js"'), paths.index);
check('Production build copies standalone pointer assets', source.package.includes('copy-pointer-v11.mjs') && source.copy.includes("'pointer-v11.css', 'pointer-v11.js'"), paths.copy);
check('Privacy routes inject the same global pointer system', source.privacy.includes("link.href = '/pointer-v11.css'") && source.privacy.includes("script.src = '/pointer-v11.js'"), paths.privacy);
check('Pointer system only activates for a fine hover pointer', source.js.includes("'(hover: hover) and (pointer: fine)'") && source.js.includes('!finePointer?.matches'), paths.js);
check('Reduced motion disables the pointer system', source.js.includes("'(prefers-reduced-motion: reduce)'") && source.css.includes('@media (prefers-reduced-motion: reduce)'), paths.css);
check('Admin route retains native interaction', source.js.includes("location.pathname === '/admin'"), paths.js);
check('High-frequency pointer samples use a safe coalesced-event fallback', source.js.includes('getCoalescedEvents') && source.js.includes('samples?.length ? samples[samples.length - 1] : event'), paths.js);
check('Animation integrates requestAnimationFrame timestamps', source.js.includes('function animate(timestamp)') && source.js.includes('timestamp - state.lastTimestamp'), paths.js);
check('High refresh-rate movement is frame normalized', source.js.includes('deltaFrames = elapsed / 16.667') && source.js.includes('frameEase'), paths.js);
check('Trail rendering uses one fixed canvas', source.js.includes('<canvas class="p11-trail">') && source.js.includes('drawTrail()'), paths.js);
check('Canvas resolution is capped for performance', source.js.includes('Math.min(window.devicePixelRatio || 1, 1.75)'), paths.js);
check('Cursor docks to interactive control geometry', source.js.includes('refreshDockRect') && source.js.includes('rect.width + 12') && source.css.includes("data-mode='dock'"), paths.js);
check('Large cards receive local light instead of oversized docking', source.js.includes('rect.width > 330 || rect.height > 122') && source.css.includes("data-p11-surface='true'"), paths.js);
check('Pointer velocity controls elastic stretch', source.js.includes('const stretch = state.mode ===') && source.js.includes('state.angle'), paths.js);
check('Click feedback is transform-only', source.js.includes('createWave') && source.js.includes('scale(4.8)'), paths.js);
check('Palette follows active V10 or privacy page colors', source.js.includes('--m10-r') && source.js.includes('--privacy-theme-rgb'), paths.js);
check('Native input cursors remain available', source.css.includes('html.pointer-v11-active input') && source.css.includes('cursor: auto !important'), paths.css);
check('Touch and coarse pointers never render the overlay', source.css.includes('(hover: none), (pointer: coarse)'), paths.css);
check('BFCache lifecycle is preserved', source.js.includes("window.addEventListener('pageshow'") && source.js.includes('if (!event.persisted) destroy()'), paths.js);
check('Overlay never captures clicks', source.css.includes('pointer-events: none'), paths.css);

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nPointer V11 checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
