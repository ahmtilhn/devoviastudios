const transitionKey = 'devovia-product-shared-transition';
let cleanupTimer = 0;
let installFrame = 0;

function isProductUrl(url) {
  const path = new URL(url, window.location.href).pathname;
  return /^\/(products|projects)\/[^/]+\/?$/.test(path);
}

function clearNames(elements) {
  elements.forEach((element) => element?.style.removeProperty('view-transition-name'));
}

function markProductSource(anchor) {
  const card = anchor.closest('.product-card, .dv-product');
  if (!card) return;
  const icon = card.querySelector('.product-card-top img, .dv-product-heading img, .dv-floating-icon');
  const preview = card.querySelector('.ux-product-stage img, .dv-phone.phone-2, .dv-phone img');
  if (icon) icon.style.setProperty('view-transition-name', 'product-icon');
  if (preview) {
    const frame = preview.closest('.dv-phone') || preview;
    frame.style.setProperty('view-transition-name', 'product-preview');
  }
  try { sessionStorage.setItem(transitionKey, String(Date.now())); } catch { /* optional enhancement */ }
  window.clearTimeout(cleanupTimer);
  cleanupTimer = window.setTimeout(() => clearNames([icon, preview?.closest('.dv-phone') || preview]), 1800);
}

function hasPendingTransition() {
  try {
    const createdAt = Number(sessionStorage.getItem(transitionKey) || 0);
    return Date.now() - createdAt < 6000;
  } catch {
    return false;
  }
}

function installProductTarget() {
  installFrame = 0;
  if (!hasPendingTransition()) return;
  const icon = document.querySelector('.product-hero-detail .product-title-row img');
  const devices = document.querySelectorAll('.product-hero-detail .detail-device-row .device');
  const preview = devices[1] || devices[0];
  if (!icon || !preview) return;

  icon.style.setProperty('view-transition-name', 'product-icon');
  preview.style.setProperty('view-transition-name', 'product-preview');
  document.documentElement.classList.add('product-shared-transition');
  try { sessionStorage.removeItem(transitionKey); } catch { /* optional enhancement */ }

  window.setTimeout(() => {
    clearNames([icon, preview]);
    document.documentElement.classList.remove('product-shared-transition');
  }, 1100);
}

function scheduleTargetInstall() {
  if (installFrame) return;
  installFrame = requestAnimationFrame(installProductTarget);
}

function handleClick(event) {
  const anchor = event.target.closest?.('a[href]');
  if (!anchor || anchor.target || !isProductUrl(anchor.href)) return;
  markProductSource(anchor);
}

document.addEventListener('click', handleClick, { capture: true });
const observer = new MutationObserver(scheduleTargetInstall);
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleTargetInstall, { once: true });
else scheduleTargetInstall();
window.addEventListener('pagereveal', scheduleTargetInstall);
window.addEventListener('pagehide', () => {
  observer.disconnect();
  document.removeEventListener('click', handleClick, { capture: true });
  cancelAnimationFrame(installFrame);
  clearTimeout(cleanupTimer);
}, { once: true });
