const privacyRouteMap = [
  [/\/SM-PP(?:[/?#]|$)/i, '/privacy/app-1.html'],
  [/\/DH-PP(?:[/?#]|$)/i, '/privacy/app-2.html'],
  [/\/TS-PP(?:[/?#]|$)/i, '/privacy/app-3.html'],
  [/\/pp-arrow-escape(?:[/?#]|$)/i, '/privacy/app-4.html'],
];

function normalizeAnchor(anchor) {
  if (!anchor) return;
  const href = anchor.getAttribute('href') || '';

  if (/^\.\/(privacy|apps)\//.test(href)) {
    anchor.setAttribute('href', `/${href.slice(2)}`);
    return;
  }

  if (href.includes('sites.google.com/view/devoviastudio/privacy-policy')) {
    const route = privacyRouteMap.find(([pattern]) => pattern.test(href));
    anchor.setAttribute('href', route?.[1] || '/privacy.html');
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
  }
}

function handleAnchorEvent(event) {
  normalizeAnchor(event.target.closest?.('a[href]'));
}

document.addEventListener('pointerover', handleAnchorEvent, { capture: true, passive: true });
document.addEventListener('focusin', handleAnchorEvent, { capture: true });
document.addEventListener('click', handleAnchorEvent, { capture: true });
window.addEventListener('pagehide', () => {
  document.removeEventListener('pointerover', handleAnchorEvent, { capture: true });
  document.removeEventListener('focusin', handleAnchorEvent, { capture: true });
  document.removeEventListener('click', handleAnchorEvent, { capture: true });
}, { once: true });
