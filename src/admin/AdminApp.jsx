import React, { useEffect, useState } from 'react';
import AdminEditor from './AdminEditor.jsx';
import { cloneContent, defaultSiteContent } from '../visual-builder/defaultContent.js';
import {
  loadDraftContent,
  publishSiteContent,
  saveDraftContent,
} from '../visual-builder/localContentStore.js';
import './admin.css';

export default function AdminApp() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    loadDraftContent()
      .then((draft) => {
        if (active) setContent(draft || cloneContent(defaultSiteContent));
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
          setContent(cloneContent(defaultSiteContent));
        }
      });

    return () => { active = false; };
  }, []);

  if (!content) {
    return <main className="adm-gate"><div className="adm-loading">Editör hazırlanıyor…</div></main>;
  }

  return (
    <>
      {error && <div className="adm-error" role="alert">{error}</div>}
      <AdminEditor
        initialContent={content}
        onSave={saveDraftContent}
        onPublish={publishSiteContent}
        onSignOut={() => { window.location.href = '/'; }}
      />
    </>
  );
}
