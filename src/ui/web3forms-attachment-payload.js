const SUPPORT_FORM_SELECTOR = 'form.support-form';
const SOURCE_INPUT_SELECTOR = 'input.upload-native-input:not(.web3forms-attachment-payload)';
const PAYLOAD_CLASS = 'web3forms-attachment-payload';

function safeFieldName(value) {
  return String(value || 'file').replace(/[^a-z0-9_]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function clearPayloadInputs(form) {
  form.querySelectorAll(`.${PAYLOAD_CLASS}`).forEach((input) => input.remove());
  form.querySelectorAll(SOURCE_INPUT_SELECTOR).forEach((input) => {
    input.disabled = false;
  });
}

function createSingleFileInput(file, name) {
  const payload = document.createElement('input');
  payload.type = 'file';
  payload.name = name;
  payload.className = `upload-native-input ${PAYLOAD_CLASS}`;
  payload.tabIndex = -1;
  payload.setAttribute('aria-hidden', 'true');

  const transfer = new DataTransfer();
  transfer.items.add(file);
  payload.files = transfer.files;
  return payload;
}

function preparePayload(form) {
  clearPayloadInputs(form);
  form.enctype = 'multipart/form-data';

  const sourceInputs = Array.from(form.querySelectorAll(SOURCE_INPUT_SELECTOR));
  let payloadCount = 0;

  try {
    sourceInputs.forEach((sourceInput) => {
      const group = safeFieldName(sourceInput.closest('[data-upload-group]')?.dataset.uploadGroup);
      Array.from(sourceInput.files || []).forEach((file, index) => {
        const fieldName = `attachment_${group}_${index + 1}`;
        form.append(createSingleFileInput(file, fieldName));
        payloadCount += 1;
      });
    });
  } catch {
    clearPayloadInputs(form);
    return;
  }

  if (payloadCount > 0) {
    sourceInputs.forEach((input) => {
      input.disabled = true;
    });
    window.setTimeout(() => {
      sourceInputs.forEach((input) => {
        input.disabled = false;
      });
    }, 0);
  }
}

document.addEventListener('submit', (event) => {
  const form = event.target?.closest?.(SUPPORT_FORM_SELECTOR);
  if (form) preparePayload(form);
}, true);

document.addEventListener('reset', (event) => {
  const form = event.target?.closest?.(SUPPORT_FORM_SELECTOR);
  if (form) window.setTimeout(() => clearPayloadInputs(form), 0);
}, true);
