import React, { useEffect, useState } from 'react';
import VisualPage from './VisualPage.jsx';
import { isFirebaseConfigured, loadPublishedContent } from './firebaseContentStore.js';

export default function PublishedHome({ fallback }) {
  const [content, setContent] = useState(null);
  const [checked, setChecked] = useState(!isFirebaseConfigured());

  useEffect(() => {
    if (!isFirebaseConfigured()) return undefined;
    let active = true;
    loadPublishedContent()
      .then((published) => {
        if (active) setContent(published || null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setChecked(true);
      });
    return () => { active = false; };
  }, []);

  if (!checked || !content) return fallback;
  return <VisualPage content={content} />;
}
