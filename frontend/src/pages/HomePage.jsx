// src/pages/HomePage.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const cards = [
    { title: 'Usuarios',       subtitle: 'Gestiona tus usuarios',       path: '/users' },
    { title: 'Citas',          subtitle: 'Agenda y consulta citas',     path: '/appointments' },
    { title: 'Historiales',    subtitle: 'Ver historiales médicos',     path: '/medical-records' },
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Bienvenido, {user?.name}</h1>
      <div className="row">
        {cards.map(card => (
          <div className="col-md-4 mb-4" key={card.path}>
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(card.path)}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text flex-grow-1">{card.subtitle}</p>
                <button className="btn btn-primary mt-auto">
                  Ir a {card.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
