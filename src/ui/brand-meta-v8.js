function refreshBrandMetadata() {
  const isHome = (window.location.pathname.replace(/\/+$/, '') || '/') === '/';
  if (!isHome) return;
  const title = 'Devovia Studio — Digital Product Design & Engineering';
  const description = 'Devovia Studio designs and builds refined digital products with clear strategy, disciplined engineering and long-term product care.';
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
}

function scheduleBrandMetadata() {
  requestAnimationFrame(() => requestAnimationFrame(refreshBrandMetadata));
  window.setTimeout(refreshBrandMetadata, 120);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleBrandMetadata, { once: true });
else scheduleBrandMetadata();
window.addEventListener('popstate', scheduleBrandMetadata);
