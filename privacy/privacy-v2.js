const root = document.documentElement;
let pointerFrame = 0;
let pointerX = window.innerWidth * 0.78;
let pointerY = window.innerHeight * 0.08;

function updatePointer(event) {
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    pointerFrame = 0;
    root.style.setProperty('--privacy-x', `${(pointerX / Math.max(window.innerWidth, 1) * 100).toFixed(2)}%`);
    root.style.setProperty('--privacy-y', `${(pointerY / Math.max(window.innerHeight, 1) * 100).toFixed(2)}%`);
  });
}

function start() {
  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window && !CSS.supports('animation-timeline: view()')) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.add('privacy-motion-ready'));
  });

  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', updatePointer, { passive: true });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
window.addEventListener('pagehide', () => {
  cancelAnimationFrame(pointerFrame);
  window.removeEventListener('pointermove', updatePointer);
}, { once: true });
