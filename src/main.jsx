import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';
import DevoviaHome from './redesign/DevoviaHome.jsx';
import './styles.css';
import './product-hub.css';
import './safety.css';
import './studio-motion.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const page = path === '/admin'
  ? <AdminApp />
  : path === '/'
    ? <DevoviaHome />
    : <App />;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>{page}</React.StrictMode>,
);
