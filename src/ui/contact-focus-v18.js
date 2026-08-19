const CONTACT_EMAIL = 'info@devoviastudio.com';

function makeElement(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function buildSignal(title, text) {
  const item = makeElement('article', 'contact-signal-v18');
  item.append(makeElement('strong', '', title), makeElement('span', '', text));
  return item;
}

function buildBriefCard() {
  const card = makeElement('section', 'contact-brief-card-v18');
  card.append(
    makeElement('p', 'contact-mini-label-v18', 'A useful first message'),
    makeElement('h2', '', 'A clear problem is enough to begin.'),
    makeElement('p', '', 'You do not need a finished specification. Three pieces of context usually make the first conversation useful.'),
  );

  const list = makeElement('ol', 'contact-brief-list-v18');
  [
    ['What is happening', 'What you are building, changing or trying to fix.'],
    ['Who it is for', 'The user, business or release situation behind the request.'],
    ['What you need', 'The outcome you want from Devovia and your preferred timing.'],
  ].forEach(([title, text], index) => {
    const item = makeElement('li');
    item.append(
      makeElement('span', 'contact-brief-number-v18', String(index + 1).padStart(2, '0')),
      (() => {
        const copy = makeElement('div');
        copy.append(makeElement('strong', '', title), makeElement('p', '', text));
        return copy;
      })(),
    );
    list.append(item);
  });
  card.append(list);
  return card;
}

function buildEmailCard() {
  const card = makeElement('aside', 'contact-email-card-v18');
  const copy = makeElement('div');
  copy.append(
    makeElement('p', 'contact-mini-label-v18', 'Prefer email?'),
    makeElement('p', '', 'Use the same direct Devovia inbox for project context, reports, attachments or contracts.'),
  );
  const link = makeElement('a', 'contact-email-link-v18', CONTACT_EMAIL);
  link.href = `mailto:${CONTACT_EMAIL}`;
  card.append(copy, link);
  return card;
}

function buildFormHeading() {
  const heading = makeElement('header', 'contact-form-heading-v18');
  heading.append(
    makeElement('p', 'eyebrow', 'Project brief'),
    makeElement('h2', '', 'Tell us enough to understand the job.'),
    makeElement('p', '', 'Short is fine. Add reference files only when they make the problem easier to see.'),
  );
  return heading;
}

function buildProcessSection() {
  const section = makeElement('section', 'contact-process-v18');
  section.dataset.contactProcessV18 = 'ready';

  const intro = makeElement('div', 'contact-process-intro-v18');
  intro.append(
    makeElement('p', 'eyebrow', 'After you send'),
    makeElement('h2', '', 'One message. A clear next step.'),
    makeElement('p', '', 'The goal of the first exchange is to remove ambiguity before anyone starts building.'),
  );

  const steps = makeElement('div', 'contact-process-steps-v18');
  [
    ['01', 'Review the context', 'We read the problem, product stage and any references you included.'],
    ['02', 'Clarify the scope', 'We identify the missing decisions, constraints and practical release needs.'],
    ['03', 'Choose the next step', 'You get a focused direction for a build, improvement or support path.'],
  ].forEach(([number, title, text]) => {
    const item = makeElement('article');
    item.append(
      makeElement('span', '', number),
      makeElement('h3', '', title),
      makeElement('p', '', text),
    );
    steps.append(item);
  });

  section.append(intro, steps);
  return section;
}

function setText(node, value) {
  if (node && node.textContent !== value) node.textContent = value;
}

function tuneForm(form) {
  if (!form) return;
  form.classList.add('project-form-v18');

  const emailInput = form.querySelector('input[name="email"]');
  if (emailInput) {
    emailInput.autocomplete = 'email';
    emailInput.inputMode = 'email';
  }

  const nameInput = form.querySelector('input[name="name"]');
  if (nameInput) nameInput.autocomplete = 'name';

  const textarea = form.querySelector('textarea[name="message"]');
  if (textarea) {
    textarea.placeholder = 'What are you building, who is it for, and what do you need help with?';
    textarea.rows = 5;
  }

  const secureNote = Array.from(form.querySelectorAll(':scope > .form-note'))
    .find((note) => !note.classList.contains('routing-destination-note') && !note.classList.contains('success') && !note.classList.contains('error'));
  if (secureNote) {
    const icon = secureNote.querySelector('.icon');
    setText(secureNote, 'Your details are used only to respond to this request.');
    if (icon) secureNote.prepend(icon);
  }

  const routingNote = form.querySelector('.routing-destination-note');
  if (routingNote) {
    setText(routingNote, `Delivered only to ${CONTACT_EMAIL}, including project files and contracts.`);
  }

  const panel = form.querySelector('[data-attachment-panel="files"]');
  if (panel) {
    panel.classList.add('contact-attachment-v18');
    setText(panel.querySelector('.attachment-panel-kicker'), 'Optional reference files');
    setText(panel.querySelector('.attachment-panel-title h2'), 'Attach screenshots, reports or briefs');
    setText(panel.querySelector('.attachment-panel-title p'), 'Files travel with the same project message — no external upload link is needed.');
    setText(panel.querySelector('.upload-field-heading h3'), 'Files');
    setText(panel.querySelector('.upload-field-heading p'), 'Images, PDF, Word, Excel, CSV, TXT or PowerPoint');
    setText(panel.querySelector('.upload-limit'), 'Up to 5 files');
    setText(panel.querySelector('.upload-drop-zone > p'), '5 MB each · 15 MB total');
    setText(panel.querySelector('.attachment-notice strong'), 'Keep credentials and sensitive access data out');
    setText(panel.querySelector('.attachment-notice p'), 'Do not attach passwords, API keys, signing files, bank details, app binaries, archives or executable files.');
  }
}

function enhanceContactPage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/contact') return;

  const shell = document.querySelector('.app-shell');
  const page = shell?.querySelector('.contact-page');
  if (!shell || !page) return;

  shell.classList.add('contact-focus-page-v18');

  const intro = page.querySelector(':scope > div:first-child');
  const form = page.querySelector(':scope > form.support-form');
  if (!intro || !form) return;

  if (page.dataset.contactFocusV18 !== 'ready') {
    page.dataset.contactFocusV18 = 'ready';
    intro.classList.add('contact-intro-v18');

    const headline = intro.querySelector('h1');
    const lead = Array.from(intro.children).find((child) => child.tagName === 'P' && !child.classList.contains('eyebrow'));
    setText(headline, 'Bring the problem. We’ll shape the product.');
    setText(lead, 'Share the context, the user need and where the product stands today. We’ll turn it into a focused next step — whether you need a build, a fix or release support.');

    const signals = makeElement('div', 'contact-signal-grid-v18');
    signals.append(
      buildSignal('Direct inbox', 'One route for every project request.'),
      buildSignal('Files welcome', 'Screenshots, reports and briefs can travel with the message.'),
      buildSignal('No perfect spec', 'A clear problem is enough to start.'),
    );
    intro.append(signals, buildBriefCard(), buildEmailCard());

    const formHeading = buildFormHeading();
    formHeading.dataset.contactFormHeadingV18 = 'ready';
    page.insertBefore(formHeading, form);

    if (!page.nextElementSibling?.matches?.('[data-contact-process-v18="ready"]')) {
      page.after(buildProcessSection());
    }
  }

  tuneForm(form);
}

let scheduled = false;
function scheduleEnhancement() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    enhanceContactPage();
  });
}

const observer = new MutationObserver(scheduleEnhancement);
observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
window.addEventListener('popstate', scheduleEnhancement);
window.addEventListener('pageshow', scheduleEnhancement);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleEnhancement, { once: true });
} else {
  scheduleEnhancement();
}
