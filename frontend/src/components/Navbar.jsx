// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  // Si no hay usuario, no mostramos nada
  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Marca siempre al hub authenticated */}
        <Link className="navbar-brand" to="/home">SmartHC</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            {/* Inicio al hub, no a la portada */}
            <li className="nav-item">
              <Link className="nav-link" to="/home">Inicio</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/users">Usuarios</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/appointments">Citas</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/medical-records">Historiales</Link>
            </li>

            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                onClick={logout}
              >
                Salir
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
