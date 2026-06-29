const PRODUCT_OPTIONS = [
  'Stock Manager',
  'Arrow Escape',
  'Daily Hadith',
  'TinySteps',
  'Another app / not listed',
];

const PRODUCT_INPUT_SELECTOR = 'form.support-form input[name="product"]';
const ENHANCED_ATTRIBUTE = 'data-product-select-ready';

function createProductSelect(input) {
  const currentValue = input.value.trim();
  const select = document.createElement('select');

  select.name = input.name;
  select.required = true;
  select.className = input.className;
  select.id = input.id;
  select.setAttribute(ENHANCED_ATTRIBUTE, 'true');
  select.setAttribute('aria-label', input.getAttribute('aria-label') || 'Product');

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a product';
  placeholder.disabled = true;
  select.append(placeholder);

  PRODUCT_OPTIONS.forEach((productName) => {
    const option = document.createElement('option');
    option.value = productName;
    option.textContent = productName;
    select.append(option);
  });

  if (currentValue && !PRODUCT_OPTIONS.includes(currentValue)) {
    const option = document.createElement('option');
    option.value = currentValue;
    option.textContent = currentValue;
    select.insertBefore(option, select.children[1] || null);
  }

  select.value = currentValue || '';
  input.replaceWith(select);
}

function enhanceProductSelectors(root = document) {
  if (root.matches?.(PRODUCT_INPUT_SELECTOR) && !root.hasAttribute(ENHANCED_ATTRIBUTE)) {
    createProductSelect(root);
  }

  root.querySelectorAll?.(PRODUCT_INPUT_SELECTOR).forEach((input) => {
    if (!input.hasAttribute(ENHANCED_ATTRIBUTE)) createProductSelect(input);
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) enhanceProductSelectors(node);
    });
  });
});

observer.observe(document.getElementById('root') || document.body, {
  childList: true,
  subtree: true,
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => enhanceProductSelectors(), { once: true });
} else {
  enhanceProductSelectors();
}

window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
