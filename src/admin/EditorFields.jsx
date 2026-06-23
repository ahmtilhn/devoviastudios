import React from 'react';

export function Field({ label, children, hint }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Input({ value = '', onChange, ...props }) {
  return <input value={value} onChange={(event) => onChange(event.target.value)} {...props} />;
}

export function Textarea({ value = '', onChange, ...props }) {
  return <textarea value={value} onChange={(event) => onChange(event.target.value)} {...props} />;
}

export const sectionNames = {
  hero: 'Hero',
  heading: 'Heading',
  text: 'Text',
  cards: 'Cards',
  image: 'Image',
  cta: 'Call to action',
  spacer: 'Spacer',
};
