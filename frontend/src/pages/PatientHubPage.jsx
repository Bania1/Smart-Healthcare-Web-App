import React from 'react';

export default function PatientHub() {
  return (
    <div className="container mt-4">
      <h2>Bienvenido, Paciente</h2>
      <p>Desde aquí puedes ver tus citas y tu historial médico.</p>
      <ul>
        <li><a href="/appointments">Mis citas</a></li>
        <li><a href="/medical-records">Mi historial médico</a></li>
      </ul>
    </div>
  );
}
