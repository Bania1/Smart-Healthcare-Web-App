import React from 'react';

export default function DoctorHub() {
  return (
    <div className="container mt-4">
      <h2>Bienvenido, Doctor</h2>
      <p>Desde aquí puedes gestionar tus citas, revisar historiales, etc.</p>
      {/* Por ejemplo: */}
      <ul>
        <li><a href="/appointments">Ver todas las citas</a></li>
        <li><a href="/medical-records">Ver historiales médicos</a></li>
      </ul>
    </div>
  );
}
