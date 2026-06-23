import React, { useEffect, useState } from 'react';
import AdminEditor from './AdminEditor.jsx';
import { cloneContent, defaultSiteContent } from '../visual-builder/defaultContent.js';
import {
  isFirebaseConfigured,
  loadDraftContent,
  observeAdminUser,
  ownerEmail,
  publishSiteContent,
  saveDraftContent,
  signInAdmin,
  signOutAdmin,
} from '../visual-builder/firebaseContentStore.js';
import './admin.css';

function AccessCard({ title, children, error, action, busy }) {
  return (
    <main className="adm-gate">
      <section className="adm-card">
        <img src="/devovia-logo.png" alt="" />
        <p className="adm-kicker">DEVOVIA CONTROL ROOM</p>
        <h1>{title}</h1>
        {children}
        {error && <div className="adm-error" role="alert">{error}</div>}
        {action && <button className="adm-primary" type="button" disabled={busy} onClick={action}>{busy ? 'Opening Google…' : 'Continue with Google'}</button>}
        <a href="/">Back to website</a>
      </section>
    </main>
  );
}

export default function AdminApp() {
  const [state, setState] = useState(isFirebaseConfigured() ? 'checking' : 'setup');
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return undefined;

    let unsubscribe;
    observeAdminUser(async (user, authError) => {
      setError(authError || '');
      if (!user) {
        setState('login');
        return;
      }

      try {
        const draft = await loadDraftContent();
        setContent(draft || cloneContent(defaultSiteContent));
        setState('ready');
      } catch (loadError) {
        setError(loadError.message);
        setState('login');
      }
    }).then((stop) => { unsubscribe = stop; }).catch((authError) => {
      setError(authError.message);
      setState('login');
    });

    return () => unsubscribe?.();
  }, []);

  if (state === 'setup') {
    return (
      <AccessCard title="Secure setup required">
        <p>The editor is installed, but Firebase Authentication and Firestore settings are not present in the GitHub Pages build yet.</p>
      </AccessCard>
    );
  }

  if (state === 'checking') {
    return <main className="adm-gate"><div className="adm-loading">Checking owner session…</div></main>;
  }

  if (state === 'login') {
    return (
      <AccessCard
        title="Owner access"
        error={error}
        busy={busy}
        action={async () => {
          setBusy(true);
          setError('');
          try { await signInAdmin(); }
          catch (loginError) { setError(loginError.message); }
          finally { setBusy(false); }
        }}
      >
        <p>Continue with the authorized Google account: <strong>{ownerEmail}</strong>.</p>
      </AccessCard>
    );
  }

  return (
    <AdminEditor
      initialContent={content}
      onSave={saveDraftContent}
      onPublish={publishSiteContent}
      onSignOut={signOutAdmin}
    />
  );
}
