const id = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const createSection = (type) => {
  const base = {
    id: id(type),
    type,
    hidden: false,
    layout: {
      maxWidth: 1180,
      paddingY: 88,
      paddingX: 24,
      gap: 28,
      align: 'left',
      background: 'transparent',
      textColor: 'inherit',
      radius: 0,
    },
  };

  const presets = {
    hero: {
      ...base,
      eyebrow: 'DEVOVIA STUDIO',
      title: 'Digital products built to feel clear, useful and launch-ready.',
      body: 'We design and develop mobile apps, games and product websites with polished UI, reliable engineering and long-term support in mind.',
      primaryLabel: 'Explore products',
      primaryHref: '/products',
      secondaryLabel: 'Start a project',
      secondaryHref: '/contact',
      image: '',
      layout: { ...base.layout, paddingY: 112, gap: 48 },
    },
    heading: {
      ...base,
      eyebrow: 'SECTION',
      title: 'A clear section heading',
      body: 'Use this area to explain the purpose of the section in one or two concise sentences.',
    },
    text: {
      ...base,
      title: 'Tell the story behind the product.',
      body: 'Write a focused paragraph here. The editor keeps typography and spacing responsive automatically.',
    },
    cards: {
      ...base,
      eyebrow: 'CAPABILITIES',
      title: 'Everything needed from idea to launch.',
      columns: 3,
      items: [
        { id: id('card'), title: 'Product strategy', body: 'Clear scope, priorities and a launch path before development begins.' },
        { id: id('card'), title: 'UI and engineering', body: 'A consistent visual system backed by maintainable implementation.' },
        { id: id('card'), title: 'Release support', body: 'Store assets, policies, testing flows and post-launch iteration.' },
      ],
    },
    image: {
      ...base,
      image: '',
      alt: 'Devovia Studio project visual',
      caption: '',
      layout: { ...base.layout, paddingY: 48, radius: 28 },
    },
    cta: {
      ...base,
      eyebrow: 'LET’S BUILD',
      title: 'Have a product in mind?',
      body: 'Share the idea, current stage and launch goal. We will turn it into a clear next step.',
      buttonLabel: 'Start a project',
      buttonHref: '/contact',
      layout: { ...base.layout, align: 'center', background: 'accent', radius: 32 },
    },
    spacer: {
      ...base,
      height: 64,
      layout: { ...base.layout, paddingY: 0, paddingX: 0 },
    },
  };

  return presets[type] || presets.text;
};

export const defaultSiteContent = {
  version: 1,
  updatedAt: null,
  theme: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    background: '#f7f8fa',
    surface: '#ffffff',
    text: '#15171a',
    muted: '#626872',
    primary: '#6c63ff',
    primaryText: '#ffffff',
    border: '#e6e8ec',
    radius: 24,
    shadow: '0 20px 60px rgba(25, 28, 35, 0.08)',
  },
  header: {
    brand: 'Devovia',
    logo: '/devovia-logo.png',
    links: [
      { id: id('nav'), label: 'Products', href: '/products' },
      { id: id('nav'), label: 'Services', href: '/services' },
      { id: id('nav'), label: 'Updates', href: '/updates' },
      { id: id('nav'), label: 'Blog', href: '/blog' },
    ],
    ctaLabel: 'Start a project',
    ctaHref: '/contact',
  },
  pages: {
    home: {
      title: 'Devovia Studio',
      slug: '/',
      seoTitle: 'Devovia Studio — Apps, Games and Product Websites',
      seoDescription: 'Devovia Studio designs and develops polished mobile apps, games and product websites.',
      sections: [
        createSection('hero'),
        createSection('cards'),
        createSection('cta'),
      ],
    },
  },
};

export const cloneContent = (value) => JSON.parse(JSON.stringify(value));
