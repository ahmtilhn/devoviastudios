import { readFile } from 'node:fs/promises';

const paths = {
  main: 'src/main.jsx',
  apps: 'data/apps.json',
  story: 'src/ui/product-story-engine.js',
  data: 'src/ui/product-experience-v7-data.js',
  visuals: 'src/ui/product-visuals-v7.js',
  css: 'src/ui/product-experience-v7.css',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

const apps = JSON.parse(source.apps).apps;
const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });

check('V7 product stylesheet is loaded', source.main.includes("./ui/product-experience-v7.css"), paths.main);
check('V7 product data module is used', source.story.includes("./product-experience-v7-data.js"), paths.story);
check('V7 vector visual renderer is used', source.story.includes("./product-visuals-v7.js"), paths.story);
check('Every published product has four authentic features', apps.every((app) => app.feature_details?.length === 4), paths.apps);
check('Stock Manager no longer promotes unsupported supplier or invoice tracking', !source.apps.match(/supplier tracking|invoice and supplier/i), paths.apps);
check('Stock Manager includes catalog movement dashboard and offline workflows', ['Product catalog and barcode capture','Real-time stock movement history','Inventory dashboard and shortage alerts','Offline storage, reports and backup'].every((text) => source.apps.includes(text)), paths.apps);
check('Arrow Escape includes fading arrows pressure boosters and rewards', ['Fading-arrow memory mechanic','Timer, lives and mistake limits','Vision Cards, Time Freeze and hints','Missions, stars, coins and streak rewards'].every((text) => source.apps.includes(text)), paths.apps);
check('Daily Hadith includes daily content prayer tools and media', ['Hadith and quote of the day','Prayer times and customizable reminders','Qibla compass and haptic smart tasbih','TTS audio, visual cards and Islamic calendar'].every((text) => source.apps.includes(text)), paths.apps);
check('TinySteps includes schedules reminders widget and statistics', ['Daily, selected-day and weekly targets','Smart local reminders','Interactive home-screen widget','Streaks and readable consistency statistics'].every((text) => source.apps.includes(text)), paths.apps);
check('All four app narratives exist', ['app-1','app-2','app-3','app-4'].every((id) => source.data.includes(`'${id}'`)), paths.data);
check('All sixteen custom vector scenes exist', ['stockCatalog','stockMovement','stockInsights','stockOffline','arrowMemory','arrowPressure','arrowBoosters','arrowProgression','hadithDaily','hadithPrayer','hadithTools','hadithMedia','tinySchedules','tinyReminders','tinyWidget','tinyStats'].every((name) => source.visuals.includes(`function ${name}`)), paths.visuals);
check('Scrollytelling uses a sticky visual stage', source.css.includes('.v7-stage-column') && source.css.includes('position: sticky'), paths.css);
check('Feature chapters are viewport-scale sections', source.css.includes('min-height: 86vh'), paths.css);
check('Active feature changes vector scene and real screenshot', source.story.includes('scene.innerHTML = renderProductVisual') && source.story.includes('screenshot.src = product.screenshots'), paths.story);
check('Feature activation uses IntersectionObserver', source.story.includes('const activeObserver = new IntersectionObserver'), paths.story);
check('Scroll progress drives chapter and stage progress', source.story.includes('--v7-chapter-progress') && source.story.includes('data-stage-progress'), paths.story);
check('Old repetitive product detail grids are hidden', ['.detail-grid','.workflow-section','.detail-footer-grid'].every((selector) => source.css.includes(selector)), paths.css);
check('Product pages retain real lazy-loaded screenshots', source.story.includes('loading="lazy" decoding="async"'), paths.story);
check('Every visual system has bespoke active animation rules', ['v7-scan','v7-flow-line','v7-countdown','v7-compass-settle','v7-widget-lift','v7-heat-cell'].every((token) => source.css.includes(token)), paths.css);
check('Reduced motion is supported', source.css.includes('@media (prefers-reduced-motion: reduce)'), paths.css);
check('Product story supports keyboard feature navigation', source.story.includes('button type="button" data-feature-jump') && source.story.includes('scrollIntoView'), paths.story);
check('Product pages include audiences release notes screens and CTA', ['v7-audience-list','v7-release-panel','v7-screen-grid','v7-product-cta'].every((token) => source.story.includes(token)), paths.story);

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nV7 product checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
