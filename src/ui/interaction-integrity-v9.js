function normalizeProductFilters(root = document) {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/products') return;

  root.querySelectorAll?.('.filter-row button').forEach((button) => {
    const label = button.textContent?.replace(/\s+/g, ' ').trim();
    if (label !== 'Utility') return;
    button.hidden = true;
    button.setAttribute('aria-hidden', 'true');
    button.tabIndex = -1;
  });
}

let frame = 0;
function scheduleFilterIntegrity(root = document) {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    normalizeProductFilters(root instanceof Element ? root : document);
  });
}

const observer = new MutationObserver((records) => {
  records.forEach((record) => scheduleFilterIntegrity(record.target));
});

observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => scheduleFilterIntegrity(), { once: true });
} else {
  scheduleFilterIntegrity();
}
window.addEventListener('popstate', () => scheduleFilterIntegrity());
window.addEventListener('pageshow', () => scheduleFilterIntegrity());
