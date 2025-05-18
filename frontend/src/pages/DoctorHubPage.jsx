// src/pages/DoctorHubPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { FaCalendarCheck, FaFileMedicalAlt } from 'react-icons/fa';

export default function DoctorHub() {
  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Bienvenido, Doctor</h2>
        <p>Desde aquí puedes gestionar tus citas, revisar historiales, etc.</p>

        <div className="d-flex gap-3 mt-4">
          <Card
            as={Link}
            to="/appointments"
            className="action-card text-white text-decoration-none"
          >
            <Card.Body className="d-flex flex-column align-items-center py-4">
              <FaCalendarCheck size={32} className="mb-2" />
              <span>Ver todas las citas</span>
            </Card.Body>
          </Card>

          <Card
            as={Link}
            to="/medical-records"
            className="action-card text-white text-decoration-none"
          >
            <Card.Body className="d-flex flex-column align-items-center py-4">
              <FaFileMedicalAlt size={32} className="mb-2" />
              <span>Ver historiales médicos</span>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
