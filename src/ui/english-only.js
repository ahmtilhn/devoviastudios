const englishLanguage = 'en-US';
const currentUrl = new URL(window.location.href);

if (currentUrl.searchParams.has('lang')) {
  currentUrl.searchParams.delete('lang');
  window.history.replaceState(
    window.history.state,
    '',
    `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
  );
}

document.documentElement.lang = 'en';
window.__DEVOVIA_LANGUAGE__ = 'en';

for (const [property, value] of [
  ['language', englishLanguage],
  ['languages', [englishLanguage, 'en']],
]) {
  try {
    Object.defineProperty(window.navigator, property, {
      configurable: true,
      get: () => value,
    });
  } catch {
    // Some browsers expose these as non-configurable. The document language
    // and removed language query still keep the public UI English-first.
  }
}

const languageLock = new MutationObserver(() => {
  if (document.documentElement.lang !== 'en') document.documentElement.lang = 'en';
});
languageLock.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
window.addEventListener('pagehide', () => languageLock.disconnect(), { once: true });
