import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  if (!user) return null;  // ocultar si no hay sesión

  const links = [
    { to: '/home', label: 'Inicio' },
    { to: '/users', label: 'Usuarios' },
    { to: '/appointments', label: 'Citas' },
    { to: '/medical-records', label: 'Historiales' }
  ];

  const isDoctor  = user.roles.includes('Doctor');
  const isPatient = user.roles.includes('Patient');
  const isAdmin   = user.roles.includes('Admin');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          SmartHC
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {isDoctor && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctor">Inicio Doctor</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/appointments">Citas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/medical-records">Historiales</Link>
                </li>
              </>
            )}
            {isPatient && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/patient">Inicio Paciente</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/appointments">Mis Citas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/medical-records">Mi Historial</Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/users">Usuarios</Link>
              </li>
            )}
          </ul>
          <button className="btn btn-outline-secondary" onClick={logout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
