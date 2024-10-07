// After (React 18)
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';

const root = createRoot(document.getElementById('root')); // Create a root
root.render(<App />); // Render the App
