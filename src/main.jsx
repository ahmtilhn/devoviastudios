import './ui/canonical-route-redirect-v12.js';
import './ui/english-only.js';
import './ui/performance-v6.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';
import DevoviaHome from './redesign/DevoviaHome.jsx';
import './styles.css';
import './product-hub.css';
import './safety.css';
import './studio-motion.css';
import './ui/system.css';
import './ui/native-web-engine.css';
import './ui/experience-v6.css';
import './ui/product-experience-v7.css';
import './ui/shared-transitions-v6.css';
import './ui/performance-v6.css';
import './ui/premium-motion-v8.css';
import './ui/motion-system-v10.css';
import './ui/motion-system-v10-hardening.css';
import './ui/enhancer.js';
import './ui/product-story-engine.js';
import './ui/link-normalizer-v6.js';
import './ui/interaction-integrity-v9.js';
import './ui/shared-transitions-v6.js';
import './ui/native-web-engine.js';
import './ui/brand-language-v8.js';
import './ui/brand-meta-v8.js';
import './ui/ux-copy-v8.js';
import './ui/motion-system-v10.js';
import './ui/motion-system-v10-compat.js';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const page = path === '/admin'
  ? <AdminApp />
  : path === '/'
    ? <DevoviaHome />
    : <App />;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>{page}</React.StrictMode>,
);
