const root = document.documentElement;
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const lowCapability = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
  || (navigator.deviceMemory && navigator.deviceMemory <= 4)
  || connection?.saveData;

if (lowCapability) root.classList.add('ux-lite-motion');

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
  document.removeEventListener('visibilitychange', updateVisibility);
}, { once: true });
