import { readFile } from 'node:fs/promises';

const paths = {
  main: 'src/main.jsx',
  js: 'src/ui/motion-system-v10.js',
  css: 'src/ui/motion-system-v10.css',
  hardening: 'src/ui/motion-system-v10-hardening.css',
  compat: 'src/ui/motion-system-v10-compat.js',
  privacyJs: 'privacy/privacy-v2.js',
  privacyCss: 'privacy/privacy-motion-v10.css',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, file]) => [key, await readFile(file, 'utf8')])),
);

const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });

check('V10 stylesheet loads after legacy styling', source.main.indexOf('premium-motion-v8.css') < source.main.indexOf('motion-system-v10.css'), paths.main);
check('V10 controller is active', source.main.includes("./ui/motion-system-v10.js"), paths.main);
check('Legacy motion controllers are inactive', !source.main.includes("./ui/premium-motion-v8.js") && !source.main.includes("./redesign/immersive-motion.js"), paths.main);
check('Browser-safe ambient override is loaded', source.main.includes("./ui/motion-system-v10-hardening.css"), paths.main);
check('All page profiles are classified', ['home','catalog','product-detail','services','service-detail','updates','blog','article','support','contact'].every((profile) => source.js.includes(`'${profile}'`)), paths.js);
check('Contextual reveal roles exist', ['kicker','title','copy','action','visual','surface','editorial','utility'].every((role) => source.js.includes(`'${role}'`)), paths.js);
check('Contextual surface types exist', ['service','product','editorial','utility'].every((type) => source.js.includes(`'${type}'`)), paths.js);
check('Route relationships drive transition types', ['drill','return','editorial','utility','home-depart','home-return'].every((type) => source.js.includes(`'${type}'`)), paths.js);
check('Synthetic React popstate cannot nest transitions', source.js.includes('if (!event.isTrusted)') && source.js.includes('Only real browser history traversal starts a new one'), paths.js);
check('BFCache pages retain motion listeners', source.js.includes('if (event.persisted) return;') && source.js.includes("window.addEventListener('pageshow'"), paths.js);
check('Filter changes use FLIP choreography', source.js.includes('captureFilterLayout') && source.js.includes('runFilterFlip') && source.js.includes('getBoundingClientRect'), paths.js);
check('Shared editorial title continuity exists', source.js.includes('m10-shared-title') && source.js.includes('markSharedTitle'), paths.js);
check('Pointer motion uses browser-valid pixel variables', source.js.includes('--m10-ambient-x') && source.hardening.includes('var(--m10-ambient-x, 0px)'), paths.hardening);
check('Homepage has dedicated product theatre', source.css.includes("html[data-motion-page='home'] .dv-hero-showcase") && source.css.includes('.dv-showcase-card:hover'), paths.css);
check('Product detail has dedicated device focus', source.css.includes("html[data-motion-page='product-detail'] .detail-device-row .device:hover"), paths.css);
check('Services use architectural line and icon motion', source.css.includes("[data-m10-surface='service']::before") && source.css.includes('rotate(-3deg)'), paths.css);
check('Editorial cards use reading-line motion', source.css.includes("[data-m10-surface='editorial']::before") && source.css.includes('scaleY(1)'), paths.css);
check('Support and forms use calm operational motion', source.css.includes("html[data-motion-page='support']") && source.css.includes('.support-form label:focus-within'), paths.css);
check('Route transitions are relationship-specific', ['m10-drill-in','m10-return-in','m10-editorial-in','m10-utility-in','m10-home-in'].every((name) => source.css.includes(`@keyframes ${name}`)), paths.css);
check('Reduced motion disables choreography', source.css.includes('@media (prefers-reduced-motion: reduce)') && source.css.includes('animation-duration: .001ms !important'), paths.css);
check('Privacy pages load V10 motion', source.privacyJs.includes('privacy-motion-v10.css') && source.privacyJs.includes("root.classList.add('privacy-motion-v10')"), paths.privacyJs);
check('Privacy pages provide reading progress', source.privacyJs.includes('privacy-reading-progress') && source.privacyCss.includes('--privacy-progress'), paths.privacyCss);
check('Legal content uses calm directional reveal', source.privacyCss.includes("data-privacy-role='legal'") && source.privacyCss.includes('translate3d(14px, 0, 0)'), paths.privacyCss);
check('Privacy reduced-motion policy exists', source.privacyCss.includes('@media (prefers-reduced-motion: reduce)'), paths.privacyCss);
check('Legacy back animation is canceled only when matched', source.compat.includes('isLegacyBack') && source.compat.includes("includes('-18px')"), paths.compat);

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nMotion V10 checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
