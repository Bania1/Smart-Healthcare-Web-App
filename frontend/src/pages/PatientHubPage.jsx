// src/pages/PatientHubPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { FaCalendarAlt, FaNotesMedical } from 'react-icons/fa';

export default function PatientHub() {
  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Bienvenido, Paciente</h2>
        <p>Desde aquí puedes ver tus citas y tu historial médico.</p>

        <div className="d-flex gap-3 mt-4">
          <Card
            as={Link}
            to="/appointments"
            className="action-card text-white text-decoration-none"
          >
            <Card.Body className="d-flex flex-column align-items-center py-4">
              <FaCalendarAlt size={32} className="mb-2" />
              <span>Mis citas</span>
            </Card.Body>
          </Card>

          <Card
            as={Link}
            to="/medical-records"
            className="action-card text-white text-decoration-none"
          >
            <Card.Body className="d-flex flex-column align-items-center py-4">
              <FaNotesMedical size={32} className="mb-2" />
              <span>Mi historial médico</span>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
