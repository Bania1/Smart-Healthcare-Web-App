// src/pages/CoverPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function CoverPage() {
  return (
    <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
      <h1 className="display-4 mb-4">Smart Healthcare</h1>
      <p className="lead mb-5">Tu plataforma de gestión médica</p>
      <div>
        <Link to="/login" className="btn btn-primary btn-lg me-3">
          Iniciar sesión
        </Link>
        <Link to="/register" className="btn btn-outline-primary btn-lg">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
