const SUPPORT_EMAIL = 'info@devoviastudio.com';

function makeElement(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function setText(node, value) {
  if (node && node.textContent !== value) node.textContent = value;
}

function setFieldValue(field, value) {
  if (!field || !value) return;
  if (field.tagName === 'SELECT') {
    const option = Array.from(field.options).find((item) => item.value === value || item.textContent.trim() === value);
    if (option) field.value = option.value;
  } else {
    field.value = value;
  }
  field.dispatchEvent(new Event('change', { bubbles: true }));
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

function prefillRequest({ product = '', type = '' } = {}) {
  window.setTimeout(() => {
    const form = document.querySelector('.app-shell[data-ux-page="support"] form.support-form');
    if (!form) return;
    const productField = form.querySelector('select[name="product"], input[name="product"]');
    const typeField = form.querySelector('select[name="request_type"]');
    if (product) setFieldValue(productField, product);
    if (type) setFieldValue(typeField, type);
  }, 50);
}

function makeRequestLink(label, options = {}) {
  const link = makeElement('a', 'support-action-v19', label);
  link.href = '#support-request';
  link.addEventListener('click', () => prefillRequest(options));
  return link;
}

function simplifyProductCard(card) {
  if (card.dataset.supportProductV19 === 'ready') return;
  card.dataset.supportProductV19 = 'ready';

  const title = card.querySelector('h3')?.textContent?.trim() || 'Product';
  const category = card.querySelector('p')?.textContent?.trim() || '';
  const image = card.querySelector('img')?.cloneNode(true);
  const anchors = Array.from(card.querySelectorAll('a'));
  const privacy = anchors.find((link) => /privacy/i.test(link.textContent || ''));
  const productPage = anchors.find((link) => /product|preview/i.test(link.textContent || ''));

  const copy = makeElement('div', 'support-product-copy-v19');
  copy.append(makeElement('strong', '', title));
  if (category) copy.append(makeElement('span', '', category));

  const actions = makeElement('div', 'support-product-actions-v19');
  actions.append(makeRequestLink('Get help', { product: title, type: 'App support' }));
  if (privacy) {
    const privacyLink = makeElement('a', '', 'Privacy');
    privacyLink.href = privacy.href;
    if (privacy.target) privacyLink.target = privacy.target;
    if (privacy.rel) privacyLink.rel = privacy.rel;
    actions.append(privacyLink);
  }
  if (productPage) {
    const productLink = makeElement('a', '', 'Product');
    productLink.href = productPage.href;
    actions.append(productLink);
  }

  card.replaceChildren();
  if (image) card.append(image);
  card.append(copy, actions);
}

function buildHeroIntro(grid) {
  if (!grid || grid.previousElementSibling?.classList.contains('support-product-index-heading-v19')) return;
  const heading = makeElement('div', 'support-product-index-heading-v19');
  heading.append(
    makeElement('span', '', 'Product support'),
    makeElement('strong', '', 'Choose the product first.'),
    makeElement('p', '', 'Jump straight to help, privacy or the product page without hunting through separate menus.'),
  );
  grid.before(heading);
}

function buildHeroActions(copy) {
  if (!copy || copy.querySelector('.support-hero-actions-v19')) return;
  const actions = makeElement('div', 'support-hero-actions-v19');
  const request = makeRequestLink('Send a support request');
  request.classList.add('button', 'primary');
  const email = makeElement('a', 'button secondary', 'Email support');
  email.href = `mailto:${SUPPORT_EMAIL}`;
  actions.append(request, email);
  copy.append(actions);

  const signals = makeElement('div', 'support-hero-signals-v19');
  [
    ['1–2 business days', 'Typical support reply target'],
    ['One inbox', 'All website support routes together'],
    ['Files welcome', 'Screenshots and documents can be attached'],
  ].forEach(([title, text]) => {
    const item = makeElement('article');
    item.append(makeElement('strong', '', title), makeElement('span', '', text));
    signals.append(item);
  });
  copy.append(signals);
}

function rebuildPathways(sectionHeader, choiceGrid) {
  if (!choiceGrid || choiceGrid.dataset.supportPathwaysV19 === 'ready') return null;
  choiceGrid.dataset.supportPathwaysV19 = 'ready';
  choiceGrid.classList.add('support-path-grid-v19');

  const title = sectionHeader?.querySelector('h2');
  const eyebrow = sectionHeader?.querySelector('.eyebrow');
  setText(eyebrow, 'Choose the issue');
  setText(title, 'Start with the kind of help you need.');

  const mapping = {
    'App support': 'App support',
    'Privacy policy': 'Privacy policy',
    'Billing issue': 'Billing issue',
    'Google Play test support': 'Google Play test support',
  };

  Array.from(choiceGrid.children).forEach((card, index) => {
    card.classList.add('support-path-card-v19');
    const heading = card.querySelector('h3');
    const type = mapping[heading?.textContent?.trim()] || '';
    const button = makeRequestLink('Start this request', { type });
    button.classList.add('support-path-link-v19');
    card.append(button);
    card.style.setProperty('--support-index', String(index + 1).padStart(2, '0'));
  });

  const wrapper = makeElement('section', 'support-pathways-v19');
  if (sectionHeader) wrapper.append(sectionHeader);
  wrapper.append(choiceGrid);
  return wrapper;
}

function buildRequestContext() {
  const context = makeElement('div', 'support-request-context-v19');
  context.append(
    makeElement('p', 'eyebrow', 'Support request'),
    makeElement('h2', '', 'Give us the shortest path to the problem.'),
    makeElement('p', '', 'A useful support message explains what you expected, what happened instead and what you already tried. Screenshots or a short document are welcome when they make the issue easier to reproduce.'),
  );

  const checklist = makeElement('div', 'support-request-checklist-v19');
  [
    ['Product & device', 'Tell us which app and device you are using.'],
    ['What happened', 'Include the result, error or unexpected behaviour.'],
    ['How to reproduce it', 'List the smallest set of steps that causes the issue.'],
  ].forEach(([title, text], index) => {
    const item = makeElement('article');
    item.append(makeElement('span', '', String(index + 1).padStart(2, '0')), (() => {
      const copy = makeElement('div');
      copy.append(makeElement('strong', '', title), makeElement('p', '', text));
      return copy;
    })());
    checklist.append(item);
  });
  context.append(checklist);

  const inbox = makeElement('aside', 'support-inbox-v19');
  const inboxCopy = makeElement('div');
  inboxCopy.append(makeElement('strong', '', 'Prefer email?'), makeElement('span', '', 'Use the same Devovia support inbox.'));
  const email = makeElement('a', '', SUPPORT_EMAIL);
  email.href = `mailto:${SUPPORT_EMAIL}`;
  inbox.append(inboxCopy, email);
  context.append(inbox);
  return context;
}

function tuneSupportForm(panel) {
  if (!panel) return;
  panel.id = 'support-request';
  panel.classList.add('support-request-panel-v19');

  const oldEyebrow = panel.querySelector(':scope > .eyebrow');
  if (oldEyebrow) oldEyebrow.remove();

  const form = panel.querySelector('form.support-form');
  if (!form) return;
  form.classList.add('support-form-v19');

  if (!panel.querySelector('.support-form-heading-v19')) {
    const heading = makeElement('header', 'support-form-heading-v19');
    heading.append(
      makeElement('p', 'eyebrow', 'Send the details'),
      makeElement('h3', '', 'Support request'),
      makeElement('p', '', 'Choose the product and request type, then describe the issue in your own words.'),
    );
    panel.insertBefore(heading, form);
  }

  const labels = Array.from(form.querySelectorAll(':scope > label'));
  labels.forEach((label) => {
    const field = label.querySelector('input, select, textarea');
    if (!field) return;
    if (field.name === 'email' && label.firstChild) label.firstChild.textContent = 'Email';
    if (field.name === 'message') {
      if (label.firstChild) label.firstChild.textContent = 'What happened?';
      field.placeholder = 'What did you expect, what happened instead, and how can we reproduce it?';
      field.rows = 6;
    }
  });

  const secureNote = Array.from(form.querySelectorAll(':scope > .form-note'))
    .find((note) => !note.classList.contains('routing-destination-note') && !note.classList.contains('success') && !note.classList.contains('error'));
  if (secureNote) {
    const icon = secureNote.querySelector('.icon');
    setText(secureNote, 'Your details are used only to respond to this support request.');
    if (icon) secureNote.prepend(icon);
  }

  const routingNote = form.querySelector('.routing-destination-note');
  if (routingNote) setText(routingNote, `Delivered only to ${SUPPORT_EMAIL}, including attachments and contracts.`);

  const attachment = form.querySelector('[data-attachment-panel="files"]');
  if (attachment) {
    attachment.classList.add('support-attachment-v19');
    setText(attachment.querySelector('.attachment-panel-kicker'), 'Optional evidence');
    setText(attachment.querySelector('.attachment-panel-title h2'), 'Attach screenshots, reports or documents');
    setText(attachment.querySelector('.attachment-panel-title p'), 'Add only what helps us understand or reproduce the issue.');
    setText(attachment.querySelector('.upload-field-heading h3'), 'Files');
    setText(attachment.querySelector('.upload-field-heading p'), 'Images, PDF, Word, Excel, CSV, TXT or PowerPoint');
    setText(attachment.querySelector('.upload-limit'), 'Up to 5 files');
    setText(attachment.querySelector('.upload-drop-zone > p'), '5 MB each · 15 MB total');
    setText(attachment.querySelector('.attachment-notice strong'), 'Do not send passwords or access credentials');
    setText(attachment.querySelector('.attachment-notice p'), 'Keep API keys, signing files, bank details, app binaries, archives and executable files out of support messages.');
  }
}

function buildFaqSection(faqGrid) {
  if (!faqGrid || faqGrid.dataset.supportFaqV19 === 'ready') return null;
  faqGrid.dataset.supportFaqV19 = 'ready';
  const section = makeElement('section', 'support-faq-v19');
  const intro = makeElement('div', 'support-faq-intro-v19');
  intro.append(
    makeElement('p', 'eyebrow', 'Before you send'),
    makeElement('h2', '', 'Useful answers, without another wall of cards.'),
    makeElement('p', '', 'The essentials are kept short so the support form stays the main action on the page.'),
  );

  const list = makeElement('div', 'support-faq-list-v19');
  Array.from(faqGrid.children).forEach((card) => {
    const question = card.querySelector('h3')?.textContent?.trim();
    const answer = card.querySelector('p')?.textContent?.trim();
    if (!question || !answer) return;
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = question;
    details.append(summary, makeElement('p', '', answer));
    list.append(details);
  });
  section.append(intro, list);
  return section;
}

function enhanceSupportPage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/support') return;

  const shell = document.querySelector('.app-shell');
  const hero = shell?.querySelector('.page-hero:has(.support-app-grid)');
  const layout = shell?.querySelector('.support-layout');
  if (!shell || !hero || !layout) return;

  shell.classList.add('support-focus-page-v19');
  hero.classList.add('support-hero-v19');

  const heroCopy = hero.querySelector(':scope > div:first-child');
  if (heroCopy) {
    setText(heroCopy.querySelector('.eyebrow'), 'Support hub');
    setText(heroCopy.querySelector('h1'), 'Get to the right answer without the runaround.');
    const lead = Array.from(heroCopy.children).find((child) => child.tagName === 'P' && !child.classList.contains('eyebrow'));
    setText(lead, 'Choose the product, pick the kind of help you need and send enough context for us to act on it. Privacy links stay one click away.');
    buildHeroActions(heroCopy);
  }

  const productGrid = hero.querySelector('.support-app-grid');
  if (productGrid) {
    productGrid.classList.add('support-product-index-v19');
    buildHeroIntro(productGrid);
    Array.from(productGrid.children).forEach(simplifyProductCard);
  }

  tuneSupportForm(layout.querySelector('.request-panel'));

  if (layout.dataset.supportFocusV19 !== 'ready') {
    layout.dataset.supportFocusV19 = 'ready';
    const left = layout.querySelector(':scope > div');
    const requestPanel = layout.querySelector(':scope > .request-panel');
    if (!left || !requestPanel) return;

    const sectionHeader = left.querySelector(':scope > .section-header');
    const choiceGrid = left.querySelector(':scope > .support-choice-grid');
    const faqGrid = left.querySelector(':scope > .faq-grid');

    const pathways = rebuildPathways(sectionHeader, choiceGrid);
    const requestSection = makeElement('section', 'support-request-section-v19');
    requestSection.append(buildRequestContext(), requestPanel);
    const faq = buildFaqSection(faqGrid);

    layout.replaceChildren();
    if (pathways) layout.append(pathways);
    layout.append(requestSection);
    if (faq) layout.append(faq);
  }

  tuneSupportForm(layout.querySelector('.request-panel'));
}

let scheduled = false;
function scheduleSupportEnhancement() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    enhanceSupportPage();
  });
}

const observer = new MutationObserver(scheduleSupportEnhancement);
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('popstate', scheduleSupportEnhancement);
window.addEventListener('pageshow', scheduleSupportEnhancement);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleSupportEnhancement, { once: true });
} else {
  scheduleSupportEnhancement();
}
