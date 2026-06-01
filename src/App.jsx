import React, { useEffect, useMemo, useState } from 'react';
import appData from '../data/apps.json';

const products = appData.apps;

const productRouteMap = {
  'stock-manager': 'stockflow-inventory',
  'stockflow-inventory': 'stock-manager',
  'arrow-escape': 'arrow-escape',
  'daily-hadith': 'daily-hadith',
  tinysteps: 'tinysteps',
};

const services = [
  {
    title: 'Mobile App Development',
    text: 'Cross-platform apps built with clean architecture, polished UI and launch-ready foundations.',
    href: '/services/mobile-app-development',
    icon: 'phone',
  },
  {
    title: 'Game Development',
    text: 'Engaging indie games with memorable mechanics, strong progression and store-ready presentation.',
    href: '/services/game-development',
    icon: 'game',
  },
  {
    title: 'Product Websites',
    text: 'Fast, premium websites that explain products clearly and convert visitors into action.',
    href: '/services/web-development',
    icon: 'web',
  },
  {
    title: 'Google Play Test Support',
    text: 'Closed-testing guidance, store-readiness, policy pages and release support for teams blocked in Google Play.',
    href: '/services/google-play-test-support',
    icon: 'shield',
  },
];

const supportSteps = [
  ['Problem scan', 'We review test blockers, store assets and policy gaps.'],
  ['Fix & prepare', 'We improve your assets, content and test flow.'],
  ['Release ready', 'We guide you toward a cleaner launch process.'],
];

const testProblems = [
  ['Unclear closed-testing requirements', 'Confusing policies, missing information and unclear steps lead to blocked releases.'],
  ['Weak store presentation', 'Incomplete assets, inconsistent descriptions or screenshots create friction and rejections.'],
  ['Missing support & privacy pages', 'Required policy links or support pages are missing or do not meet Play requirements.'],
  ['Inconsistent release-note and tester flows', 'Confusing instructions, poor communication and scattered feedback slow you down.'],
];

const testProcess = [
  ['01', 'Problem scan', 'We review blockers, store assets, policy links and release risks to identify exactly what is holding you back.'],
  ['02', 'Closed test flow', 'We set up clear tester guidance, feedback collection and 14-day process support to keep testing on track.'],
  ['03', 'Launch polish', 'We align descriptions, screenshots, privacy pages and store assets so your store listing meets policy and looks premium.'],
  ['04', 'Post-release support', 'We keep patch notes, support routing and product updates visible and compliant after release.'],
];

const deliverables = [
  'Closed testing policy review & gap report',
  'Tester instructions and feedback setup',
  'Store listing audit & optimization',
  'Privacy policy and support page guidance',
  'Release notes and update strategy',
  'Final checklist for Google Play review readiness',
];

const updates = [
  {
    product: 'Arrow Escape',
    date: 'May 27, 2026',
    title: 'Arrow Escape is live on Google Play',
    text: 'Fading arrows, timed puzzle levels, boosters and daily rewards are now live.',
    slug: 'arrow-escape',
  },
  {
    product: 'Stock Manager',
    date: 'May 8, 2026',
    title: 'Stock Manager backup update',
    text: 'Android backup and restore compatibility improved with better file handling.',
    slug: 'stock-manager',
  },
  {
    product: 'Daily Hadith',
    date: 'May 5, 2026',
    title: 'Daily Hadith stability update',
    text: 'Prayer alarms, notifications and resume sync have been refined.',
    slug: 'daily-hadith',
  },
  {
    product: 'TinySteps',
    date: 'Dec 25, 2025',
    title: 'TinySteps performance update',
    text: 'Startup performance, habit reads and in-app text were polished.',
    slug: 'tinysteps',
  },
];

const blogPosts = [
  ['Google Play', 'How to prepare your app for Google Play closed testing', 'A practical checklist for store readiness, tester flows, support links and release confidence.', '6 min read'],
  ['Google Play', 'Google Play app launch checklist for indie developers', 'What to prepare before launch: screenshots, descriptions, privacy pages, testing and updates.', '7 min read'],
  ['UI/UX', 'How to design a mobile app landing page that builds trust', 'Why product screenshots, support infrastructure and clear copy matter.', '5 min read'],
  ['Mobile Apps', 'Why offline-first apps still matter for business tools', 'How local storage, fast workflows and simple backups help small teams.', '5 min read'],
];

const metaByRoute = {
  '/': ['Devovia Studio - Mobile App, Game & Product Systems Studio', 'Devovia Studio builds polished mobile apps, indie games, product websites and Google Play launch systems with clean engineering and strong UX.'],
  '/products': ['Products - Devovia Studio', 'Explore Devovia Studio mobile apps, games and launch-ready product systems across productivity, habits, spiritual utilities and Google Play support.'],
  '/services': ['Services - Devovia Studio', 'Mobile app development, game development, product websites and Google Play launch support by Devovia Studio.'],
  '/services/google-play-test-support': ['Google Play Test Support - Devovia Studio', 'Get help with Google Play closed testing, store readiness, policy pages, test flows and release support before launch.'],
  '/updates': ['Updates - Devovia Studio', 'Follow Devovia Studio product launches, app updates, release notes and quality improvements.'],
  '/support': ['Support & Privacy - Devovia Studio', 'Find Devovia app support, privacy policies, release notes and contact paths for Stock Manager, Arrow Escape, Daily Hadith and TinySteps.'],
  '/blog': ['Blog - Devovia Studio', 'Practical notes on mobile apps, Google Play, product design and launch systems.'],
  '/contact': ['Start a Project - Devovia Studio', 'Tell Devovia Studio what you want to build and start a clean, launch-ready product system.'],
};

const trText = {
  Devovia: 'Devovia',
  Products: 'Ürünler',
  Services: 'Hizmetler',
  Updates: 'Güncellemeler',
  Blog: 'Blog',
  Support: 'Destek',
  'Start a Project': 'Proje Başlat',
  'Netherlands-based mobile product studio': 'Hollanda merkezli mobil ürün stüdyosu',
  'Launch-ready apps, games and ': 'Yayına hazır uygulamalar, oyunlar ve ',
  'product systems.': 'ürün sistemleri.',
  'Devovia builds polished mobile apps, indie games, product websites and Google Play launch systems with clean engineering, strong UX and credible support infrastructure.': 'Devovia; temiz mühendislik, güçlü UX ve güvenilir destek altyapısıyla mobil uygulamalar, indie oyunlar, ürün web siteleri ve Google Play yayın sistemleri geliştirir.',
  'Explore Products': 'Ürünleri İncele',
  'Get Play Support': 'Play Desteği Al',
  'Live Google Play products': 'Canlı Google Play ürünleri',
  'Real apps with real users.': 'Gerçek kullanıcıları olan gerçek uygulamalar.',
  'Product-first UI systems': 'Ürün odaklı arayüz sistemleri',
  'Designed for clarity and trust.': 'Netlik ve güven için tasarlandı.',
  'Modern stacks. Scalable results.': 'Modern altyapılar. Ölçeklenebilir sonuçlar.',
  'Policies, support and updates built in': 'Politika, destek ve güncellemeler hazır',
  'Launch infrastructure from day one.': 'İlk günden yayın altyapısı.',
  'Featured products': 'Öne çıkan ürünler',
  'Real products built to launch.': 'Yayınlanmak için geliştirilmiş gerçek ürünler.',
  'View all products': 'Tüm ürünler',
  'View product': 'Ürünü incele',
  'Our services': 'Hizmetlerimiz',
  'How Devovia helps': 'Devovia nasıl yardımcı olur',
  'Mobile App Development': 'Mobil Uygulama Geliştirme',
  'Cross-platform apps built with clean architecture, polished UI and launch-ready foundations.': 'Temiz mimari, rafine arayüz ve yayına hazır temellerle geliştirilen çapraz platform uygulamalar.',
  'Game Development': 'Oyun Geliştirme',
  'Engaging indie games with memorable mechanics, strong progression and store-ready presentation.': 'Akılda kalan mekanikler, güçlü ilerleme sistemi ve mağazaya hazır sunumla indie oyunlar.',
  'Product Websites': 'Ürün Web Siteleri',
  'Fast, premium websites that explain products clearly and convert visitors into action.': 'Ürünü net anlatan ve ziyaretçiyi aksiyona taşıyan hızlı, premium web siteleri.',
  'Google Play Test Support': 'Google Play Test Desteği',
  'Closed-testing guidance, store-readiness, policy pages and release support for teams blocked in Google Play.': 'Google Play’de takılan ekipler için kapalı test rehberliği, mağaza hazırlığı, politika sayfaları ve yayın desteği.',
  Explore: 'İncele',
  'Blocked in Google Play closed testing?': 'Google Play kapalı test sürecinde takıldınız mı?',
  'We help developers fix test blockers, improve store readiness and ship with confidence.': 'Test engellerini gidermenize, mağaza hazırlığını güçlendirmenize ve güvenle yayına çıkmanıza yardımcı oluruz.',
  'Problem scan': 'Sorun taraması',
  'We review test blockers, store assets and policy gaps.': 'Test engellerini, mağaza varlıklarını ve politika boşluklarını inceleriz.',
  'Fix & prepare': 'Düzelt ve hazırla',
  'We improve your assets, content and test flow.': 'Varlıklarınızı, içeriklerinizi ve test akışınızı iyileştiririz.',
  'Release ready': 'Yayına hazır',
  'We guide you toward a cleaner launch process.': 'Daha temiz bir yayın sürecine doğru rehberlik ederiz.',
  'Request Support': 'Destek İste',
  'Latest updates': 'Son güncellemeler',
  'Product updates that show momentum.': 'Ürün gelişimini gösteren güncellemeler.',
  'View all updates': 'Tüm güncellemeler',
  'Read more': 'Devamını oku',
  'Have a product idea?': 'Bir ürün fikrin mi var?',
  'Let us build it right. Clean code, strong UX and launch-ready infrastructure from day one.': 'Doğru şekilde inşa edelim. İlk günden temiz kod, güçlü UX ve yayına hazır altyapı.',
  'Products built by Devovia': 'Devovia tarafından geliştirilen ürünler',
  'Real mobile products,': 'Gerçek mobil ürünler,',
  'not placeholder concepts.': 'boş konseptler değil.',
  "Explore Devovia's published apps and launch-ready product systems across productivity, games, habits and spiritual utilities.": 'Devovia’nın yayınlanmış uygulamalarını ve üretkenlik, oyun, alışkanlık ve manevi araçlar alanındaki yayına hazır ürün sistemlerini keşfedin.',
  All: 'Tümü',
  Productivity: 'Üretkenlik',
  Puzzle: 'Bulmaca',
  'Books & Reference': 'Kitaplar ve Referans',
  Games: 'Oyunlar',
  Utility: 'Araçlar',
  Spiritual: 'Manevi',
  'Launch Systems': 'Yayın Sistemleri',
  'Launch systems & support': 'Yayın sistemleri ve destek',
  'Store-readiness, policy pages, test flows and release support for teams blocked in Google Play.': 'Google Play’de takılan ekipler için mağaza hazırlığı, politika sayfaları, test akışları ve yayın desteği.',
  'Why these products feel different': 'Bu ürünler neden farklı hissettirir',
  'Built for real users, release pressure and long-term support.': 'Gerçek kullanıcılar, yayın baskısı ve uzun vadeli destek için geliştirildi.',
  'Service / Google Play Test Support': 'Hizmet / Google Play Test Desteği',
  'Blocked in Google Play ': 'Google Play ',
  'closed testing?': 'kapalı testinde takıldınız mı?',
  'Devovia helps teams improve store readiness, test flows, policy pages and release confidence before launch.': 'Devovia, yayından önce mağaza hazırlığını, test akışlarını, politika sayfalarını ve yayın güvenini iyileştirir.',
  'See the process': 'Süreci gör',
  'Closed testing guidance': 'Kapalı test rehberliği',
  'Store readiness': 'Mağaza hazırlığı',
  'Privacy & support pages': 'Gizlilik ve destek sayfaları',
  'Where teams get stuck': 'Ekiplerin takıldığı yerler',
  'Avoidable blockers slow launches down.': 'Önlenebilir engeller yayını yavaşlatır.',
  'A clear path from blocker to release-ready.': 'Engelden yayına hazır hale net bir yol.',
  'Request support': 'Destek iste',
  'Your name': 'Adınız',
  'Work email': 'İş e-postası',
  Product: 'Ürün',
  'Request type': 'Talep türü',
  Message: 'Mesaj',
  'Enter your name': 'Adınızı yazın',
  'name@company.com': 'ad@sirket.com',
  'Choose a product': 'Ürün seçin',
  'Select a type': 'Tür seçin',
  'Tell us more...': 'Bize biraz daha anlatın...',
  'Your details are secure and used only to respond to your request.': 'Bilgileriniz güvenlidir ve yalnızca talebinize yanıt vermek için kullanılır.',
  'Send request': 'Talebi gönder',
  'Send project request': 'Proje talebi gönder',
  'We do not ask for your Google password.': 'Google şifrenizi istemeyiz.',
  'Ship with more confidence.': 'Daha güvenle yayına çıkın.',
  'Book a review': 'İnceleme iste',
  'Support & Privacy': 'Destek ve Gizlilik',
  'Support pages that feel product-ready, not neglected.': 'İhmal edilmiş değil, ürüne hazır hissettiren destek sayfaları.',
  'Find privacy policies, app support and the right contact path for each Devovia product without digging through generic pages.': 'Genel sayfalarda kaybolmadan her Devovia ürünü için gizlilik politikalarını, uygulama desteğini ve doğru iletişim yolunu bulun.',
  'Privacy policy': 'Gizlilik politikası',
  'Support center': 'Destek merkezi',
  'Release notes': 'Sürüm notları',
  'Choose what you need': 'İhtiyacınızı seçin',
  'Pick a path and we will route your request.': 'Bir yol seçin, talebinizi doğru yere yönlendirelim.',
  'App support': 'Uygulama desteği',
  'Get help with features, bugs or general usage.': 'Özellikler, hatalar veya genel kullanım için yardım alın.',
  'View or request information about your data.': 'Verileriniz hakkında bilgi görüntüleyin veya talep edin.',
  'Billing issue': 'Ödeme sorunu',
  'Questions about payments, refunds or subscriptions.': 'Ödemeler, iadeler veya abonelikler hakkındaki sorular.',
  'Google Play test support': 'Google Play test desteği',
  'Get help with closed testing or release participation.': 'Kapalı test veya yayın katılımı için yardım alın.',
  'Quick privacy access': 'Hızlı gizlilik erişimi',
  'Common questions': 'Sık sorulan sorular',
  'Send us a request': 'Bize talep gönderin',
  'Start a project': 'Proje başlat',
  'Start a project with Devovia.': 'Devovia ile proje başlatın.',
  'Tell us what you want to build. We will help shape it into a clean, launch-ready product system.': 'Ne inşa etmek istediğinizi anlatın. Onu temiz, yayına hazır bir ürün sistemine dönüştürmeye yardımcı olalım.',
};

function detectLocale() {
  const requested = new URLSearchParams(window.location.search).get('lang');
  if (requested?.toLowerCase().startsWith('tr')) return 'tr';
  const language = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  return language.startsWith('tr') ? 'tr' : 'en';
}

function useLocale() {
  const [locale, setLocale] = useState('en');
  useEffect(() => {
    const nextLocale = detectLocale();
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);
  return locale;
}

function useAutoTranslate(locale, path) {
  useEffect(() => {
    if (locale !== 'tr') return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const value = node.nodeValue;
      const translated = trText[value] || trText[value.trim()];
      if (translated) node.nodeValue = value.replace(value.trim(), translated);
    }
    document.querySelectorAll('[placeholder]').forEach((element) => {
      const translated = trText[element.getAttribute('placeholder')];
      if (translated) element.setAttribute('placeholder', translated);
    });
  }, [locale, path]);
}

function normalizePath() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return path;
}

function productUrl(product) {
  if (product.id === 'app-1') return '/products/stock-manager';
  return `/products/${product.slug}`;
}

function projectUrl(product) {
  return productUrl(product);
}

function productBySlug(slug) {
  const normalized = productRouteMap[slug] || slug;
  return products.find((product) => product.slug === normalized || product.id === slug);
}

function getProductFromPath(path) {
  const parts = path.split('/').filter(Boolean);
  if ((parts[0] === 'products' || parts[0] === 'projects') && parts[1]) return productBySlug(parts[1]);
  return null;
}

function useRoute() {
  const [path, setPath] = useState(normalizePath());

  useEffect(() => {
    const onPop = () => setPath(normalizePath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (href) => {
    if (!href.startsWith('/')) return;
    window.history.pushState({}, '', href);
    setPath(normalizePath());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { path, navigate };
}

function useMetadata(path, product) {
  useEffect(() => {
    const routeMeta = product
      ? [`${product.name} - Devovia Studio`, `${product.name}: ${product.short_desc}`]
      : metaByRoute[path] || metaByRoute['/'];
    document.title = routeMeta[0];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', routeMeta[1]);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', routeMeta[0]);
    if (ogDescription) ogDescription.setAttribute('content', routeMeta[1]);
  }, [path, product]);
}

function Icon({ name }) {
  const paths = {
    phone: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 17h2',
    game: 'M7 8h10a5 5 0 0 1 4.8 6.5l-.8 2.4a2 2 0 0 1-3.3.8L15 15H9l-2.7 2.7a2 2 0 0 1-3.3-.8l-.8-2.4A5 5 0 0 1 7 8Zm2 3v4m-2-2h4m6-1h.01m2 2h.01',
    web: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-9-10h18M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
    shield: 'M12 2 20 5v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3Zm-3 10 2 2 4-5',
    code: 'm8 9-4 3 4 3m8-6 4 3-4 3m-2-8-4 10',
    support: 'M4 12a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-2v-6h5M4 16v-4m0 4a3 3 0 0 0 3 3h2v-6H4',
    calendar: 'M7 2v4m10-4v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
    lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z',
    grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
  };
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name] || paths.arrow} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Link({ href, children, className, onNavigate, ...props }) {
  const handleClick = (event) => {
    if (href?.startsWith('/')) {
      event.preventDefault();
      onNavigate?.(href);
    }
  };
  return <a href={href} className={className} onClick={handleClick} {...props}>{children}</a>;
}

function Header({ path, navigate }) {
  const [open, setOpen] = useState(false);
  const links = [
    ['/products', 'Products'],
    ['/services', 'Services'],
    ['/updates', 'Updates'],
    ['/blog', 'Blog'],
    ['/support', 'Support'],
  ];

  const go = (href) => {
    setOpen(false);
    navigate(href);
  };

  return (
    <header className="site-header">
      <Link href="/" className="brand" onNavigate={go}>
        <span className="brand-mark"><img src="/devovia-logo.png" alt="" /></span>
        <span>Devovia</span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([href, label]) => (
          <Link href={href} onNavigate={go} className={path === href ? 'is-active' : ''} key={href}>{label}</Link>
        ))}
      </nav>
      <Link href="/contact" onNavigate={go} className="button primary small">Start a Project</Link>
      <button className="menu-button" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span></span><span></span><span></span>
      </button>
      {open && (
        <div className="mobile-menu">
          {links.map(([href, label]) => <Link href={href} onNavigate={go} key={href}>{label}</Link>)}
          <Link href="/contact" onNavigate={go} className="button primary">Start a Project</Link>
        </div>
      )}
    </header>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="footer-brand" onNavigate={navigate}>
          <span className="brand-mark"><img src="/devovia-logo.png" alt="" /></span>
          <span>Devovia Studio</span>
        </Link>
        <p>We build polished digital products with care, transparency and long-term support.</p>
      </div>
      <div>
        <h3>Products</h3>
        {products.map((product) => <Link href={productUrl(product)} onNavigate={navigate} key={product.id}>{product.name}</Link>)}
      </div>
      <div>
        <h3>Services</h3>
        {services.map((service) => <Link href={service.href} onNavigate={navigate} key={service.title}>{service.title}</Link>)}
      </div>
      <div>
        <h3>Company</h3>
        <Link href="/blog" onNavigate={navigate}>Blog</Link>
        <Link href="/updates" onNavigate={navigate}>Updates</Link>
        <Link href="/support" onNavigate={navigate}>Support</Link>
        <a href="mailto:info@devoviastudio.com">info@devoviastudio.com</a>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, text, action, onNavigate }) {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action && <Link href={action.href} onNavigate={onNavigate} className="text-link">{action.label}<Icon name="arrow" /></Link>}
    </div>
  );
}

function PlayBadge() {
  return <span className="play-badge"><span></span>Google Play</span>;
}

function DeviceMockup({ product, className = '', priority = false }) {
  return (
    <figure className={`device ${className}`} style={{ '--theme': product.theme }}>
      <div className="device-speaker"></div>
      <img src={product.screenshots[0]} alt={`${product.name} product screen`} loading={priority ? 'eager' : 'lazy'} />
    </figure>
  );
}

function HeroDeviceCluster() {
  return (
    <div className="hero-device-cluster" aria-label="Devovia product previews">
      {products.map((product, index) => (
        <DeviceMockup product={product} className={`cluster-${index + 1}`} priority={index === 0} key={product.id} />
      ))}
    </div>
  );
}

function ProductCard({ product, navigate, compact = false }) {
  return (
    <article className={`product-card ${compact ? 'compact-card' : ''}`} style={{ '--theme': product.theme }}>
      <div className="product-card-top">
        <img src={product.icon_url} alt="" />
        <div>
          <span>{product.category}</span>
          <h3>{product.name}</h3>
        </div>
      </div>
      <p>{product.short_copy || product.short_desc}</p>
      {!compact && (
        <div className="product-visual">
          <img src={product.screenshots[0]} alt={`${product.name} screenshot`} loading="lazy" />
        </div>
      )}
      <div className="chip-row">
        {(product.tags || product.feature_details.slice(0, 3).map((feature) => feature.title)).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="card-actions">
        <Link href={productUrl(product)} onNavigate={navigate} className="button ghost">View product<Icon name="arrow" /></Link>
        {!compact && <a href={product.play_url} className="button ghost" target="_blank" rel="noreferrer"><PlayBadge /></a>}
      </div>
    </article>
  );
}

function ServiceCard({ service, navigate }) {
  return (
    <article className="service-card">
      <span className="icon-box"><Icon name={service.icon} /></span>
      <h3>{service.title}</h3>
      <p>{service.text}</p>
      <Link href={service.href} onNavigate={navigate} className="text-link">Explore<Icon name="arrow" /></Link>
    </article>
  );
}

function UpdateCard({ update, navigate }) {
  const product = productBySlug(update.slug);
  return (
    <article className="update-card">
      {product && <img src={product.icon_url} alt="" />}
      <div>
        <time>{update.date}</time>
        <h3>{update.title}</h3>
        <p>{update.text}</p>
        <Link href="/updates" onNavigate={navigate} className="text-link">Read more<Icon name="arrow" /></Link>
      </div>
    </article>
  );
}

function SupportForm({ productName = '', project = false }) {
  return (
    <form className="support-form" action="https://formsubmit.co/info@devoviastudio.com" method="POST">
      <input type="hidden" name="_subject" value={project ? 'New Devovia project request' : 'New Devovia support request'} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <label>Your name<input name="name" placeholder="Enter your name" required /></label>
      <label>Work email<input name="email" type="email" placeholder="name@company.com" required /></label>
      {project ? (
        <>
          <label>Project type<select name="project_type" defaultValue=""><option value="" disabled>Select a type</option><option>Mobile app</option><option>Mobile game</option><option>Product website</option><option>Google Play support</option><option>Support / privacy page</option><option>Other</option></select></label>
          <label>Timeline<select name="timeline" defaultValue=""><option value="" disabled>Select timeline</option><option>As soon as possible</option><option>1-2 months</option><option>3+ months</option></select></label>
        </>
      ) : (
        <>
          <label>Product<input name="product" defaultValue={productName} placeholder="Choose a product" /></label>
          <label>Request type<select name="request_type" defaultValue=""><option value="" disabled>Select a type</option><option>App support</option><option>Privacy policy</option><option>Billing issue</option><option>Google Play test support</option></select></label>
        </>
      )}
      <label className="full">Message<textarea name="message" rows="5" placeholder="Tell us more..." required></textarea></label>
      <p className="form-note"><Icon name="lock" /> Your details are secure and used only to respond to your request.</p>
      <button className="button primary full" type="submit">{project ? 'Send project request' : 'Send request'}<Icon name="arrow" /></button>
    </form>
  );
}

function HomePage({ navigate }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="pill">Netherlands-based mobile product studio</p>
          <h1>Launch-ready apps, games and <span>product systems.</span></h1>
          <p>Devovia builds polished mobile apps, indie games, product websites and Google Play launch systems with clean engineering, strong UX and credible support infrastructure.</p>
          <div className="actions">
            <Link href="/products" onNavigate={navigate} className="button primary">Explore Products<Icon name="arrow" /></Link>
            <Link href="/services/google-play-test-support" onNavigate={navigate} className="button secondary"><Icon name="shield" />Get Play Support</Link>
          </div>
        </div>
        <HeroDeviceCluster />
      </section>

      <section className="capability-strip">
        {[
          ['Live Google Play products', 'Real apps with real users.'],
          ['Product-first UI systems', 'Designed for clarity and trust.'],
          ['Flutter + Firebase + Unity', 'Modern stacks. Scalable results.'],
          ['Policies, support and updates built in', 'Launch infrastructure from day one.'],
        ].map(([title, text], index) => (
          <article key={title}>
            <span className="icon-box">{index === 0 ? <PlayBadge /> : <Icon name={['grid', 'code', 'shield'][index - 1]} />}</span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </article>
        ))}
      </section>

      <section className="section">
        <SectionHeader eyebrow="Featured products" title="Real products built to launch." action={{ href: '/products', label: 'View all products' }} onNavigate={navigate} />
        <div className="featured-grid">
          {products.map((product) => <ProductCard product={product} navigate={navigate} compact key={product.id} />)}
        </div>
      </section>

      <section className="section split-area">
        <div>
          <SectionHeader eyebrow="Our services" title="How Devovia helps" />
          <div className="service-grid">
            {services.map((service) => <ServiceCard service={service} navigate={navigate} key={service.title} />)}
          </div>
        </div>
        <TestSupportTeaser navigate={navigate} />
      </section>

      <section className="section">
        <SectionHeader eyebrow="Latest updates" title="Product updates that show momentum." action={{ href: '/updates', label: 'View all updates' }} onNavigate={navigate} />
        <div className="updates-row">
          {updates.slice(0, 3).map((update) => <UpdateCard update={update} navigate={navigate} key={update.title} />)}
        </div>
      </section>

      <CTASection navigate={navigate} />
    </>
  );
}

function TestSupportTeaser({ navigate }) {
  return (
    <article className="test-teaser">
      <p className="eyebrow">Google Play Test Support</p>
      <h2>Blocked in Google Play closed testing?</h2>
      <p>We help developers fix test blockers, improve store readiness and ship with confidence.</p>
      <div className="step-row">
        {supportSteps.map(([title, text], index) => (
          <div key={title}><strong>{index + 1}</strong><h3>{title}</h3><p>{text}</p></div>
        ))}
      </div>
      <Link href="/services/google-play-test-support" onNavigate={navigate} className="button primary">Request Support<Icon name="arrow" /></Link>
    </article>
  );
}

function CTASection({ navigate }) {
  return (
    <section className="final-cta">
      <div>
        <h2>Have a product idea?</h2>
        <p>Let us build it right. Clean code, strong UX and launch-ready infrastructure from day one.</p>
      </div>
      <Link href="/contact" onNavigate={navigate} className="button primary">Start a Project<Icon name="arrow" /></Link>
    </section>
  );
}

function ProductsPage({ navigate }) {
  return (
    <>
      <PageHero eyebrow="Products built by Devovia" title={<><span>Real mobile products,</span><br />not placeholder concepts.</>} text="Explore Devovia's published apps and launch-ready product systems across productivity, games, habits and spiritual utilities." />
      <div className="filter-row">
        {['All', 'Productivity', 'Games', 'Utility', 'Spiritual', 'Launch Systems'].map((filter, index) => <button className={index === 0 ? 'active' : ''} type="button" key={filter}>{filter}</button>)}
      </div>
      <section className="products-grid">
        {products.map((product) => <ProductCard product={product} navigate={navigate} key={product.id} />)}
      </section>
      <section className="support-product-card">
        <span className="icon-xl"><Icon name="shield" /></span>
        <div>
          <p className="eyebrow">Launch systems & support</p>
          <h2>Google Play Test Support</h2>
          <p>Store-readiness, policy pages, test flows and release support for teams blocked in Google Play.</p>
        </div>
        <div className="support-product-steps">
          {supportSteps.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <Link href="/services/google-play-test-support" onNavigate={navigate} className="button primary">Request Support<Icon name="arrow" /></Link>
      </section>
      <section className="section">
        <SectionHeader eyebrow="Why these products feel different" title="Built for real users, release pressure and long-term support." />
        <div className="reason-grid">
          {[
            ['Product-first UX', 'Built for clarity, speed and real-world use. Every screen solves a problem with minimal friction and maximum focus.'],
            ['Support infrastructure', 'From documentation to release support, our systems are designed to help you launch and scale with confidence.'],
            ['Release-ready systems', 'We build with store-readiness in mind - policies, privacy, test flows and assets, so you can ship without roadblocks.'],
          ].map(([title, text], index) => <article className="reason-card" key={title}><span className="icon-box"><Icon name={['grid', 'support', 'shield'][index]} /></span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {children}
    </section>
  );
}

function ProductDetailPage({ product, navigate }) {
  const isStock = product.id === 'app-1';
  return (
    <>
      <section className="product-hero-detail" style={{ '--theme': product.theme }}>
        <div>
          <p className="eyebrow">Product detail / {product.category}</p>
          <div className="product-title-row">
            <img src={product.icon_url} alt="" />
            <h1>{product.name}</h1>
          </div>
          <p className="hero-lead">{product.tagline}</p>
          <p>{isStock ? 'Stock Manager helps small and medium-sized businesses organize products, track inventory movements, monitor stock value and export data with confidence - all in a fast, offline-first workflow.' : product.long_desc.split('\n')[0]}</p>
          <div className="actions">
            <a className="button primary" href={product.play_url} target="_blank" rel="noreferrer"><PlayBadge />View on Google Play<Icon name="arrow" /></a>
            <Link href="/support" onNavigate={navigate} className="button secondary"><Icon name="shield" />Contact Support</Link>
          </div>
          <div className="meta-chip-row">
            <span>{product.category}</span>
            <span>{product.downloads_text} downloads</span>
            <span>Updated {formatDate(product.updated_on)}</span>
            {isStock && <span>Offline-first</span>}
          </div>
        </div>
        <div className="detail-device-row">
          {product.screenshots.map((shot, index) => <DeviceMockup product={{ ...product, screenshots: [shot] }} className={`detail-device-${index + 1}`} key={shot} />)}
        </div>
      </section>

      <section className="detail-grid">
        <article className="glass-panel">
          <span className="icon-box"><Icon name="shield" /></span>
          <h2>What it solves</h2>
          <p>{isStock ? 'Many businesses lose time to manual tracking, missing stock updates and disconnected data. Stock Manager brings everything together - products, movements, value and reports - so you always know what is in stock, what is moving and what to reorder.' : product.short_desc}</p>
        </article>
        <article className="glass-panel wide">
          <h2>Core capabilities</h2>
          <div className="capability-grid">
            {product.feature_details.concat(getBulletFeatures(product).slice(0, 6).map((title) => ({ title }))).slice(0, 10).map((feature, index) => (
              <span key={`${feature.title}-${index}`}><Icon name={['code', 'grid', 'shield', 'calendar'][index % 4]} />{feature.title}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="workflow-section">
        <article className="glass-panel gallery-panel">
          <h2>Inside the workflow</h2>
          <div className="gallery-row">
            {product.screenshots.concat(product.screenshots).slice(0, 5).map((shot, index) => <img src={shot} alt={`${product.name} workflow screen ${index + 1}`} loading="lazy" key={`${shot}-${index}`} />)}
          </div>
        </article>
        <article className="glass-panel">
          <span className="icon-box"><Icon name="code" /></span>
          <h2>Technical stack</h2>
          <div className="chip-row large">
            {product.tech_stack.split('/').map((item) => <span key={item}>{item.trim()}</span>)}
            {isStock && <span>Offline storage</span>}
          </div>
        </article>
      </section>

      <section className="detail-footer-grid">
        <article className="glass-panel">
          <span className="icon-box"><Icon name="calendar" /></span>
          <h2>Release notes</h2>
          <ul>{product.release_notes.map((note) => <li key={note}>{note}</li>)}</ul>
          <Link href="/updates" onNavigate={navigate} className="text-link">View all updates<Icon name="arrow" /></Link>
        </article>
        <article className="glass-panel">
          <span className="icon-box"><Icon name="shield" /></span>
          <h2>Need help?</h2>
          <p>We are here to support setup, troubleshooting and best practices.</p>
          <Link href="/support" onNavigate={navigate} className="button primary">Contact Support<Icon name="arrow" /></Link>
        </article>
        <article className="glass-panel">
          <h2>Privacy first</h2>
          <p>Your data stays on your device where possible. We do not collect or share personal information without purpose.</p>
          <a href={product.privacy_url} className="text-link">Learn more<Icon name="arrow" /></a>
        </article>
      </section>
    </>
  );
}

function getBulletFeatures(product) {
  return product.long_desc.split('\n').filter((line) => line.trim().startsWith('-')).map((line) => line.replace('-', '').trim());
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function ServicesPage({ navigate }) {
  return (
    <>
      <PageHero eyebrow="Services" title={<>Product systems from idea to launch.</>} text="Devovia helps shape, build, publish and support mobile apps, indie games, product websites and Google Play launch systems." />
      <section className="service-grid full-grid">
        {services.map((service) => <ServiceCard service={service} navigate={navigate} key={service.title} />)}
      </section>
      <CTASection navigate={navigate} />
    </>
  );
}

function TestSupportPage({ navigate }) {
  return (
    <>
      <section className="test-support-page">
        <div className="test-main">
          <PageHero eyebrow="Service / Google Play Test Support" title={<>Blocked in Google Play <span>closed testing?</span></>} text="Devovia helps teams improve store readiness, test flows, policy pages and release confidence before launch.">
            <div className="actions">
              <a className="button primary" href="#request">Request Support<Icon name="arrow" /></a>
              <a className="button secondary" href="#process">See the process</a>
            </div>
            <div className="meta-chip-row"><span>Closed testing guidance</span><span>Store readiness</span><span>Privacy & support pages</span></div>
          </PageHero>
          <section className="section compact-section">
            <SectionHeader eyebrow="Where teams get stuck" title="Avoidable blockers slow launches down." />
            <div className="problem-grid">
              {testProblems.map(([title, text], index) => <article className="glass-panel" key={title}><span className="icon-box"><Icon name={['support', 'web', 'shield', 'arrow'][index]} /></span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </section>
          <section className="section compact-section" id="process">
            <SectionHeader eyebrow="How Devovia helps" title="A clear path from blocker to release-ready." />
            <div className="process-grid">
              {testProcess.map(([num, title, text]) => <article className="glass-panel" key={num}><strong className="process-num">{num}</strong><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </section>
          <section className="faq-grid">
            {[
              ['How quickly can you help us?', 'We respond within 24 hours on business days and share an initial plan as soon as possible.'],
              ['Do you guarantee approval?', 'No one can guarantee Google decisions. We follow best practices to maximize readiness and reduce avoidable blockers.'],
              ['Will you make changes directly in our console?', 'We provide step-by-step guidance and assets. You publish changes in your Google Play Console.'],
              ['What information do you need to start?', 'Your store listing draft, policy pages, app link, screenshots and details of the current blocker.'],
            ].map(([q, a]) => <article className="faq-card" key={q}><h3>{q}</h3><p>{a}</p></article>)}
          </section>
        </div>
        <aside className="request-panel" id="request">
          <p className="eyebrow">Request support</p>
          <SupportForm />
          <ul className="deliverables">
            {deliverables.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="security-note">We do not ask for your Google password.</p>
        </aside>
      </section>
      <section className="final-cta">
        <div><h2>Ship with more confidence.</h2><p>Resolve blockers, polish your store and launch with confidence.</p></div>
        <a href="#request" className="button primary">Book a review<Icon name="arrow" /></a>
      </section>
    </>
  );
}

function UpdatesPage({ navigate }) {
  return (
    <>
      <PageHero eyebrow="Updates" title={<>Release notes that keep <span>products credible.</span></>} text="Follow product launches, quality improvements and release milestones across the Devovia catalog.">
        <HeroDeviceCluster />
      </PageHero>
      <div className="filter-row">
        {['All', 'Stock Manager', 'Arrow Escape', 'Daily Hadith', 'TinySteps', 'Studio'].map((filter, index) => <button className={index === 0 ? 'active' : ''} type="button" key={filter}>{filter}</button>)}
      </div>
      <section className="updates-layout">
        <div className="timeline-list">
          {updates.map((update) => <UpdateCard update={update} navigate={navigate} key={update.title} />)}
        </div>
        <div className="story-grid">
          {products.map((product) => <article className="story-card" style={{ '--theme': product.theme }} key={product.id}><img src={product.icon_url} alt="" /><h3>{product.name}</h3><time>{formatDate(product.updated_on)}</time><ul>{product.release_notes.map((note) => <li key={note}>{note}</li>)}</ul><Link href={productUrl(product)} onNavigate={navigate} className="text-link">Read full notes<Icon name="arrow" /></Link></article>)}
          <article className="launch-support-row"><h3>Need launch support?</h3><p>Our Google Play Test Support service helps you run closed tests, fix issues and release with confidence.</p><Link href="/services/google-play-test-support" onNavigate={navigate} className="button primary">Explore Test Support<Icon name="arrow" /></Link></article>
        </div>
      </section>
    </>
  );
}

function SupportPage({ navigate }) {
  return (
    <>
      <PageHero eyebrow="Support & Privacy" title={<>Support pages that feel product-ready, not neglected.</>} text="Find privacy policies, app support and the right contact path for each Devovia product without digging through generic pages.">
        <div className="support-app-grid">
          {products.map((product) => <article className="support-app-card" key={product.id}><img src={product.icon_url} alt="" /><h3>{product.name}</h3><p>{product.category}</p><a href={product.privacy_url}>Privacy policy</a><Link href={productUrl(product)} onNavigate={navigate}>Support center</Link><Link href="/updates" onNavigate={navigate}>Release notes</Link></article>)}
        </div>
      </PageHero>
      <section className="support-layout">
        <div>
          <SectionHeader eyebrow="Choose what you need" title="Pick a path and we will route your request." />
          <div className="support-choice-grid">
            {[
              ['App support', 'Get help with features, bugs or general usage.', 'support'],
              ['Privacy policy', 'View or request information about your data.', 'lock'],
              ['Billing issue', 'Questions about payments, refunds or subscriptions.', 'grid'],
              ['Google Play test support', 'Get help with closed testing or release participation.', 'shield'],
            ].map(([title, text, icon]) => <article className="glass-panel" key={title}><span className="icon-box"><Icon name={icon} /></span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
          <article className="quick-privacy glass-panel">
            <h3>Quick privacy access</h3>
            <div className="chip-row large">
              {products.map((product) => <a href={product.privacy_url} key={product.id}><img src={product.icon_url} alt="" />{product.name}</a>)}
            </div>
          </article>
          <div className="faq-grid">
            {[
              ['What is the response time?', 'We aim to reply within 1-2 business days for all support requests.'],
              ['What information should I include?', 'Include your device, app version and detailed steps to help us assist faster.'],
              ['How are privacy pages used?', 'Our privacy policies explain what data we collect, why and how it is protected.'],
            ].map(([q, a]) => <article className="faq-card" key={q}><h3>{q}</h3><p>{a}</p></article>)}
          </div>
        </div>
        <aside className="request-panel">
          <p className="eyebrow">Send us a request</p>
          <SupportForm />
        </aside>
      </section>
    </>
  );
}

function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Practical notes on mobile apps, Google Play and product launches." text="Guides for builders who need launch-ready apps, store pages, support systems and product websites." />
      <div className="filter-row">
        {['Google Play', 'Flutter', 'Mobile Apps', 'Game Development', 'UI/UX', 'Product Launch'].map((filter) => <button type="button" key={filter}>{filter}</button>)}
      </div>
      <section className="blog-grid">
        {blogPosts.map(([category, title, text, readTime]) => <article className="blog-card" key={title}><span>{category}</span><h2>{title}</h2><p>{text}</p><time>June 2026 - {readTime}</time><a className="text-link" href="#top">Read article<Icon name="arrow" /></a></article>)}
      </section>
    </>
  );
}

function ContactPage() {
  return (
    <section className="contact-page">
      <div>
        <p className="eyebrow">Start a project</p>
        <h1>Start a project with Devovia.</h1>
        <p>Tell us what you want to build. We will help shape it into a clean, launch-ready product system.</p>
      </div>
      <SupportForm project />
    </section>
  );
}

function App() {
  const { path, navigate } = useRoute();
  const locale = useLocale();
  const product = getProductFromPath(path);
  useMetadata(path, product);
  useAutoTranslate(locale, path);

  const page = useMemo(() => {
    if (product) return <ProductDetailPage product={product} navigate={navigate} />;
    if (path === '/products' || path === '/projects') return <ProductsPage navigate={navigate} />;
    if (path === '/services/google-play-test-support') return <TestSupportPage navigate={navigate} />;
    if (path.startsWith('/services')) return <ServicesPage navigate={navigate} />;
    if (path === '/updates') return <UpdatesPage navigate={navigate} />;
    if (path === '/support') return <SupportPage navigate={navigate} />;
    if (path === '/blog') return <BlogPage />;
    if (path === '/contact') return <ContactPage />;
    return <HomePage navigate={navigate} />;
  }, [path, product, navigate]);

  return (
    <div className="app-shell">
      <Header path={path} navigate={navigate} />
      <main id="top">{page}</main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
