import { readFile } from 'node:fs/promises';

const paths = {
  main: 'src/main.jsx',
  brand: 'src/ui/brand-language-v8.js',
  meta: 'src/ui/brand-meta-v8.js',
  copy: 'src/ui/ux-copy-v8.js',
  motionJs: 'src/ui/motion-system-v10.js',
  motionCss: 'src/ui/motion-system-v10.css',
  privacyJs: 'privacy/privacy-v2.js',
  privacyCss: 'privacy/privacy-motion-v10.css',
  docs: 'docs/ux-v8-placeholder.md',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });
const pageTransitionBlock = source.motionCss.slice(source.motionCss.indexOf('Route choreography'), source.motionCss.indexOf('@media (max-width'));

check('Neutral brand language controller is loaded', source.main.includes("./ui/brand-language-v8.js"), paths.main);
check('Neutral homepage metadata refresh is loaded', source.main.includes("./ui/brand-meta-v8.js"), paths.main);
check('Extended UX copy refinements are loaded', source.main.includes("./ui/ux-copy-v8.js"), paths.main);
check('Contextual V10 motion CSS and controller are loaded', source.main.includes("./ui/motion-system-v10.css") && source.main.includes("./ui/motion-system-v10.js"), paths.main);
check('Legacy V8 and homepage motion controllers are not loaded', !source.main.includes("./ui/premium-motion-v8.js") && !source.main.includes("./redesign/immersive-motion.js"), paths.main);
check('Nationality positioning is replaced with independent studio language', source.brand.includes("'Netherlands-based mobile product studio', 'Independent digital product studio'") && source.brand.includes('Independent products, built with care.'), paths.brand);
check('Homepage proof no longer displays NL', source.brand.includes("querySelector('strong').textContent = 'Independent'") && source.brand.includes("querySelector('span').textContent = 'Product studio'"), paths.brand);
check('About and footer copy contain no nationality claim', source.brand.includes('independent digital product studio') && source.brand.includes('An independent studio designing useful apps'), paths.brand);
check('Neutral metadata contains no country positioning', !/Netherlands|Dutch|Holland|\bNL\b/i.test(source.meta), paths.meta);
check('Service and conversion copy is outcome-led', ['Outcome-led experience design','Product continuity','Operational release readiness','A promising idea deserves a considered product system.'].every((text) => source.copy.includes(text)), paths.copy);
check('V10 reveals use contextual role choreography', source.motionJs.includes('const revealRules') && source.motionJs.includes("dataset.m10State = 'visible'"), paths.motionJs);
check('V10 defines page-specific motion profiles', ['product-detail','service-detail','updates','blog','article','support','contact'].every((profile) => source.motionJs.includes(`'${profile}'`)), paths.motionJs);
check('Surface response stays restrained', source.motionCss.includes("[data-m10-surface='service']:hover") && source.motionCss.includes('translate3d(0, -5px, 0)'), paths.motionCss);
check('Pointer ambience is environmental rather than cursor-like', source.motionCss.includes('.m10-atmosphere') && source.motionCss.includes('filter: blur(34px)'), paths.motionCss);
check('Route transitions contain no blur', pageTransitionBlock.includes('@keyframes m10-drill-in') && !pageTransitionBlock.includes('blur('), paths.motionCss);
check('Route transitions vary by content relationship', ['drill','return','editorial','utility','home-depart'].every((type) => source.motionCss.includes(`data-motion-transition='${type}'`)), paths.motionCss);
check('Filter changes use FLIP movement', source.motionJs.includes('captureFilterLayout') && source.motionJs.includes('runFilterFlip'), paths.motionJs);
check('Older reveal systems are explicitly neutralized', source.motionCss.includes('legacy engines remain visually dormant') && source.motionCss.includes('filter: none'), paths.motionCss);
check('Reduced-motion policy is present', source.motionCss.includes('@media (prefers-reduced-motion: reduce)') && source.motionCss.includes('transition-duration: .001ms !important'), paths.motionCss);
check('Privacy V10 stylesheet is injected', source.privacyJs.includes('privacy-motion-v10.css'), paths.privacyJs);
check('Privacy animation loops are finite', source.privacyCss.includes('privacy-m10-chip-settle 900ms') && !source.privacyCss.includes('infinite'), paths.privacyCss);
check('Privacy page transitions contain no blur', source.privacyCss.includes('@keyframes privacy-m10-page-in') && !source.privacyCss.includes('blur('), paths.privacyCss);
check('V8 implementation documentation replaced placeholder', source.docs.includes('Premium Motion and Neutral Brand Language') && !source.docs.trim().startsWith('placeholder'), paths.docs);

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nPremium motion checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
