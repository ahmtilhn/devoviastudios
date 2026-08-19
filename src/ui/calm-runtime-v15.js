const root = document.documentElement;

root.classList.add('dv-editorial-mode');
window.__DEVOVIA_CALM_MODE__ = true;

/*
 * Devovia now defaults to the calm motion profile. The older motion layers
 * still exist for backwards compatibility and route contracts, but they see
 * reduced-motion=true and therefore skip pointer tracking, parallax and the
 * expensive reveal choreography. Layout, hover affordances and navigation
 * continue to work normally.
 */
const nativeMatchMedia = window.matchMedia?.bind(window);

if (nativeMatchMedia && !window.__DEVOVIA_MATCH_MEDIA_PATCHED__) {
  window.__DEVOVIA_MATCH_MEDIA_PATCHED__ = true;
  window.matchMedia = (query) => {
    const result = nativeMatchMedia(query);
    if (String(query).trim() !== '(prefers-reduced-motion: reduce)') return result;

    return {
      matches: true,
      media: result.media,
      onchange: result.onchange,
      addEventListener: result.addEventListener?.bind(result),
      removeEventListener: result.removeEventListener?.bind(result),
      addListener: result.addListener?.bind(result),
      removeListener: result.removeListener?.bind(result),
      dispatchEvent: result.dispatchEvent?.bind(result),
    };
  };
}
