// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  if (!user) return null;

  const isDoctor  = user.roles.includes('Doctor');
  const isPatient = user.roles.includes('Patient');
  const isAdmin   = user.roles.includes('Admin');

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          SmartHC
        </Link>

        {/* 1) Botón toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* 2) Collapse wrapper con id */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isDoctor && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/doctor">
                    Inicio Doctor
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/appointments">
                    Citas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/medical-records">
                    Historiales
                  </NavLink>
                </li>
              </>
            )}
            {isPatient && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/patient">
                    Inicio Paciente
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/appointments">
                    Mis Citas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/medical-records">
                    Mi Historial
                  </NavLink>
                </li>
              </>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">
                  Usuarios
                </NavLink>
              </li>
            )}
          </ul>

          {/* 3) Botón Salir siempre visible */}
          <button
            className="btn btn-outline-secondary"
            onClick={logout}
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
