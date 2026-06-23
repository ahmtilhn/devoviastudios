import React from 'react';
import { Field, Input, Textarea, sectionNames } from './EditorFields.jsx';

export default function SectionInspector({ section, onPatch, onLayout }) {
  if (!section) return <div className="adm-empty-inspector">Select a section.</div>;

  return (
    <div className="adm-inspector-content">
      <div className="adm-inspector-title">
        <div><small>{sectionNames[section.type]}</small><h2>Section settings</h2></div>
      </div>
      {'eyebrow' in section && <Field label="Eyebrow"><Input value={section.eyebrow} onChange={(value) => onPatch({ eyebrow: value })} /></Field>}
      {'title' in section && <Field label="Title"><Input value={section.title} onChange={(value) => onPatch({ title: value })} /></Field>}
      {'body' in section && <Field label="Body"><Textarea rows="6" value={section.body} onChange={(value) => onPatch({ body: value })} /></Field>}
      {'image' in section && <Field label="Image URL"><Input value={section.image} onChange={(value) => onPatch({ image: value })} /></Field>}
      {'buttonLabel' in section && <Field label="Button"><Input value={section.buttonLabel} onChange={(value) => onPatch({ buttonLabel: value })} /></Field>}
      {'buttonHref' in section && <Field label="Button link"><Input value={section.buttonHref} onChange={(value) => onPatch({ buttonHref: value })} /></Field>}
      {'height' in section && <Field label="Height"><Input type="number" value={section.height} onChange={(value) => onPatch({ height: Number(value) })} /></Field>}
      <div className="adm-divider" />
      <p className="adm-panel-label">Layout</p>
      <div className="adm-field-grid">
        <Field label="Max width"><Input type="number" value={section.layout?.maxWidth} onChange={(value) => onLayout({ maxWidth: Number(value) })} /></Field>
        <Field label="Spacing"><Input type="number" value={section.layout?.paddingY} onChange={(value) => onLayout({ paddingY: Number(value) })} /></Field>
        <Field label="Radius"><Input type="number" value={section.layout?.radius} onChange={(value) => onLayout({ radius: Number(value) })} /></Field>
        <Field label="Alignment"><select value={section.layout?.align || 'left'} onChange={(event) => onLayout({ align: event.target.value })}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></Field>
      </div>
      <Field label="Visible"><input type="checkbox" checked={!section.hidden} onChange={(event) => onPatch({ hidden: !event.target.checked })} /></Field>
    </div>
  );
}
