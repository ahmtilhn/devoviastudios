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

function SetupRequired() {
  return (
    <main className="adm-gate">
      <section className="adm-card">
        <img src="/devovia-logo.png" alt="" />
        <p className="adm-kicker">DEVOVIA CONTROL ROOM</p>
        <h1>Secure setup required</h1>
        <p>The admin editor is installed, but Firebase Authentication and Firestore settings are not present in the GitHub Pages build yet.</p>
        <a href="/">Back to website</a>
      </section>
    </main>
  );
}

function Login({ busy, error, onLogin }) {
  const [email, setEmail] = useState(ownerEmail);
  const [password, setPassword] = useState('');

  return (
    <main className="adm-gate">
      <form className="adm-card" onSubmit={(event) => {
        event.preventDefault();
        onLogin(email, password);
      }}>
        <img src="/devovia-logo.png" alt="" />
        <p className="adm-kicker">DEVOVIA CONTROL ROOM</p>
        <h1>Owner sign in</h1>
        <p>Only the verified owner account can open the editor and publish changes.</p>
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
        {error && <div className="adm-error" role="alert">{error}</div>}
        <button className="adm-primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a href="/">Back to website</a>
      </form>
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

  if (state === 'setup') return <SetupRequired />;
  if (state === 'checking') return <main className="adm-gate"><div className="adm-loading">Checking owner session…</div></main>;
  if (state === 'login') {
    return <Login busy={busy} error={error} onLogin={async (email, password) => {
      setBusy(true);
      setError('');
      try { await signInAdmin(email, password); }
      catch (loginError) { setError(loginError.message); }
      finally { setBusy(false); }
    }} />;
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
