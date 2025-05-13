// src/pages/CoverPage.jsx
import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function CoverPage() {
  const { user } = useContext(AuthContext);

  // Si ya estamos autenticados, redirige al hub
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="mb-4">Smart Healthcare</h1>
      <p className="mb-4">Bienvenido a nuestra plataforma médica</p>
      <div>
        <Link to="/login" className="btn btn-primary me-2">
          Iniciar Sesión
        </Link>
        <Link to="/register" className="btn btn-secondary">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
