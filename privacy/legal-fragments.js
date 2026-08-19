const fragmentTargets = [...document.querySelectorAll('[data-legal-fragment]')];

await Promise.all(fragmentTargets.map(async (target) => {
  const source = target.dataset.legalFragment;
  try {
    const response = await fetch(source, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Unable to load ${source}`);
    target.innerHTML = await response.text();
    target.removeAttribute('aria-busy');
  } catch (error) {
    target.innerHTML = '<article class="privacy-card"><h3>Document unavailable</h3><p>Please refresh the page or contact support.</p></article>';
    target.removeAttribute('aria-busy');
    console.error(error);
  }
}));
