// src/pages/MedicalRecordsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Búsqueda y paginación
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api.get('/api/medical-records')
      .then(({ data }) => setRecords(data))
      .catch(err => console.error('Error fetching medical records:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando historiales médicos…</p>;

  // Filtrar por ID de registro, ID de usuario o parte del diagnóstico/nota
  const filtered = records.filter(r =>
    r.record_id.toString().includes(search) ||
    r.user_id.toString().includes(search) ||
    (r.notes || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="container mt-4">
      <h2>Historial Médico</h2>

      {/* Búsqueda */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por ID registro, usuario o nota…"
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
              <th>ID Registro</th>
              <th>ID Usuario</th>
              <th>Fecha</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(r => (
              <tr key={r.record_id}>
                <td>{r.record_id}</td>
                <td>{r.user_id}</td>
                <td>{new Date(r.record_date).toLocaleDateString()}</td>
                <td>{r.notes}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <nav aria-label="Paginación historiales médicos">
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
