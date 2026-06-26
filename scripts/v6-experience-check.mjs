import { readFile } from 'node:fs/promises';

const paths = {
  main: 'src/main.jsx',
  story: 'src/ui/product-story-engine.js',
  productData: 'src/ui/product-experience-v7-data.js',
  productVisuals: 'src/ui/product-visuals-v7.js',
  experienceCss: 'src/ui/experience-v6.css',
  performanceJs: 'src/ui/performance-v6.js',
  performanceCss: 'src/ui/performance-v6.css',
  motion: 'src/ui/full-site-motion.js',
  sharedJs: 'src/ui/shared-transitions-v6.js',
  sharedCss: 'src/ui/shared-transitions-v6.css',
  links: 'src/ui/link-normalizer-v6.js',
  privacyCss: 'privacy/privacy-v2.css',
  privacyJs: 'privacy/privacy-v2.js',
  legalLoader: 'privacy/legal-fragments.js',
  privacyIndex: 'privacy.html',
  privacy1: 'privacy/app-1.html',
  privacy2: 'privacy/app-2.html',
  privacy3: 'privacy/app-3.html',
  privacy4: 'privacy/app-4.html',
  stockStart: 'privacy/fragments/stock-manager-01.html',
  stockEnd: 'privacy/fragments/stock-manager-06.html',
  dailyStart: 'privacy/fragments/daily-hadith-privacy-a.html',
  dailyEnd: 'privacy/fragments/daily-hadith-eula.html',
  arrowStart: 'privacy/fragments/arrow-escape-01.html',
  arrowEnd: 'privacy/fragments/arrow-escape-05.html',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });
const turkishInterfaceCopy = /Ana Sayfa|Gizlilik Merkezi|Ürün Sayfası|Destek Merkezi|İletişim/;
const privacyPages = [source.privacyIndex, source.privacy1, source.privacy2, source.privacy3, source.privacy4];

check('Product story engine is loaded', source.main.includes("./ui/product-story-engine.js"), paths.main);
check('V6 supporting experience CSS remains loaded', source.main.includes("./ui/experience-v6.css"), paths.main);
check('Adaptive performance controller is loaded', source.main.includes("./ui/performance-v6.js"), paths.main);
check('Shared transition controller is loaded before native engine', source.main.indexOf("./ui/shared-transitions-v6.js") > -1 && source.main.indexOf("./ui/shared-transitions-v6.js") < source.main.indexOf("./ui/native-web-engine.js"), paths.main);
check('All four products have dedicated experience data', ['app-1', 'app-2', 'app-3', 'app-4'].every((id) => source.productData.includes(`'${id}'`)), paths.productData);
check('All sixteen product visuals exist', ['stockCatalog','stockMovement','stockInsights','stockOffline','arrowMemory','arrowPressure','arrowBoosters','arrowProgression','hadithDaily','hadithPrayer','hadithTools','hadithMedia','tinySchedules','tinyReminders','tinyWidget','tinyStats'].every((variant) => source.productVisuals.includes(variant)), paths.productVisuals);
check('Product stories use real screenshots with lazy async decoding', source.story.includes('loading="lazy" decoding="async"'), paths.story);
check('Test Support retains its dedicated visual system', source.story.includes('test-support-visual-v6') && source.story.includes('support-proof-strip-v6'), paths.story);
check('Supporting experience uses content visibility', source.experienceCss.includes('content-visibility: auto'), paths.experienceCss);
check('Supporting experience supports native view timelines', source.experienceCss.includes('animation-timeline: view(block)'), paths.experienceCss);
check('V6 experience respects reduced motion', source.experienceCss.includes('@media (prefers-reduced-motion: reduce)'), paths.experienceCss);
check('Pointer engine is demand-driven', source.motion.includes('function queuePointerFrame') && !source.motion.includes('pointerFrame = requestAnimationFrame(animatePointer);\n  }\n\n  requestAnimationFrame(scheduleInstall)'), paths.motion);
check('Scroll targets are cached', source.motion.includes('let sectionElements = []') && source.motion.includes('let parallaxElements = []'), paths.motion);
check('Long-task adaptive lite mode exists', source.performanceJs.includes("supportedEntryTypes?.includes('longtask')") && source.performanceJs.includes('ux-lite-motion'), paths.performanceJs);
check('Initial atmosphere waits for first paint', source.performanceCss.includes('html:not(.ux-first-paint)'), paths.performanceCss);
check('Page transitions avoid blur-heavy keyframes', source.performanceCss.includes('@keyframes v6-page-in') && !source.performanceCss.includes('filter: blur'), paths.performanceCss);
check('Product icon shared transition exists', source.sharedJs.includes("view-transition-name', 'product-icon") && source.sharedCss.includes('::view-transition-group(product-icon)'), paths.sharedJs);
check('Product preview shared transition exists', source.sharedJs.includes("view-transition-name', 'product-preview") && source.sharedCss.includes('::view-transition-group(product-preview)'), paths.sharedJs);
check('Legacy relative privacy links are normalized', source.links.includes("/^\\.\\/(privacy|apps)\\//"), paths.links);
check('Privacy pages share the new design system', privacyPages.every((page) => page.includes('privacy-v2.css') && page.includes('privacy-v2.js')), 'privacy/*.html');
check('Privacy pages are English documents', privacyPages.every((page) => page.includes('<html lang="en"')), 'privacy/*.html');
check('Privacy interface copy remains English', privacyPages.every((page) => !turkishInterfaceCopy.test(page)), 'privacy/*.html');
check('Privacy pages support cross-document transitions', source.privacyCss.includes('@view-transition') && source.privacyCss.includes('navigation: auto'), paths.privacyCss);
check('Privacy motion is event-driven', source.privacyJs.includes("addEventListener('pointermove'") && source.privacyJs.includes('if (pointerFrame) return'), paths.privacyJs);
check('Each product privacy page links back to its real product route', ['/products/stock-manager','/products/daily-hadith','/products/tinysteps','/products/arrow-escape'].every((route, index) => privacyPages[index + 1].includes(route)), 'privacy/app-*.html');
check('Long legal documents use local same-origin fragments', [source.privacy1, source.privacy2, source.privacy4].every((page) => page.includes('legal-fragments.js') && page.includes('data-legal-fragment')), 'privacy/app-{1,2,4}.html');
check('Legal fragment loader handles success and failure', source.legalLoader.includes("fetch(source, { credentials: 'same-origin' })") && source.legalLoader.includes('Document unavailable'), paths.legalLoader);
check('Stock Manager policy includes opening and final sections', source.stockStart.includes('1. Purpose of the Application') && source.stockEnd.includes('22. Contact'), 'privacy/fragments/stock-manager-*.html');
check('Daily Hadith documents include privacy and EULA sections', source.dailyStart.includes('1. Introduction') && source.dailyEnd.includes('10. Contact'), 'privacy/fragments/daily-hadith-*.html');
check('Arrow Escape policy includes opening and final sections', source.arrowStart.includes('1. Publisher and Developer Information') && source.arrowEnd.includes('21. Contact'), 'privacy/fragments/arrow-escape-*.html');

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nV6 compatibility checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
