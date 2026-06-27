const privacyRouteMap = [
  [/\/SM-PP(?:[/?#]|$)/i, '/privacy/app-1.html'],
  [/\/DH-PP(?:[/?#]|$)/i, '/privacy/app-2.html'],
  [/\/TS-PP(?:[/?#]|$)/i, '/privacy/app-3.html'],
  [/\/pp-arrow-escape(?:[/?#]|$)/i, '/privacy/app-4.html'],
];

function localPrivacyRoute(href) {
  const route = privacyRouteMap.find(([pattern]) => pattern.test(href));
  return route?.[1] || '/privacy.html';
}

function normalizeAnchor(anchor) {
  if (!anchor) return;
  const href = anchor.getAttribute('href') || '';
  const label = anchor.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() || '';

  if (/app-ads\.txt(?:[?#]|$)/i.test(href) || label === 'app-ads.txt') {
    anchor.remove();
    return;
  }

  if (label === 'privacy hub' || label === 'terms & policies') {
    anchor.setAttribute('href', '/privacy.html');
  }

  if (/^\.\/(privacy|apps)\//.test(href)) {
    anchor.setAttribute('href', `/${href.slice(2)}`);
  }

  const currentHref = anchor.getAttribute('href') || '';
  if (currentHref.includes('sites.google.com/view/devoviastudio/privacy-policy')) {
    if (/\/terms-of-service(?:[/?#]|$)/i.test(currentHref)) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
      return;
    }
    anchor.setAttribute('href', localPrivacyRoute(currentHref));
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
  }
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
