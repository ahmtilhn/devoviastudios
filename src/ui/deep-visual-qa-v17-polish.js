function refineMobileProductProof() {
  if (!window.matchMedia('(max-width: 760px)').matches) return;

  document.querySelectorAll('.app-shell.v7-product-detail-ready .detail-device-row').forEach((row) => {
    const devices = [...row.querySelectorAll('.device')];
    if (!devices.length) return;

    devices.forEach((device, index) => {
      const visible = index === 0;
      device.style.setProperty('display', visible ? 'block' : 'none', 'important');
      if (!visible) return;

      device.style.setProperty('position', 'absolute', 'important');
      device.style.setProperty('inset', '16px', 'important');
      device.style.setProperty('width', 'calc(100% - 32px)', 'important');
      device.style.setProperty('height', 'calc(100% - 32px)', 'important');
      device.style.setProperty('max-width', 'none', 'important');
      device.style.setProperty('margin', '0', 'important');
      device.style.setProperty('padding', '0', 'important');
      device.style.setProperty('overflow', 'hidden', 'important');
      device.style.setProperty('border', '0', 'important');
      device.style.setProperty('border-radius', '18px', 'important');
      device.style.setProperty('background', 'transparent', 'important');
      device.style.setProperty('box-shadow', 'none', 'important');
      device.style.setProperty('transform', 'none', 'important');
      device.style.setProperty('translate', 'none', 'important');
      device.style.setProperty('opacity', '1', 'important');
      device.style.setProperty('visibility', 'visible', 'important');

      device.querySelector('.device-speaker')?.style.setProperty('display', 'none', 'important');
      device.querySelector('.ux-device-glass')?.style.setProperty('display', 'none', 'important');

      const image = device.querySelector('img');
      if (!image) return;
      image.style.setProperty('display', 'block', 'important');
      image.style.setProperty('width', '100%', 'important');
      image.style.setProperty('height', '100%', 'important');
      image.style.setProperty('border-radius', '16px', 'important');
      image.style.setProperty('object-fit', 'cover', 'important');
      image.style.setProperty('object-position', 'center 38%', 'important');
      image.style.setProperty('transform', 'translateX(-16%) scale(1.38)', 'important');
      image.style.setProperty('transform-origin', '72% 46%', 'important');
    });
  });
}

let frame = 0;
function install() {
  frame = 0;
  refineMobileProductProof();
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(install);
}

new MutationObserver(schedule).observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
window.addEventListener('resize', schedule, { passive: true });
window.addEventListener('popstate', schedule);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
else schedule();
