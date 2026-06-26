const refinements = new Map([
  ['Cross-platform apps built with clean architecture, polished UI and launch-ready foundations.', 'Cross-platform applications shaped around clear user journeys, maintainable architecture, reliable performance and confident release foundations.'],
  ['Engaging indie games with memorable mechanics, strong progression and store-ready presentation.', 'Independent games developed around distinctive mechanics, readable progression, responsive feedback and a coherent player experience.'],
  ['Fast, premium websites that explain products clearly and convert visitors into action.', 'Product websites that establish value quickly, communicate capability with precision and guide visitors toward the right next action.'],
  ['Closed-testing guidance, store-readiness, policy pages and release support for teams blocked in Google Play.', 'A structured Google Play release review covering testing, store quality, policy surfaces, support routes and avoidable submission risk.'],
  ['Product-first UX', 'Outcome-led experience design'],
  ['Support infrastructure', 'Product continuity'],
  ['Release-ready systems', 'Operational release readiness'],
  ['Built for clarity, speed and real-world use. Every screen solves a problem with minimal friction and maximum focus.', 'Each flow is shaped around a specific user decision, with unnecessary steps removed and essential context kept visible.'],
  ['From documentation to release support, our systems are designed to help you launch and scale with confidence.', 'Documentation, support routes, privacy surfaces and release communication are treated as part of the product rather than afterthoughts.'],
  ['We build with store-readiness in mind - policies, privacy, test flows and assets, so you can ship without roadblocks.', 'Store assets, policy requirements, testing flows and release communication are aligned before they become launch blockers.'],
  ['Have a product idea?', 'A promising idea deserves a considered product system.'],
  ['Let us build it right. Clean code, strong UX and launch-ready infrastructure from day one.', 'Bring the concept, context and ambition. We will shape the strategy, experience, engineering and launch foundation as one coherent product.'],
  ['Ship with more confidence.', 'Submit with stronger evidence and fewer avoidable risks.'],
  ['Resolve blockers, polish your store and launch with confidence.', 'Resolve the real blocker, align every public surface and approach review with a more credible release package.'],
]);

function applyCopy(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement?.closest('script,style,svg,textarea,input,select,option')
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
  });
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue.trim();
    const replacement = refinements.get(text);
    if (replacement) node.nodeValue = node.nodeValue.replace(text, replacement);
  }
}

let frame = 0;
function scheduleCopy(root) {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    applyCopy(root instanceof Element ? root : document.body);
  });
}

const observer = new MutationObserver((records) => scheduleCopy(records[0]?.target));
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true, characterData: true });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => scheduleCopy(), { once: true });
else scheduleCopy();
window.addEventListener('popstate', () => scheduleCopy());
window.addEventListener('pagehide', () => { observer.disconnect(); cancelAnimationFrame(frame); }, { once: true });
