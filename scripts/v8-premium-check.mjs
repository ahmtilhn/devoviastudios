import { readFile } from 'node:fs/promises';

const paths = {
  main: 'src/main.jsx',
  brand: 'src/ui/brand-language-v8.js',
  meta: 'src/ui/brand-meta-v8.js',
  copy: 'src/ui/ux-copy-v8.js',
  motionJs: 'src/ui/premium-motion-v8.js',
  motionCss: 'src/ui/premium-motion-v8.css',
  privacyJs: 'privacy/privacy-v2.js',
  privacyCss: 'privacy/privacy-premium-v8.css',
  docs: 'docs/ux-v8-placeholder.md',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });
const pageTransitionBlock = source.motionCss.slice(source.motionCss.indexOf('Route transitions'), source.motionCss.indexOf('@supports'));

check('Neutral brand language controller is loaded', source.main.includes("./ui/brand-language-v8.js"), paths.main);
check('Neutral homepage metadata refresh is loaded', source.main.includes("./ui/brand-meta-v8.js"), paths.main);
check('Extended UX copy refinements are loaded', source.main.includes("./ui/ux-copy-v8.js"), paths.main);
check('Premium motion CSS and controller are loaded', source.main.includes("./ui/premium-motion-v8.css") && source.main.includes("./ui/premium-motion-v8.js"), paths.main);
check('Nationality positioning is replaced with independent studio language', source.brand.includes("'Netherlands-based mobile product studio', 'Independent digital product studio'") && source.brand.includes('Independent products, built with care.'), paths.brand);
check('Homepage proof no longer displays NL', source.brand.includes("querySelector('strong').textContent = 'Independent'") && source.brand.includes("querySelector('span').textContent = 'Product studio'"), paths.brand);
check('About and footer copy contain no nationality claim', source.brand.includes('independent digital product studio') && source.brand.includes('An independent studio designing useful apps'), paths.brand);
check('Neutral metadata contains no country positioning', !/Netherlands|Dutch|Holland|\bNL\b/i.test(source.meta), paths.meta);
check('Service and conversion copy is outcome-led', ['Outcome-led experience design','Product continuity','Operational release readiness','A promising idea deserves a considered product system.'].every((text) => source.copy.includes(text)), paths.copy);
check('Premium reveals use role-based choreography', source.motionJs.includes("['.dv-hero h1") && source.motionJs.includes("dataset.pmState = 'visible'"), paths.motionJs);
check('Legacy exaggerated tilt is disabled', source.motionCss.includes('.ux-tilt-target') && source.motionCss.includes('transform: translate3d(0, 0, 0) !important'), paths.motionCss);
check('Surface response uses subtle three-pixel lift', source.motionCss.includes('translate: 0 -3px'), paths.motionCss);
check('Pointer ambience is reduced', source.motionCss.includes('.ux-cursor-cloud') && source.motionCss.includes('opacity: .14') && source.motionCss.includes('filter: blur(110px)'), paths.motionCss);
check('Route transition override contains no blur', pageTransitionBlock.includes('@keyframes pm-page-in') && !pageTransitionBlock.includes('blur('), paths.motionCss);
check('Route transitions use premium easing', source.motionCss.includes('cubic-bezier(.22, 1, .36, 1)'), paths.motionCss);
check('Product demonstrations settle after one play', source.motionCss.includes('animation-iteration-count: 1') && source.motionCss.includes('animation-fill-mode: both'), paths.motionCss);
check('Older reveal systems are explicitly neutralized', source.motionCss.includes('Disable the older blur-heavy reveal systems') && source.motionCss.includes('filter: none'), paths.motionCss);
check('Reduced-motion policy is present', source.motionCss.includes('@media (prefers-reduced-motion: reduce)') && source.motionCss.includes('animation: none !important'), paths.motionCss);
check('Privacy premium stylesheet is injected', source.privacyJs.includes('privacy-premium-v8.css'), paths.privacyJs);
check('Privacy animation loops are converted to finite motion', source.privacyCss.includes('animation: privacy-v8-chip') && source.privacyCss.includes('1 both !important'), paths.privacyCss);
check('Privacy page transitions contain no blur', source.privacyCss.includes('@keyframes privacy-v8-page-in') && !source.privacyCss.includes('blur('), paths.privacyCss);
check('V8 implementation documentation replaced placeholder', source.docs.includes('Premium Motion and Neutral Brand Language') && !source.docs.trim().startsWith('placeholder'), paths.docs);

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nV8 premium checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
