function addTestSupportReadinessVisual() {
  const page = document.querySelector('.app-shell[data-ux-page="test-support"] .test-support-page[data-deep-qa-v17="ready"]');
  const hero = page?.querySelector('.test-support-top-v17 > .page-hero');
  if (!hero || hero.querySelector('.test-readiness-v17')) return;

  const visual = document.createElement('div');
  visual.className = 'test-readiness-v17';
  visual.setAttribute('aria-label', 'Google Play release readiness areas');
  visual.innerHTML = `
    <div class="test-readiness-core-v17"><small>RELEASE CHECK</small><strong>Ready to submit</strong><span>Clear evidence, cleaner review.</span></div>
    <article class="readiness-a"><i>01</i><b>Test flow</b><span>Tester path and feedback</span></article>
    <article class="readiness-b"><i>02</i><b>Store assets</b><span>Listing and screenshots</span></article>
    <article class="readiness-c"><i>03</i><b>Policy pages</b><span>Privacy and support</span></article>
    <article class="readiness-d"><i>04</i><b>Launch proof</b><span>Evidence and release notes</span></article>
  `;
  hero.appendChild(visual);
}

function rebalanceMobileProductProof() {
  if (!window.matchMedia('(max-width: 760px)').matches) return;
  document.querySelectorAll('.app-shell.v7-product-detail-ready .detail-device-row').forEach((row) => {
    const devices = [...row.querySelectorAll('.device')];
    if (!devices.length) return;

    devices.forEach((device, index) => {
      const visible = index < 2;
      device.style.setProperty('display', visible ? 'block' : 'none', 'important');
      if (!visible) return;
      device.style.setProperty('position', 'absolute', 'important');
      device.style.setProperty('top', index === 0 ? '18px' : '34px', 'important');
      device.style.setProperty('bottom', index === 0 ? '18px' : '2px', 'important');
      device.style.setProperty('left', index === 0 ? '18px' : 'auto', 'important');
      device.style.setProperty('right', index === 1 ? '18px' : 'auto', 'important');
      device.style.setProperty('width', 'calc(50% - 24px)', 'important');
      device.style.setProperty('height', 'auto', 'important');
      device.style.setProperty('max-width', 'none', 'important');
      device.style.setProperty('margin', '0', 'important');
      device.style.setProperty('padding', '0', 'important');
      device.style.setProperty('border', '0', 'important');
      device.style.setProperty('border-radius', '16px', 'important');
      device.style.setProperty('background', 'transparent', 'important');
      device.style.setProperty('box-shadow', '0 18px 42px rgb(15 23 42 / .14)', 'important');
      device.style.setProperty('transform', index === 0 ? 'rotate(-2deg)' : 'rotate(2deg)', 'important');
      device.style.setProperty('translate', 'none', 'important');
      device.style.setProperty('opacity', '1', 'important');
      device.style.setProperty('visibility', 'visible', 'important');

      device.querySelector('.device-speaker')?.style.setProperty('display', 'none', 'important');
      device.querySelector('.ux-device-glass')?.style.setProperty('display', 'none', 'important');
      const image = device.querySelector('img');
      if (image) {
        image.style.setProperty('display', 'block', 'important');
        image.style.setProperty('width', '100%', 'important');
        image.style.setProperty('height', '100%', 'important');
        image.style.setProperty('object-fit', 'cover', 'important');
        image.style.setProperty('object-position', 'center', 'important');
        image.style.setProperty('border-radius', '14px', 'important');
      }
    });
  });
}

let frame = 0;
function install() {
  frame = 0;
  addTestSupportReadinessVisual();
  rebalanceMobileProductProof();
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(install);
}

new MutationObserver(schedule).observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
window.addEventListener('resize', schedule, { passive: true });
window.addEventListener('popstate', schedule);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
else schedule();
