import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Para búsqueda y paginación
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api.get('/api/appointments')
      .then(({ data }) => setAppointments(data))
      .catch(err => console.error('Error fetching appointments:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando citas…</p>;

  // Filtrar por ID cita, ID usuario o estado
  const filtered = appointments.filter(a =>
    a.appointment_id.toString().includes(search) ||
    a.user_id.toString().includes(search) ||
    a.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="container mt-4">
      <h2>Listado de Citas</h2>

      {/* Búsqueda */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por ID cita, usuario o estado…"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>ID Cita</th>
              <th>ID Usuario</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(a => (
              <tr key={a.appointment_id}>
                <td>{a.appointment_id}</td>
                <td>{a.user_id}</td>
                <td>{new Date(a.date).toLocaleString()}</td>
                <td>{a.status}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan="4" className="text-center">No hay resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <nav aria-label="Paginación citas">
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item${currentPage === i + 1 ? ' active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
