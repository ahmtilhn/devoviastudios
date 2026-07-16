const FORM_SELECTOR = 'form.support-form';
const DESTINATION_EMAIL = 'info@devoviastudio.com';
const ROUTING_NOTE_CLASS = 'routing-destination-note';
const CONTRACT_OPTION = 'Contract / agreement';

function upsertHiddenField(form, name, value) {
  let input = form.querySelector(`input[type="hidden"][name="${name}"]`);
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    form.append(input);
  }
  input.value = value;
}

function ensureOption(select, label) {
  if (!select) return;
  const exists = Array.from(select.options).some((option) => option.value === label || option.textContent === label);
  if (exists) return;

  const option = document.createElement('option');
  option.value = label;
  option.textContent = label;
  select.append(option);
}

function ensureRoutingNotice(form) {
  if (form.querySelector(`.${ROUTING_NOTE_CLASS}`)) return;

  const note = document.createElement('p');
  note.className = `form-note ${ROUTING_NOTE_CLASS}`;
  note.textContent = `All website submissions, including project requests, reports, attachments and contracts, are delivered only to ${DESTINATION_EMAIL}.`;

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.before(note);
  else form.append(note);
}

function lockFormRecipient(form) {
  form.dataset.destinationEmail = DESTINATION_EMAIL;
  upsertHiddenField(form, 'destination_email', DESTINATION_EMAIL);
  upsertHiddenField(form, 'submission_source', 'Devovia Studio website');

  ensureOption(form.querySelector('select[name="request_type"]'), CONTRACT_OPTION);
  ensureOption(form.querySelector('select[name="project_type"]'), CONTRACT_OPTION);
  ensureRoutingNotice(form);
}

function normalizeMailLinks(root = document) {
  root.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const queryIndex = href.indexOf('?');
    const query = queryIndex >= 0 ? href.slice(queryIndex) : '';
    link.setAttribute('href', `mailto:${DESTINATION_EMAIL}${query}`);
  });
}

function scan() {
  document.querySelectorAll(FORM_SELECTOR).forEach(lockFormRecipient);
  normalizeMailLinks();
}

document.addEventListener('submit', (event) => {
  const form = event.target?.closest?.(FORM_SELECTOR);
  if (form) lockFormRecipient(form);
}, true);

const observer = new MutationObserver(scan);
observer.observe(document.documentElement, { childList: true, subtree: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scan, { once: true });
} else {
  scan();
}
