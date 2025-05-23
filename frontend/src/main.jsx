import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>            {/* ← ① Router envuelve todo */}
      <AuthProvider>           {/* ← ② AuthProvider DENTRO del Router */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
