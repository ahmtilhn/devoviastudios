import React, { useEffect, useState } from 'react';
import VisualPage from './VisualPage.jsx';
import { loadPublishedContent } from './localContentStore.js';

export default function PublishedHome({ fallback }) {
  const [content, setContent] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
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
