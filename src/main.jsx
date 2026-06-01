import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './product-hub.css';
import './safety.css';
import './studio-motion.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
