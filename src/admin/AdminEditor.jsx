import React, { useMemo, useState } from 'react';
import VisualPage from '../visual-builder/VisualPage.jsx';
import { cloneContent, createSection } from '../visual-builder/defaultContent.js';
import SectionInspector from './SectionInspector.jsx';
import ThemeInspector from './ThemeInspector.jsx';
import { sectionNames } from './EditorFields.jsx';

export default function AdminEditor({ initialContent, onSave, onPublish, onSignOut }) {
  const [content, setContent] = useState(() => cloneContent(initialContent));
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(content.pages.home.sections[0]?.id || null);
  const [panel, setPanel] = useState('section');
  const [device, setDevice] = useState('desktop');
  const [status, setStatus] = useState('');
  const [draggedId, setDraggedId] = useState(null);

  const sections = content.pages.home.sections;
  const selected = useMemo(() => sections.find((section) => section.id === selectedId), [sections, selectedId]);

  const commit = (next) => {
    setHistory((items) => [...items.slice(-29), cloneContent(content)]);
    setContent(next);
  };

  const change = (recipe) => {
    const next = cloneContent(content);
    recipe(next);
    commit(next);
  };

  const updateSelected = (patch) => change((next) => {
    const index = next.pages.home.sections.findIndex((section) => section.id === selectedId);
    if (index >= 0) next.pages.home.sections[index] = { ...next.pages.home.sections[index], ...patch };
  });

  const addSection = (type) => {
    const section = createSection(type);
    change((next) => next.pages.home.sections.push(section));
    setSelectedId(section.id);
    setPanel('section');
  };

  const removeSection = (id) => {
    change((next) => { next.pages.home.sections = next.pages.home.sections.filter((section) => section.id !== id); });
    setSelectedId(sections.find((section) => section.id !== id)?.id || null);
  };

  const duplicateSection = (id) => {
    const source = sections.find((section) => section.id === id);
    if (!source) return;
    const copy = { ...cloneContent(source), id: `${source.type}-${Date.now()}` };
    change((next) => {
      const index = next.pages.home.sections.findIndex((section) => section.id === id);
      next.pages.home.sections.splice(index + 1, 0, copy);
    });
    setSelectedId(copy.id);
  };

  const moveSection = (targetId) => {
    if (!draggedId || draggedId === targetId) return;
    change((next) => {
      const list = next.pages.home.sections;
      const from = list.findIndex((section) => section.id === draggedId);
      const to = list.findIndex((section) => section.id === targetId);
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
    });
    setDraggedId(null);
  };

  const run = async (action, message) => {
    setStatus(message);
    try { await action(content); setStatus(`${message} done`); }
    catch (error) { setStatus(error.message); }
  };

  return (
    <div className="adm-app">
      <header className="adm-toolbar">
        <a className="adm-toolbar-brand" href="/"><img src="/devovia-logo.png" alt="" /><span>Devovia Editor</span></a>
        <button type="button" disabled={!history.length} onClick={() => {
          const previous = history.at(-1);
          setHistory((items) => items.slice(0, -1));
          setContent(previous);
        }}>Undo</button>
        <div className="adm-device-switcher">{['desktop', 'tablet', 'mobile'].map((value) => <button type="button" className={device === value ? 'active' : ''} onClick={() => setDevice(value)} key={value}>{value}</button>)}</div>
        <div className="adm-toolbar-actions"><span>{status}</span><button type="button" onClick={() => run(onSave, 'Saving')}>Save draft</button><button className="adm-primary" type="button" onClick={() => run(onPublish, 'Publishing')}>Publish</button><button type="button" onClick={onSignOut}>Sign out</button></div>
      </header>

      <div className="adm-workspace">
        <aside className="adm-layers">
          <div className="adm-sidebar-heading"><div><small>PAGE</small><h2>Home</h2></div><button type="button" onClick={() => setPanel('theme')}>Theme</button></div>
          <div className="adm-section-list">
            {sections.map((section, index) => (
              <div className={`adm-layer ${selectedId === section.id ? 'selected' : ''}`} draggable onDragStart={() => setDraggedId(section.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => moveSection(section.id)} key={section.id}>
                <button className="adm-layer-main" type="button" onClick={() => { setSelectedId(section.id); setPanel('section'); }}><span>{index + 1}</span><div><strong>{sectionNames[section.type]}</strong><small>{section.title || section.eyebrow || `${section.height}px`}</small></div></button>
                <div className="adm-layer-actions"><button type="button" onClick={() => duplicateSection(section.id)}>+</button><button type="button" onClick={() => removeSection(section.id)}>×</button></div>
              </div>
            ))}
          </div>
          <div className="adm-add-panel"><p>Add section</p><div>{Object.keys(sectionNames).map((type) => <button type="button" onClick={() => addSection(type)} key={type}>{sectionNames[type]}</button>)}</div></div>
        </aside>

        <main className="adm-canvas"><div className={`adm-preview-frame is-${device}`}><VisualPage content={content} preview /></div></main>

        <aside className="adm-inspector">
          <div className="adm-tabs"><button type="button" className={panel === 'section' ? 'active' : ''} onClick={() => setPanel('section')}>Section</button><button type="button" className={panel === 'theme' ? 'active' : ''} onClick={() => setPanel('theme')}>Design</button></div>
          {panel === 'section'
            ? <SectionInspector section={selected} onPatch={updateSelected} onLayout={(patch) => updateSelected({ layout: { ...selected.layout, ...patch } })} />
            : <ThemeInspector content={content} onTheme={(patch) => change((next) => { next.theme = { ...next.theme, ...patch }; })} onHeader={(patch) => change((next) => { next.header = { ...next.header, ...patch }; })} onSeo={(patch) => change((next) => { next.pages.home = { ...next.pages.home, ...patch }; })} />}
        </aside>
      </div>
    </div>
  );
}
