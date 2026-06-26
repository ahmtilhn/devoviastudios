const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
const transitionStoreKey = 'devovia-route-transition';
const prefetched = new Set();
let lastPointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.35 };
let spaTransitionActive = false;

function normalizedPath(url = window.location.href) {
  const parsed = new URL(url, window.location.href);
  return parsed.pathname.replace(/\/+$/, '') || '/';
}

function routeDepth(path) {
  if (path === '/') return 0;
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'products' && parts.length > 1) return 3;
  if (parts[0] === 'blog' && parts.length > 1) return 3;
  if (parts[0] === 'services' && parts.length > 1) return 2;
  return Math.min(parts.length + 1, 2);
}

function routeDirection(fromPath, toPath) {
  const fromDepth = routeDepth(fromPath);
  const toDepth = routeDepth(toPath);
  if (toDepth > fromDepth) return 'forward';
  if (toDepth < fromDepth) return 'back';
  return toPath.localeCompare(fromPath) >= 0 ? 'forward' : 'back';
}

function applyTransitionContext(direction, x = lastPointer.x, y = lastPointer.y) {
  document.documentElement.dataset.routeDirection = direction;
  document.documentElement.style.setProperty('--route-x', `${x}px`);
  document.documentElement.style.setProperty('--route-y', `${y}px`);
}

function clearTransitionContext() {
  window.setTimeout(() => {
    delete document.documentElement.dataset.routeDirection;
  }, 760);
}

function storeTransitionContext(direction) {
  try {
    sessionStorage.setItem(transitionStoreKey, JSON.stringify({
      direction,
      x: lastPointer.x,
      y: lastPointer.y,
      at: Date.now(),
    }));
  } catch {
    // Storage can be unavailable in restrictive privacy modes.
  }
}

function readTransitionContext() {
  try {
    const value = JSON.parse(sessionStorage.getItem(transitionStoreKey) || 'null');
    sessionStorage.removeItem(transitionStoreKey);
    return value && Date.now() - value.at < 6000 ? value : null;
  } catch {
    return null;
  }
}

function eligibleAnchor(event) {
  if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = event.target.closest?.('a[href]');
  if (!anchor || anchor.target || anchor.hasAttribute('download')) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  return { anchor, url };
}

function animatePressedControl(target) {
  if (reducedMotion || !target?.animate) return;
  const control = target.closest?.('.button, .dv-button, .text-link, .dv-text-link, button');
  if (!control) return;
  control.animate(
    [
      { scale: '1' },
      { scale: '.985', offset: .45 },
      { scale: '1' },
    ],
    { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' },
  );
}

function navigateInternal(url) {
  const fromPath = normalizedPath();
  const toPath = normalizedPath(url.href);
  const direction = routeDirection(fromPath, toPath);
  applyTransitionContext(direction);
  storeTransitionContext(direction);

  const update = () => {
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  if (!reducedMotion && document.startViewTransition) {
    spaTransitionActive = true;
    const transition = document.startViewTransition(update);
    transition.finished.finally(() => {
      spaTransitionActive = false;
      clearTransitionContext();
    });
  } else {
    update();
    clearTransitionContext();
  }
}

function handleClick(event) {
  animatePressedControl(event.target);
  const match = eligibleAnchor(event);
  if (!match) return;

  const { url } = match;
  const currentPath = normalizedPath();
  const nextPath = normalizedPath(url.href);
  const sameDocumentHash = currentPath === nextPath && url.hash;
  if (sameDocumentHash) return;

  const appShell = document.querySelector('.app-shell');
  if (appShell && nextPath !== '/admin') {
    event.preventDefault();
    event.stopImmediatePropagation();
    navigateInternal(url);
    return;
  }

  storeTransitionContext(routeDirection(currentPath, nextPath));
}

function handlePopState() {
  if (spaTransitionActive || reducedMotion) return;
  applyTransitionContext('back');
  requestAnimationFrame(() => {
    const main = document.querySelector('.app-shell main');
    main?.animate(
      [
        { opacity: 0, translate: '-18px 0', filter: 'blur(6px)' },
        { opacity: 1, translate: '0 0', filter: 'blur(0)' },
      ],
      { duration: 460, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'both' },
    );
    clearTransitionContext();
  });
}

function schedulePrefetch(anchor) {
  if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || url.hash || prefetched.has(url.pathname)) return;
  prefetched.add(url.pathname);

  const run = () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `${url.pathname}${url.search}`;
    link.as = 'document';
    document.head.append(link);
  };

  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 1200 });
  else window.setTimeout(run, 120);
}

function handlePointerOver(event) {
  if (!finePointer) return;
  schedulePrefetch(event.target.closest?.('a[href]'));
}

function handlePointerMove(event) {
  lastPointer = { x: event.clientX, y: event.clientY };
}

function handlePageSwap(event) {
  const destination = event.activation?.entry?.url;
  if (!destination) return;
  const direction = routeDirection(normalizedPath(), normalizedPath(destination));
  storeTransitionContext(direction);
}

function handlePageReveal() {
  const context = readTransitionContext();
  if (!context) return;
  applyTransitionContext(context.direction, context.x, context.y);
  clearTransitionContext();
}

document.documentElement.classList.add('native-web-engine');
document.addEventListener('click', handleClick, { capture: true });
document.addEventListener('pointerover', handlePointerOver, { passive: true });
if (finePointer) window.addEventListener('pointermove', handlePointerMove, { passive: true });
window.addEventListener('popstate', handlePopState);
window.addEventListener('pageswap', handlePageSwap);
window.addEventListener('pagereveal', handlePageReveal);

window.addEventListener('pagehide', () => {
  document.removeEventListener('click', handleClick, { capture: true });
  document.removeEventListener('pointerover', handlePointerOver);
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('popstate', handlePopState);
  window.removeEventListener('pageswap', handlePageSwap);
  window.removeEventListener('pagereveal', handlePageReveal);
}, { once: true });
