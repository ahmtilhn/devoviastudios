const copy = new Map([
  ['Netherlands-based mobile product studio', 'Independent digital product studio'],
  ['Devovia builds polished mobile apps, indie games, product websites and Google Play launch systems with clean engineering, strong UX and credible support infrastructure.', 'Devovia designs and builds refined mobile products, independent games, product websites and launch systems with clear strategy, disciplined engineering and long-term product care.'],
  ['Useful ideas, turned into products', 'Thoughtful ideas, shaped into products'],
  ['people feel at home with.', 'people understand, trust and return to.'],
  ['We design and build thoughtful mobile apps, indie games and product websites. You bring the idea; we help make it clear, polished and ready for real people.', 'We turn promising ideas into coherent digital products by connecting product strategy, interface design, engineering and launch quality from the beginning.'],
  ['One small team for the whole product journey.', 'One focused studio across the full product journey.'],
  ['From an early idea to launch day, we keep strategy, design, development and support connected—so the experience feels like one product, not a pile of separate parts.', 'From early definition to release and continued improvement, strategy, experience, engineering and support remain connected so every decision reinforces the same product vision.'],
  ['Built around real, everyday moments.', 'Built around specific needs, clear decisions and repeated use.'],
  ['Clear steps.', 'Clear decisions.'],
  ['No mystery.', 'Visible progress.'],
  ['You always know what we are solving, what comes next and why a decision was made. The process stays practical, collaborative and focused on the people who will use the product.', 'Every phase has a defined purpose, visible decision logic and a clear next step. The process stays collaborative without allowing ambiguity to dilute product quality.'],
  ['Small improvements that keep products moving.', 'Meaningful refinements that strengthen the product over time.'],
  ['Small studio.', 'Focused studio.'],
  ['Close collaboration.', 'Senior-level involvement.'],
  ['Got an idea? Let’s talk it through.', 'A stronger product begins with a sharper conversation.'],
  ['Share what you want to make, where you are today and what feels difficult. We will help you find the clearest next step.', 'Share the user need, current constraints and desired outcome. We will identify the decisions that matter most and define the strongest next step.'],
  ['Real products built to launch.', 'Products designed to earn trust beyond launch day.'],
  ['Products built by Devovia', 'Published product portfolio'],
  ['Real mobile products,', 'Digital products with'],
  ['not placeholder concepts.', 'real purpose and operating depth.'],
  ["Explore Devovia's published apps and launch-ready product systems across productivity, games, habits and spiritual utilities.", 'Explore published mobile products shaped around distinct user needs, clear interaction models and maintainable engineering foundations.'],
  ['Built for real users, release pressure and long-term support.', 'Designed around useful outcomes, disciplined execution and continuity after release.'],
  ['Product systems from idea to launch.', 'Strategy, design and engineering shaped as one product system.'],
  ['Devovia helps shape, build, publish and support mobile apps, indie games, product websites and Google Play launch systems.', 'Devovia connects product strategy, interaction design, engineering, release preparation and support into one focused delivery process.'],
  ['Devovia helps teams improve store readiness, test flows, policy pages and release confidence before launch.', 'We review testing, listing quality, policy links, support routes and submission risk, then turn the findings into a clear release plan.'],
  ['Avoidable blockers slow launches down.', 'Small inconsistencies can create expensive release friction.'],
  ['A clear path from blocker to release-ready.', 'A focused sequence from diagnosis to a stronger submission.'],
  ['Release notes that keep', 'Release communication that keeps'],
  ['products credible.', 'product progress visible and trustworthy.'],
  ['Support pages that feel product-ready, not neglected.', 'Support and privacy experiences designed with the same care as the product.'],
  ['Find privacy policies, app support and the right contact path for each Devovia product without digging through generic pages.', 'Reach the correct product, policy or support path quickly, with clear context and no generic routing maze.'],
  ['Practical notes on mobile apps, Google Play and product launches.', 'Product thinking for teams building, releasing and improving digital products.'],
  ['Guides for builders who need launch-ready apps, store pages, support systems and product websites.', 'Field notes on product experience, mobile engineering, store readiness, support design and release quality.'],
  ['Start a project with Devovia.', 'Start with the product problem worth solving.'],
  ['Tell us what you want to build. We will help shape it into a clean, launch-ready product system.', 'Share the context, user need and ambition. We will help turn them into a focused product strategy and a credible delivery path.'],
  ['We build polished digital products with care, transparency and long-term support.', 'We design and build considered digital products with clarity, technical discipline and long-term product care.'],
]);

const routeMeta = {
  '/': ['Devovia Studio — Digital Product Design & Engineering', 'Devovia Studio designs and builds refined mobile products, independent games, product websites and launch systems with clear strategy, disciplined engineering and long-term product care.'],
  '/products': ['Product Portfolio — Devovia Studio', 'Explore published products shaped around specific user needs, clear interaction models and maintainable engineering foundations.'],
  '/services': ['Product Design & Engineering Services — Devovia Studio', 'Product strategy, interaction design, mobile engineering, game development, product websites and release readiness delivered as one connected system.'],
  '/services/google-play-test-support': ['Google Play Release Readiness — Devovia Studio', 'A structured review of testing, store presentation, policy coverage, support routes and submission risk.'],
  '/updates': ['Product Updates — Devovia Studio', 'Meaningful product releases, reliability improvements and quality milestones across the Devovia portfolio.'],
  '/support': ['Product Support & Privacy — Devovia Studio', 'Clear product support, privacy information and request routing for every published Devovia product.'],
  '/blog': ['Product Notes — Devovia Studio', 'Practical thinking on digital product experience, mobile engineering, store readiness and release quality.'],
  '/contact': ['Discuss a Product — Devovia Studio', 'Share the user need, constraints and ambition behind your product and define a credible delivery path.'],
};

function replaceText(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      return !parent || parent.closest('script,style,svg,noscript,textarea,input,select,option')
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
  });
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const value = node.nodeValue;
    const trimmed = value.trim();
    const replacement = copy.get(trimmed);
    if (replacement) node.nodeValue = value.replace(trimmed, replacement);
  }

  const proof = document.querySelector('.dv-hero-proof > div:nth-child(3)');
  if (proof) {
    proof.querySelector('strong').textContent = 'Independent';
    proof.querySelector('span').textContent = 'Product studio';
  }
  const footerCopy = document.querySelector('.dv-footer-brand p');
  if (footerCopy) footerCopy.textContent = 'An independent studio designing useful apps, distinctive games and clear digital product experiences.';
  const footerSignal = document.querySelector('.dv-footer-bottom span:last-child');
  if (footerSignal) footerSignal.textContent = 'Independent products, built with care.';
  const aboutCopy = document.querySelector('.dv-about-copy > p');
  if (aboutCopy) aboutCopy.textContent = 'Devovia Studio is an independent digital product studio. We build our own apps and games, and help teams turn promising ideas into products that feel clear, credible and considered at every stage.';
}

function updateMeta() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const meta = routeMeta[path];
  if (!meta) return;
  document.title = meta[0];
  [['meta[name="description"]', meta[1]], ['meta[property="og:title"]', meta[0]], ['meta[property="og:description"]', meta[1]]].forEach(([selector, value]) => {
    document.querySelector(selector)?.setAttribute('content', value);
  });
}

let frame = 0;
function schedule(root = document.body) {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    replaceText(root instanceof Element ? root : document.body);
    updateMeta();
    document.documentElement.lang = 'en';
    document.documentElement.dataset.brandLanguage = 'v8';
  });
}

const observer = new MutationObserver((records) => schedule(records[0]?.target));
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true, characterData: true });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => schedule(), { once: true });
else schedule();
window.addEventListener('popstate', () => schedule());
window.addEventListener('pagehide', () => { observer.disconnect(); cancelAnimationFrame(frame); }, { once: true });
