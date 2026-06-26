function normalizeAnchor(anchor) {
  if (!anchor) return;
  const href = anchor.getAttribute('href') || '';
  if (/^\.\/(privacy|apps)\//.test(href)) anchor.setAttribute('href', `/${href.slice(2)}`);
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
