const root = document.documentElement;
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const compactQuery = window.matchMedia?.('(max-width: 820px)');
const coarsePointerQuery = window.matchMedia?.('(pointer: coarse)');
const lowCapability = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
  || (navigator.deviceMemory && navigator.deviceMemory <= 4)
  || connection?.saveData;

function shouldUseLiteMotion() {
  return Boolean(lowCapability || compactQuery?.matches || coarsePointerQuery?.matches);
}

function updateMotionCapability() {
  const liteMotion = shouldUseLiteMotion();
  root.classList.toggle('ux-lite-motion', liteMotion);
  root.classList.toggle('ux-mobile-motion-guard', Boolean(compactQuery?.matches || coarsePointerQuery?.matches));
}

updateMotionCapability();
compactQuery?.addEventListener?.('change', updateMotionCapability);
coarsePointerQuery?.addEventListener?.('change', updateMotionCapability);

function markFirstPaint() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.add('ux-first-paint');
      const activate = () => root.classList.add('ux-motion-ready');
      if ('requestIdleCallback' in window) requestIdleCallback(activate, { timeout: 520 });
      else window.setTimeout(activate, 180);
    });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', markFirstPaint, { once: true });
else markFirstPaint();

let longTaskTotal = 0;
let longTaskObserver = null;
if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
  longTaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) longTaskTotal += entry.duration;
    if (longTaskTotal > 260) root.classList.add('ux-lite-motion');
  });
  longTaskObserver.observe({ type: 'longtask', buffered: true });
  window.setTimeout(() => longTaskObserver?.disconnect(), 4200);
}

function updateVisibility() {
  root.classList.toggle('ux-page-hidden', document.hidden);
}
document.addEventListener('visibilitychange', updateVisibility, { passive: true });
window.addEventListener('pagehide', () => {
  longTaskObserver?.disconnect();
  compactQuery?.removeEventListener?.('change', updateMotionCapability);
  coarsePointerQuery?.removeEventListener?.('change', updateMotionCapability);
  document.removeEventListener('visibilitychange', updateVisibility);
}, { once: true });
