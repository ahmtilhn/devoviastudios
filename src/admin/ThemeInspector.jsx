import React from 'react';
import { Field, Input, Textarea } from './EditorFields.jsx';

export default function ThemeInspector({ content, onTheme, onHeader, onSeo }) {
  const { theme, header } = content;
  const page = content.pages.home;
  const colors = ['background', 'surface', 'text', 'muted', 'primary', 'primaryText', 'border'];

  return (
    <div className="adm-inspector-content">
      <div className="adm-inspector-title"><div><small>GLOBAL</small><h2>Design system</h2></div></div>
      <p className="adm-panel-label">Colors</p>
      {colors.map((key) => (
        <Field label={key} key={key}>
          <div className="adm-color-input">
            <input type="color" value={theme[key]} onChange={(event) => onTheme({ [key]: event.target.value })} />
            <Input value={theme[key]} onChange={(value) => onTheme({ [key]: value })} />
          </div>
        </Field>
      ))}
      <Field label="Global radius"><Input type="number" value={theme.radius} onChange={(value) => onTheme({ radius: Number(value) })} /></Field>
      <Field label="Font family"><Input value={theme.fontFamily} onChange={(value) => onTheme({ fontFamily: value })} /></Field>
      <div className="adm-divider" />
      <p className="adm-panel-label">Header</p>
      <Field label="Brand"><Input value={header.brand} onChange={(value) => onHeader({ brand: value })} /></Field>
      <Field label="Button text"><Input value={header.ctaLabel} onChange={(value) => onHeader({ ctaLabel: value })} /></Field>
      <Field label="Button link"><Input value={header.ctaHref} onChange={(value) => onHeader({ ctaHref: value })} /></Field>
      <div className="adm-divider" />
      <p className="adm-panel-label">SEO</p>
      <Field label="Page title"><Input value={page.seoTitle} onChange={(value) => onSeo({ seoTitle: value })} /></Field>
      <Field label="Description"><Textarea rows="4" value={page.seoDescription} onChange={(value) => onSeo({ seoDescription: value })} /></Field>
    </div>
  );
}
