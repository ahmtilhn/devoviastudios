const SUPPORT_FORM_SELECTOR = 'form.support-form';
const SOURCE_INPUT_SELECTOR = 'input.upload-native-input:not(.web3forms-attachment-payload)';
const PAYLOAD_CLASS = 'web3forms-attachment-payload';

function clearPayloadInputs(form) {
  form.querySelectorAll(`.${PAYLOAD_CLASS}`).forEach((input) => input.remove());
  form.querySelectorAll(SOURCE_INPUT_SELECTOR).forEach((input) => {
    input.disabled = false;
  });
}

function createSingleFileInput(file, index) {
  const payload = document.createElement('input');
  payload.type = 'file';
  payload.name = `attachment_${index}`;
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
  const files = sourceInputs.flatMap((input) => Array.from(input.files || []));
  if (!files.length) return;

  try {
    files.forEach((file, index) => {
      form.append(createSingleFileInput(file, index + 1));
    });
  } catch {
    clearPayloadInputs(form);
    return;
  }

  sourceInputs.forEach((input) => {
    input.disabled = true;
  });

  window.setTimeout(() => {
    sourceInputs.forEach((input) => {
      input.disabled = false;
    });
  }, 0);
}

document.addEventListener('submit', (event) => {
  const form = event.target?.closest?.(SUPPORT_FORM_SELECTOR);
  if (form) preparePayload(form);
}, true);

document.addEventListener('reset', (event) => {
  const form = event.target?.closest?.(SUPPORT_FORM_SELECTOR);
  if (form) window.setTimeout(() => clearPayloadInputs(form), 0);
}, true);
