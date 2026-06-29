const FORM_SELECTOR = 'form.support-form';
const ENHANCED_ATTRIBUTE = 'data-file-uploads-ready';
const PANEL_SELECTOR = '[data-attachment-panel="files"]';
const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 15 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'webp',
  'pdf', 'doc', 'docx',
  'xls', 'xlsx', 'csv',
  'txt', 'ppt', 'pptx',
]);

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/csv',
  'text/plain',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

const ACCEPTED_FILES = [
  '.jpg', '.jpeg', '.png', '.webp',
  '.pdf', '.doc', '.docx',
  '.xls', '.xlsx', '.csv',
  '.txt', '.ppt', '.pptx',
].join(',');

const formStates = new WeakMap();

function element(tag, className = '', text = '') {
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
  const parts = String(fileName || '').toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function fileKey(file) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function validateFile(file) {
  if (!file || file.size === 0) return 'Empty files cannot be attached.';
  if (file.size > MAX_FILE_BYTES) {
    return `${file.name} is larger than 5 MB.`;
  }

  const extension = extensionOf(file.name);
  const mimeType = String(file.type || '').toLowerCase();
  const mimeAllowed = !mimeType || mimeType === 'application/octet-stream' || ALLOWED_MIME_TYPES.has(mimeType);

  if (!ALLOWED_EXTENSIONS.has(extension) || !mimeAllowed) {
    return `${file.name} is not an accepted file type.`;
  }
  return '';
}

function syncNativeInput(input, files) {
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
  input.dispatchEvent(new Event('file-attachments-changed', { bubbles: true }));
}

function updateAttachmentSummary(form, files) {
  let summary = form.querySelector('input[name="attachment_summary"]');
  if (!summary) {
    summary = document.createElement('input');
    summary.type = 'hidden';
    summary.name = 'attachment_summary';
    form.append(summary);
  }
  summary.value = files.length ? files.map((file) => file.name).join(', ') : 'No files attached';
}

function createPanel(form, state) {
  const panel = element('section', 'attachment-panel full');
  panel.dataset.attachmentPanel = 'files';

  const title = element('div', 'attachment-panel-title');
  title.append(
    element('span', 'attachment-panel-kicker', 'File attachment'),
    element('h2', '', 'Add files to your message'),
    element('p', '', 'Optional: attach images or documents directly to the email. No external upload link is required.'),
  );

  const upload = element('section', 'upload-field full');
  upload.dataset.uploadGroup = 'files';

  const heading = element('div', 'upload-field-heading');
  const headingCopy = element('div');
  headingCopy.append(
    element('h3', '', 'Images and documents'),
    element('p', '', 'JPG, PNG, WebP, PDF, Word, Excel, CSV, TXT or PowerPoint'),
  );
  heading.append(headingCopy, element('span', 'upload-limit', `${MAX_FILES} files · 5 MB each`));

  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'attachment';
  input.accept = ACCEPTED_FILES;
  input.multiple = true;
  input.className = 'upload-native-input';
  input.tabIndex = -1;
  input.setAttribute('aria-hidden', 'true');

  const dropZone = element('div', 'upload-drop-zone');
  dropZone.tabIndex = 0;
  dropZone.setAttribute('role', 'button');
  dropZone.setAttribute('aria-label', 'Choose files or drag and drop files');
  const action = element('div', 'upload-drop-action');
  action.append(element('span', 'upload-symbol', '+'), element('strong', '', 'Choose files'));
  dropZone.append(action, element('p', '', 'You can select up to 5 files. Total size must not exceed 15 MB.'));

  const error = element('p', 'upload-error');
  error.hidden = true;
  error.setAttribute('role', 'alert');

  const list = element('div', 'upload-file-list');
  list.setAttribute('aria-live', 'polite');

  function showError(message = '') {
    error.textContent = message;
    error.hidden = !message;
    upload.classList.toggle('has-error', Boolean(message));
  }

  function render() {
    list.replaceChildren();
    state.files.forEach((file, index) => {
      const row = element('article', 'upload-file-row');
      const extension = extensionOf(file.name).toUpperCase() || 'FILE';
      const visual = element('span', 'upload-file-extension', extension);
      const copy = element('div', 'upload-file-copy');
      copy.append(element('strong', '', file.name), element('span', '', formatBytes(file.size)));

      const remove = element('button', 'upload-remove', 'Remove');
      remove.type = 'button';
      remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.addEventListener('click', () => {
        state.files.splice(index, 1);
        showError('');
        syncNativeInput(input, state.files);
        updateAttachmentSummary(form, state.files);
        render();
      });

      row.append(visual, copy, remove);
      list.append(row);
    });
    dropZone.classList.toggle('has-files', state.files.length > 0);
  }

  function addFiles(incoming) {
    showError('');
    const existing = new Set(state.files.map(fileKey));
    const errors = [];

    for (const file of Array.from(incoming || [])) {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
        continue;
      }
      if (existing.has(fileKey(file))) continue;
      if (state.files.length >= MAX_FILES) {
        errors.push(`You can attach up to ${MAX_FILES} files.`);
        break;
      }

      const nextTotal = state.files.reduce((sum, item) => sum + item.size, 0) + file.size;
      if (nextTotal > MAX_TOTAL_BYTES) {
        errors.push('All attachments together must be 15 MB or smaller.');
        continue;
      }

      state.files.push(file);
      existing.add(fileKey(file));
    }

    syncNativeInput(input, state.files);
    updateAttachmentSummary(form, state.files);
    render();
    if (errors.length) showError(errors[0]);
  }

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

  const notice = element('div', 'attachment-notice warning');
  const noticeCopy = element('div');
  noticeCopy.append(
    element('strong', '', 'Do not attach confidential access data'),
    element('p', '', 'Do not send passwords, API keys, signing files, identity documents, bank details, APK/AAB/IPA files, archives or executable files.'),
  );
  notice.append(element('span', 'attachment-notice-icon', '!'), noticeCopy);

  upload.append(heading, input, dropZone, error, list);
  panel.append(title, upload, notice);

  if (state.files.length) {
    syncNativeInput(input, state.files);
    render();
  }

  panel.clearFiles = () => {
    state.files = [];
    showError('');
    syncNativeInput(input, state.files);
    updateAttachmentSummary(form, state.files);
    render();
  };

  return panel;
}

function enhanceForm(form) {
  if (form.querySelector(PANEL_SELECTOR)) return;

  let state = formStates.get(form);
  if (!state) {
    state = { files: [] };
    formStates.set(form, state);
  }

  form.setAttribute(ENHANCED_ATTRIBUTE, 'true');
  form.enctype = 'multipart/form-data';

  form.querySelectorAll('select[name="project_type"], select[name="timeline"], select[name="request_type"]')
    .forEach((select) => { select.required = true; });

  const panel = createPanel(form, state);
  const firstNote = form.querySelector('.form-note');
  if (firstNote) firstNote.before(panel);
  else form.append(panel);

  updateAttachmentSummary(form, state.files);

  if (!form.dataset.fileUploadListeners) {
    form.dataset.fileUploadListeners = 'true';

    form.addEventListener('submit', (event) => {
      const total = state.files.reduce((sum, file) => sum + file.size, 0);
      if (state.files.length > MAX_FILES || total > MAX_TOTAL_BYTES) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      updateAttachmentSummary(form, state.files);
    }, true);

    form.addEventListener('reset', () => {
      window.setTimeout(() => {
        state.files = [];
        const currentPanel = form.querySelector(PANEL_SELECTOR);
        currentPanel?.clearFiles?.();
        updateAttachmentSummary(form, state.files);
      }, 0);
    });
  }
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
