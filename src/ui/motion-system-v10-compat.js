function cancelLegacyMainAnimation() {
  requestAnimationFrame(() => {
    const main = document.querySelector('.app-shell main');
    main?.getAnimations().forEach((animation) => {
      const frames = animation.effect?.getKeyframes?.() || [];
      const isLegacyBack = frames.some((frame) => String(frame.translate || frame.transform || '').includes('-18px'));
      if (isLegacyBack) animation.cancel();
    });
  });
}

window.addEventListener('popstate', cancelLegacyMainAnimation);
window.addEventListener('pagehide', () => {
  window.removeEventListener('popstate', cancelLegacyMainAnimation);
}, { once: true });
