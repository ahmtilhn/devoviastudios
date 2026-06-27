const privacyRouteMap = [
  [/\/SM-PP(?:[/?#]|$)/i, '/privacy/stock-manager'],
  [/\/DH-PP(?:[/?#]|$)/i, '/privacy/daily-hadith'],
  [/\/TS-PP(?:[/?#]|$)/i, '/privacy/tinysteps'],
  [/\/pp-arrow-escape(?:[/?#]|$)/i, '/privacy/arrow-escape'],
];

const canonicalPathMap = new Map([
  ['/privacy.html', '/privacy'],
  ['/privacy/app-1.html', '/privacy/stock-manager'],
  ['/privacy/app-2.html', '/privacy/daily-hadith'],
  ['/privacy/app-3.html', '/privacy/tinysteps'],
  ['/privacy/app-4.html', '/privacy/arrow-escape'],
  ['/products/stockflow-inventory', '/products/stock-manager'],
  ['/projects/stockflow-inventory', '/products/stock-manager'],
  ['/projects/stock-manager', '/products/stock-manager'],
  ['/projects/arrow-escape', '/products/arrow-escape'],
  ['/projects/daily-hadith', '/products/daily-hadith'],
  ['/projects/tinysteps', '/products/tinysteps'],
]);

function localPrivacyRoute(href) {
  const route = privacyRouteMap.find(([pattern]) => pattern.test(href));
  return route?.[1] || '/privacy';
}

function canonicalLocalHref(href) {
  if (!href || /^(?:mailto:|tel:|javascript:|data:|#)/i.test(href)) return href;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return href;
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const canonicalPath = canonicalPathMap.get(path);
    return canonicalPath ? `${canonicalPath}${url.search}${url.hash}` : href;
  } catch {
    return href;
  }
}

function normalizeAnchor(anchor) {
  if (!anchor) return;
  const href = anchor.getAttribute('href') || '';
  const label = anchor.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() || '';

  if (/app-ads\.txt(?:[?#]|$)/i.test(href) || label === 'app-ads.txt') {
    anchor.remove();
    return;
  }

  if (label === 'privacy hub' || label === 'privacy center' || label === 'terms & policies') {
    anchor.setAttribute('href', '/privacy');
  }

  if (/^\.\/(privacy|apps)\//.test(href)) {
    anchor.setAttribute('href', `/${href.slice(2)}`);
  }

  let currentHref = anchor.getAttribute('href') || '';
  if (currentHref.includes('sites.google.com/view/devoviastudio/privacy-policy')) {
    if (/\/terms-of-service(?:[/?#]|$)/i.test(currentHref)) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
      return;
    }
    anchor.setAttribute('href', localPrivacyRoute(currentHref));
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
    currentHref = anchor.getAttribute('href') || '';
  }

  const canonicalHref = canonicalLocalHref(currentHref);
  if (canonicalHref !== currentHref) anchor.setAttribute('href', canonicalHref);
}

function dedupeLocalLinks(container) {
  const seen = new Set();
  container.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href) return;
    if (seen.has(href)) anchor.remove();
    else seen.add(href);
  });
}

function normalizeTree(root = document) {
  if (root.matches?.('a[href]')) normalizeAnchor(root);
  root.querySelectorAll?.('a[href]').forEach(normalizeAnchor);
  root.querySelectorAll?.('.privacy-link-stack, .support-app-card').forEach(dedupeLocalLinks);
}

function handleAnchorEvent(event) {
  normalizeAnchor(event.target.closest?.('a[href]'));
}

normalizeTree();
const observer = new MutationObserver((records) => {
  records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) normalizeTree(node);
  }));
});
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });

document.addEventListener('pointerover', handleAnchorEvent, { capture: true, passive: true });
document.addEventListener('focusin', handleAnchorEvent, { capture: true });
document.addEventListener('click', handleAnchorEvent, { capture: true });
