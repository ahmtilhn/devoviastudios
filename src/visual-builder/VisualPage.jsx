import React, { useEffect } from 'react';
import './visual-page.css';

const alignClass = (value) => `vb-align-${value || 'left'}`;

function sectionStyle(section) {
  const layout = section.layout || {};
  const background = layout.background === 'accent'
    ? 'linear-gradient(135deg, color-mix(in srgb, var(--vb-primary) 16%, var(--vb-surface)), var(--vb-surface))'
    : layout.background === 'surface'
      ? 'var(--vb-surface)'
      : layout.background || 'transparent';

  return {
    '--section-max': `${layout.maxWidth || 1180}px`,
    '--section-py': `${layout.paddingY ?? 88}px`,
    '--section-px': `${layout.paddingX ?? 24}px`,
    '--section-gap': `${layout.gap ?? 28}px`,
    '--section-radius': `${layout.radius ?? 0}px`,
    '--section-background': background,
    '--section-color': layout.textColor === 'inherit' ? 'var(--vb-text)' : (layout.textColor || 'var(--vb-text)'),
  };
}

function Action({ href, children, secondary = false }) {
  return <a className={`vb-button ${secondary ? 'is-secondary' : ''}`} href={href || '#'}>{children}</a>;
}

function SectionFrame({ section, children, className = '' }) {
  if (section.hidden) return null;
  return (
    <section className={`vb-section ${alignClass(section.layout?.align)} ${className}`} style={sectionStyle(section)} data-section-id={section.id}>
      <div className="vb-section-inner">{children}</div>
    </section>
  );
}

function Eyebrow({ children }) {
  return children ? <p className="vb-eyebrow">{children}</p> : null;
}

function HeroSection({ section }) {
  return (
    <SectionFrame section={section} className="vb-hero">
      <div className="vb-hero-copy">
        <Eyebrow>{section.eyebrow}</Eyebrow>
        <h1>{section.title}</h1>
        <p className="vb-lead">{section.body}</p>
        <div className="vb-actions">
          {section.primaryLabel && <Action href={section.primaryHref}>{section.primaryLabel}</Action>}
          {section.secondaryLabel && <Action href={section.secondaryHref} secondary>{section.secondaryLabel}</Action>}
        </div>
      </div>
      <div className="vb-hero-visual" aria-hidden={!section.image}>
        {section.image ? <img src={section.image} alt="" /> : <div className="vb-orbit"><span /><span /><strong>DEVOVIA</strong></div>}
      </div>
    </SectionFrame>
  );
}

function HeadingSection({ section }) {
  return (
    <SectionFrame section={section} className="vb-heading-section">
      <Eyebrow>{section.eyebrow}</Eyebrow>
      <h2>{section.title}</h2>
      {section.body && <p className="vb-lead">{section.body}</p>}
    </SectionFrame>
  );
}

function TextSection({ section }) {
  return (
    <SectionFrame section={section} className="vb-text-section">
      <h2>{section.title}</h2>
      <p className="vb-body-copy">{section.body}</p>
    </SectionFrame>
  );
}

function CardsSection({ section }) {
  return (
    <SectionFrame section={section} className="vb-cards-section">
      <div className="vb-section-heading">
        <Eyebrow>{section.eyebrow}</Eyebrow>
        <h2>{section.title}</h2>
      </div>
      <div className="vb-card-grid" style={{ '--vb-columns': Math.min(Math.max(Number(section.columns) || 3, 1), 4) }}>
        {(section.items || []).map((item, index) => (
          <article className="vb-card" key={item.id || `${item.title}-${index}`}>
            <span className="vb-card-index">{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

function ImageSection({ section }) {
  return (
    <SectionFrame section={section} className="vb-image-section">
      {section.image ? <img src={section.image} alt={section.alt || ''} /> : <div className="vb-image-placeholder">Add an image from the admin panel</div>}
      {section.caption && <p className="vb-caption">{section.caption}</p>}
    </SectionFrame>
  );
}

function CTASection({ section }) {
  return (
    <SectionFrame section={section} className="vb-cta-section">
      <Eyebrow>{section.eyebrow}</Eyebrow>
      <h2>{section.title}</h2>
      <p className="vb-lead">{section.body}</p>
      {section.buttonLabel && <Action href={section.buttonHref}>{section.buttonLabel}</Action>}
    </SectionFrame>
  );
}

function SpacerSection({ section }) {
  if (section.hidden) return null;
  return <div aria-hidden="true" style={{ height: `${Math.max(0, Number(section.height) || 0)}px` }} />;
}

function RenderSection({ section }) {
  const sections = {
    hero: HeroSection,
    heading: HeadingSection,
    text: TextSection,
    cards: CardsSection,
    image: ImageSection,
    cta: CTASection,
    spacer: SpacerSection,
  };
  const Component = sections[section.type] || TextSection;
  return <Component section={section} />;
}

export default function VisualPage({ content, preview = false }) {
  const page = content?.pages?.home;
  const theme = content?.theme || {};
  const header = content?.header || {};

  useEffect(() => {
    if (preview || !page) return;
    if (page.seoTitle) document.title = page.seoTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && page.seoDescription) meta.setAttribute('content', page.seoDescription);
  }, [page, preview]);

  if (!page) return null;

  const style = {
    '--vb-font': theme.fontFamily,
    '--vb-background': theme.background,
    '--vb-surface': theme.surface,
    '--vb-text': theme.text,
    '--vb-muted': theme.muted,
    '--vb-primary': theme.primary,
    '--vb-primary-text': theme.primaryText,
    '--vb-border': theme.border,
    '--vb-radius': `${theme.radius || 24}px`,
    '--vb-shadow': theme.shadow,
  };

  return (
    <div className={`vb-site ${preview ? 'is-preview' : ''}`} style={style}>
      <header className="vb-header">
        <a className="vb-brand" href="/">
          {header.logo && <img src={header.logo} alt="" />}
          <span>{header.brand || 'Devovia'}</span>
        </a>
        <nav aria-label="Main navigation">
          {(header.links || []).map((link) => <a href={link.href} key={link.id || link.href}>{link.label}</a>)}
        </nav>
        {header.ctaLabel && <Action href={header.ctaHref}>{header.ctaLabel}</Action>}
      </header>
      <main>{(page.sections || []).map((section) => <RenderSection section={section} key={section.id} />)}</main>
      <footer className="vb-footer"><span>© {new Date().getFullYear()} Devovia Studio</span><a href="mailto:info@devoviastudio.com">info@devoviastudio.com</a></footer>
    </div>
  );
}
