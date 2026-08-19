function retitleLabel(form, fieldName, labelText) {
  const field = form?.querySelector(`[name="${fieldName}"]`);
  const label = field?.closest('label');
  if (!label) return;
  const textNode = Array.from(label.childNodes)
    .find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (textNode && textNode.textContent.trim() !== labelText) {
    textNode.textContent = labelText;
  }
}

function refineContactFormCopy() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/contact') return;
  const form = document.querySelector('.contact-page form.support-form');
  if (!form) return;

  retitleLabel(form, 'email', 'Email');
  retitleLabel(form, 'timeline', 'Timing');
  retitleLabel(form, 'message', 'Project context');

  const email = form.querySelector('input[name="email"]');
  if (email) email.placeholder = 'you@company.com';
}

let contactCopyFrame = 0;
function scheduleContactCopyRefine() {
  if (contactCopyFrame) return;
  contactCopyFrame = requestAnimationFrame(() => {
    contactCopyFrame = 0;
    refineContactFormCopy();
  });
}

new MutationObserver(scheduleContactCopyRefine)
  .observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('popstate', scheduleContactCopyRefine);
window.addEventListener('pageshow', scheduleContactCopyRefine);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleContactCopyRefine, { once: true });
} else {
  scheduleContactCopyRefine();
}
