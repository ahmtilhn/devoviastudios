import { readFile, access } from 'node:fs/promises';

const textPaths = {
  main: 'src/main.jsx',
  runtime: 'src/ui/sudoku-development-v13.js',
  postbuild: 'scripts/postbuild.mjs',
  sudokuPostbuild: 'scripts/sudoku-postbuild.mjs',
  canonical: 'src/ui/canonical-route-redirect-v12.js',
  normalizer: 'src/ui/link-normalizer-v6.js',
  productSelect: 'src/ui/product-select.js',
  privacyHub: 'privacy.html',
  privacy: 'privacy/app-5.html',
  terms: 'privacy/sudoku-duel-terms.html',
  deletion: 'privacy/sudoku-duel-delete-account.html',
  appAds: 'apps/app-5/app-ads.txt',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(textPaths).map(async ([key, file]) => [key, await readFile(file, 'utf8')])),
);

const assetPaths = [
  'public/products/sudoku-duel/icon.svg',
  'public/products/sudoku-duel/preview-1.svg',
  'public/products/sudoku-duel/preview-2.svg',
  'public/products/sudoku-duel/preview-3.svg',
];

const assetExists = await Promise.all(assetPaths.map(async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}));

const checks = [];
const check = (name, value, file) => checks.push({ name, value: Boolean(value), file });

check('Sudoku runtime is loaded by the site', source.main.includes("./ui/sudoku-development-v13.js"), textPaths.main);
check('Product route is generated during postbuild', source.postbuild.includes("'/products/sudoku-duel'"), textPaths.postbuild);
check('Privacy policy is published as app-5 / sudoku-duel', source.postbuild.includes("{ id: 'app-5', fileName: 'app-5.html', slug: 'sudoku-duel' }"), textPaths.postbuild);
check('Legacy project route redirects to canonical product route', source.canonical.includes("['/projects/sudoku-duel', '/products/sudoku-duel']"), textPaths.canonical);
check('Legacy app-5 privacy route redirects to clean privacy route', source.canonical.includes("['/privacy/app-5.html', '/privacy/sudoku-duel']"), textPaths.canonical);
check('Global link normalizer knows the Sudoku privacy route', source.normalizer.includes("['/privacy/app-5.html', '/privacy/sudoku-duel']"), textPaths.normalizer);
check('Support selector includes Sudoku Duel', source.productSelect.includes("'Sudoku Duel'"), textPaths.productSelect);
check('Privacy center exposes live Sudoku Duel status', source.privacyHub.includes('<h2>Sudoku Duel</h2>') && source.privacyHub.includes('Available on Google Play.'), textPaths.privacyHub);
check('Privacy policy reflects Android release and iOS next', source.privacy.includes('Product status: Available on Google Play') && source.privacy.includes('Release notice:') && source.privacy.includes('iOS coming soon'), textPaths.privacy);
check('Privacy policy covers accounts and online matches', source.privacy.includes('Guest accounts, protected accounts and identifiers') && source.privacy.includes('Social and online-match data'), textPaths.privacy);
check('Privacy policy covers purchases, ads, notifications and diagnostics', ['Virtual Coins, rewards and purchase verification','Rewarded advertising, consent and advertising identifiers','Notifications','Analytics, diagnostics and security'].every((value) => source.privacy.includes(value)), textPaths.privacy);
check('Terms define Coins as non-cash virtual items', source.terms.includes('no cash value') && source.terms.includes('cannot be transferred between players'), textPaths.terms);
check('Account deletion page exposes in-app and web paths', source.deletion.includes('Option 1 — Delete directly inside the app') && source.deletion.includes('Option 2 — Start a deletion request from the web'), textPaths.deletion);
check('Account deletion page documents the anti-abuse tombstone', source.deletion.includes('abuse-prevention tombstone'), textPaths.deletion);
check('Sudoku app-ads mirror has the real Google publisher ID', source.appAds.includes('google.com, pub-8422988604275177, DIRECT, f08c47fec0942fa0'), textPaths.appAds);
check('Sudoku runtime links the live Android listing without fabricating metrics', source.runtime.includes('play.google.com/store/apps/details?id=com.devoviastudio.sudoku') && source.runtime.includes('Available on Google Play') && source.runtime.includes('iOS coming soon') && !source.runtime.includes('downloads_text'), textPaths.runtime);
check('Sudoku product route gets live-store canonical SEO metadata', source.sudokuPostbuild.includes('Sudoku Duel — Available on Google Play | Devovia Studio') && source.sudokuPostbuild.includes("'@type': 'VideoGame'") && source.sudokuPostbuild.includes('com.devoviastudio.sudoku'), textPaths.sudokuPostbuild);
check('All Sudoku visual assets exist', assetExists.every(Boolean), assetPaths.join(', '));

const failures = checks.filter((item) => !item.value);
for (const item of checks) console.log(`${item.value ? 'PASS' : 'FAIL'}  ${item.name}  [${item.file}]`);
console.log(`\nSudoku website checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
