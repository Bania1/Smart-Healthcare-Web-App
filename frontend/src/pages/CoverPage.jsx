import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function CoverPage() {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div
      className="page-container d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="page-card text-center" style={{ maxWidth: 400, width: '100%' }}>
        <h1 className="mb-4">Smart Healthcare</h1>
        <p className="mb-4">Bienvenido a nuestra plataforma médica</p>
        <div className="d-flex justify-content-center">
          <Link to="/login" className="btn btn-primary me-2">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
