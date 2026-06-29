const FORM_SELECTOR = 'form.support-form';
const ENHANCED_ATTRIBUTE = 'data-contextual-uploads';
const MAX_TOTAL_BYTES = 15 * 1024 * 1024;

const FILE_TYPES = {
  images: {
    accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
    extensions: ['jpg', 'jpeg', 'png', 'webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  documents: {
    accept: '.pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extensions: ['pdf', 'docx', 'pptx'],
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
  },
  reports: {
    accept: '.pdf,.docx,.xlsx,.csv,.txt,application/pdf,text/plain,text/csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: ['pdf', 'docx', 'xlsx', 'csv', 'txt'],
    mimeTypes: [
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  billing: {
    accept: '.jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf',
    extensions: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(fileName) {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function fileKey(file) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function createTextField({ label, name, type = 'text', placeholder, className = 'full', hint }) {
  const wrapper = element('label', className);
  wrapper.append(document.createTextNode(label));
  const input = document.createElement('input');
  input.name = name;
  input.type = type;
  input.placeholder = placeholder || '';
  wrapper.append(input);
  if (hint) wrapper.append(element('span', 'field-hint', hint));
  return wrapper;
}

function createSelectField({ label, name, options, className = '' }) {
  const wrapper = element('label', className);
  wrapper.append(document.createTextNode(label));
  const select = document.createElement('select');
  select.name = name;
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = 'Select an option';
  select.append(placeholder);
  options.forEach((optionText) => {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    select.append(option);
  });
  wrapper.append(select);
  return wrapper;
}

function createNotice(title, message, tone = 'info') {
  const notice = element('div', `attachment-notice ${tone}`);
  const copy = element('div');
  copy.append(element('strong', '', title), element('p', '', message));
  notice.append(element('span', 'attachment-notice-icon', tone === 'warning' ? '!' : 'i'), copy);
  return notice;
}

function createUploadField(form, config) {
  const type = FILE_TYPES[config.type];
  const wrapper = element('section', 'upload-field full');
  wrapper.dataset.uploadGroup = config.id;

  const heading = element('div', 'upload-field-heading');
  const headingCopy = element('div');
  headingCopy.append(element('h3', '', config.title), element('p', '', config.description));
  heading.append(headingCopy, element('span', 'upload-limit', `${config.maxFiles} files · ${config.maxSizeMb} MB each`));

  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'attachment';
  input.accept = type.accept;
  input.multiple = config.maxFiles > 1;
  input.className = 'upload-native-input';
  input.tabIndex = -1;
  input.setAttribute('aria-hidden', 'true');

  const dropZone = element('div', 'upload-drop-zone');
  dropZone.tabIndex = 0;
  dropZone.setAttribute('role', 'button');
  dropZone.setAttribute('aria-label', `${config.title}. Choose files or drag and drop.`);
  const action = element('div', 'upload-drop-action');
  action.append(element('span', 'upload-symbol', '+'), element('strong', '', 'Choose files'));
  dropZone.append(action, element('p', '', config.formats));

  const error = element('p', 'upload-error');
  error.setAttribute('role', 'alert');
  error.hidden = true;

  const list = element('div', 'upload-file-list');
  list.setAttribute('aria-live', 'polite');

  let files = [];
  let previewUrls = [];

  const showError = (message = '') => {
    error.textContent = message;
    error.hidden = !message;
    wrapper.classList.toggle('has-error', Boolean(message));
  };

  const syncInput = () => {
    try {
      const transfer = new DataTransfer();
      files.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
    } catch {
      // Modern browsers support DataTransfer construction. If an older browser
      // does not, the latest native selection remains available for submission.
    }
    input.dispatchEvent(new Event('contextual-files-changed', { bubbles: true }));
  };

  const clearPreviews = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    previewUrls = [];
  };

  const render = () => {
    clearPreviews();
    list.replaceChildren();
    files.forEach((file, index) => {
      const row = element('article', 'upload-file-row');
      let visual;
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        previewUrls.push(url);
        visual = document.createElement('img');
        visual.src = url;
        visual.alt = '';
      } else {
        visual = element('span', 'upload-file-extension', extensionOf(file.name).toUpperCase());
      }

      const copy = element('div', 'upload-file-copy');
      copy.append(element('strong', '', file.name), element('span', '', formatBytes(file.size)));

      const remove = element('button', 'upload-remove', 'Remove');
      remove.type = 'button';
      remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.addEventListener('click', () => {
        files.splice(index, 1);
        showError('');
        syncInput();
        render();
      });

      row.append(visual, copy, remove);
      list.append(row);
    });
    dropZone.classList.toggle('has-files', files.length > 0);
  };

  const validateFile = (file) => {
    if (!file || file.size === 0) return 'Empty files cannot be uploaded.';
    if (file.size > config.maxSizeMb * 1024 * 1024) {
      return `${file.name} is larger than ${config.maxSizeMb} MB.`;
    }
    const extension = extensionOf(file.name);
    const mimeAllowed = !file.type || type.mimeTypes.includes(file.type.toLowerCase());
    if (!type.extensions.includes(extension) || !mimeAllowed) {
      return `${file.name} is not an accepted file type.`;
    }
    return '';
  };

  const addFiles = (incoming) => {
    showError('');
    const next = [...files];
    const existing = new Set(next.map(fileKey));
    for (const file of Array.from(incoming || [])) {
      const validationMessage = validateFile(file);
      if (validationMessage) {
        showError(validationMessage);
        continue;
      }
      if (existing.has(fileKey(file))) continue;
      if (next.length >= config.maxFiles) {
        showError(`You can add up to ${config.maxFiles} files in this section.`);
        break;
      }
      next.push(file);
      existing.add(fileKey(file));
    }
    files = next;
    syncInput();
    render();
  };

  input.addEventListener('change', () => addFiles(input.files));
  dropZone.addEventListener('click', () => input.click());
  dropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      input.click();
    }
  });
  ['dragenter', 'dragover'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add('is-dragging');
    });
  });
  ['dragleave', 'drop'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove('is-dragging');
    });
  });
  dropZone.addEventListener('drop', (event) => addFiles(event.dataTransfer?.files));

  wrapper.append(heading, input, dropZone, error, list);
  wrapper.clearFiles = () => {
    files = [];
    showError('');
    syncInput();
    render();
  };
  wrapper.getFiles = () => [...files];
  wrapper.getLabel = () => config.title;
  return wrapper;
}

function createPanel(form, kind) {
  const panel = element('section', 'attachment-panel full');
  panel.dataset.attachmentPanel = kind;
  const title = element('div', 'attachment-panel-title');
  title.append(element('span', 'attachment-panel-kicker', kind === 'project' ? 'Project material' : 'Helpful evidence'));
  title.append(element('h2', '', kind === 'project' ? 'Show us what you have in mind' : 'Add files that explain the request'));
  title.append(element('p', '', kind === 'project'
    ? 'References and documents help us understand the scope before we reply.'
    : 'The available upload fields change according to the request type you select.'));
  panel.append(title);
  return panel;
}

function updateAttachmentSummary(form) {
  const groups = Array.from(form.querySelectorAll('[data-upload-group]'));
  const summary = groups
    .map((group) => {
      const names = group.getFiles?.().map((file) => file.name) || [];
      return names.length ? `${group.getLabel?.()}: ${names.join(', ')}` : '';
    })
    .filter(Boolean)
    .join(' | ');
  let input = form.querySelector('input[name="attachment_summary"]');
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'attachment_summary';
    form.append(input);
  }
  input.value = summary || 'No files attached';
}

function validateTotalSize(form) {
  const files = Array.from(form.querySelectorAll('input[type="file"][name="attachment"]'))
    .flatMap((input) => Array.from(input.files || []));
  const total = files.reduce((sum, file) => sum + file.size, 0);
  const existing = form.querySelector('.attachment-total-error');
  if (total <= MAX_TOTAL_BYTES) {
    existing?.remove();
    return true;
  }
  const message = existing || element('p', 'upload-error attachment-total-error');
  message.textContent = `All attachments together must be smaller than ${formatBytes(MAX_TOTAL_BYTES)}.`;
  message.setAttribute('role', 'alert');
  const panel = form.querySelector('[data-attachment-panel]');
  panel?.append(message);
  message.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return false;
}

function addProjectFields(form, panel) {
  const messageField = form.querySelector('textarea[name="message"]')?.closest('label');
  const stage = createSelectField({
    label: 'Project stage',
    name: 'project_stage',
    options: ['Idea only', 'Planning / specification', 'Design ready', 'Existing product', 'Needs redesign or repair'],
  });
  const projectType = form.querySelector('select[name="project_type"]');
  const timeline = form.querySelector('select[name="timeline"]');
  if (projectType) projectType.required = true;
  if (timeline) timeline.required = true;
  messageField?.before(stage);

  panel.append(
    createUploadField(form, {
      id: 'project-visuals',
      title: 'Visual references',
      description: 'Screenshots, sketches, wireframes, brand references or examples you like.',
      formats: 'JPG, PNG or WebP · Up to 5 files',
      type: 'images',
      maxFiles: 5,
      maxSizeMb: 5,
    }),
    createUploadField(form, {
      id: 'project-documents',
      title: 'Project document',
      description: 'Requirements, project brief, report, feature list or presentation.',
      formats: 'PDF, DOCX or PPTX · Up to 2 files',
      type: 'documents',
      maxFiles: 2,
      maxSizeMb: 5,
    }),
    createTextField({
      label: 'Prototype or sharing link (optional)',
      name: 'project_link',
      type: 'url',
      placeholder: 'https://figma.com, Google Drive, GitHub, Loom…',
      hint: 'Use a shareable link for videos, Figma files, source repositories or large materials.',
    }),
    createNotice('Do not upload secrets', 'Do not include passwords, API keys, signing files, identity documents or confidential account access details.', 'warning'),
  );
}

function addAppSupportFields(form, panel) {
  const context = element('div', 'attachment-context-grid full');
  context.append(
    createTextField({ label: 'Device model (optional)', name: 'device_model', placeholder: 'Example: Pixel 8 or iPhone 15', className: '' }),
    createTextField({ label: 'App / OS version (optional)', name: 'app_os_version', placeholder: 'Example: App 2.4.1 · Android 15', className: '' }),
  );
  panel.append(
    context,
    createUploadField(form, {
      id: 'support-screenshots',
      title: 'Screenshots of the problem',
      description: 'Add the error message and the screen where the issue happens.',
      formats: 'JPG, PNG or WebP · Up to 5 files',
      type: 'images',
      maxFiles: 5,
      maxSizeMb: 5,
    }),
    createUploadField(form, {
      id: 'support-report',
      title: 'Technical report',
      description: 'Optional PDF or text report containing additional non-sensitive details.',
      formats: 'PDF or TXT · Up to 2 files',
      type: 'reports',
      maxFiles: 2,
      maxSizeMb: 5,
    }),
    createTextField({
      label: 'Screen recording link (optional)',
      name: 'screen_recording_link',
      type: 'url',
      placeholder: 'Loom, Google Drive or YouTube link',
      hint: 'Use a private share link instead of uploading large video files.',
    }),
  );
}

function addGooglePlayFields(form, panel) {
  panel.append(
    createTextField({
      label: 'Google Play or Console reference link (optional)',
      name: 'google_play_reference',
      type: 'url',
      placeholder: 'https://play.google.com or a shareable reference link',
    }),
    createUploadField(form, {
      id: 'play-screenshots',
      title: 'Play Console screenshots',
      description: 'Policy notices, closed-testing status, review results or blocker screens.',
      formats: 'JPG, PNG or WebP · Up to 5 files',
      type: 'images',
      maxFiles: 5,
      maxSizeMb: 5,
    }),
    createUploadField(form, {
      id: 'play-reports',
      title: 'Reports and test files',
      description: 'Review reports, policy copy, test lists, store content or readiness documents.',
      formats: 'PDF, DOCX, XLSX, CSV or TXT · Up to 3 files',
      type: 'reports',
      maxFiles: 3,
      maxSizeMb: 5,
    }),
    createNotice('Never send account credentials', 'APK, AAB, IPA, ZIP, keystore, certificates, passwords and Google account access details are not accepted.', 'warning'),
  );
}

function addBillingFields(form, panel) {
  panel.append(
    createUploadField(form, {
      id: 'billing-evidence',
      title: 'Receipt or error evidence',
      description: 'Add a purchase receipt, subscription screen or payment error screenshot.',
      formats: 'JPG, PNG, WebP or PDF · Up to 2 files',
      type: 'billing',
      maxFiles: 2,
      maxSizeMb: 5,
    }),
    createNotice('Hide financial information', 'Cover card numbers, bank details, identity numbers and security codes before uploading.', 'warning'),
  );
}

function renderSupportPanel(form, panel, requestType) {
  panel.querySelectorAll('[data-upload-group]').forEach((group) => group.clearFiles?.());
  panel.querySelectorAll(':scope > :not(.attachment-panel-title)').forEach((node) => node.remove());
  form.querySelector('.attachment-total-error')?.remove();

  if (requestType === 'App support') {
    addAppSupportFields(form, panel);
  } else if (requestType === 'Google Play test support') {
    addGooglePlayFields(form, panel);
  } else if (requestType === 'Billing issue') {
    addBillingFields(form, panel);
  } else if (requestType === 'Privacy policy') {
    panel.append(createNotice(
      'No documents are needed here',
      'Describe the privacy request in the message field. Do not upload passports, identity documents or other sensitive personal records.',
      'warning',
    ));
  } else {
    panel.append(createNotice('Choose a request type', 'Relevant and safe attachment options will appear after you select the type of help you need.'));
  }
  updateAttachmentSummary(form);
}

function enhanceForm(form) {
  if (form.hasAttribute(ENHANCED_ATTRIBUTE)) return;
  form.setAttribute(ENHANCED_ATTRIBUTE, 'true');

  const project = Boolean(form.querySelector('select[name="project_type"]'));
  const requestType = form.querySelector('select[name="request_type"]');
  if (requestType) {
    requestType.required = true;
    if (form.closest('.test-support-page') && !requestType.value) {
      requestType.value = 'Google Play test support';
    }
  }

  const panel = createPanel(form, project ? 'project' : 'support');
  const formNote = form.querySelector('.form-note');
  if (formNote) formNote.before(panel);
  else form.append(panel);

  if (project) {
    addProjectFields(form, panel);
  } else if (requestType) {
    renderSupportPanel(form, panel, requestType.value);
    requestType.addEventListener('change', () => renderSupportPanel(form, panel, requestType.value));
  }

  panel.addEventListener('contextual-files-changed', () => updateAttachmentSummary(form));

  form.addEventListener('submit', (event) => {
    updateAttachmentSummary(form);
    if (!validateTotalSize(form)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      panel.querySelectorAll('[data-upload-group]').forEach((group) => group.clearFiles?.());
      updateAttachmentSummary(form);
      if (!project && requestType) renderSupportPanel(form, panel, requestType.value);
    }, 0);
  });

  updateAttachmentSummary(form);
}

function scan() {
  document.querySelectorAll(FORM_SELECTOR).forEach(enhanceForm);
}

const observer = new MutationObserver(scan);
observer.observe(document.documentElement, { childList: true, subtree: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scan, { once: true });
} else {
  scan();
}
