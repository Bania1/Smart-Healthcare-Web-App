import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Para búsqueda y paginación
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api.get('/api/users')
      .then(({ data }) => setUsers(data))
      .catch(err => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando usuarios…</p>;

  // 1) Filtrar según búsqueda (nombre, DNI o email)
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.dni.includes(search) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // 2) Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="container mt-4">
      <h2>Listado de Usuarios</h2>

      {/* Barra de búsqueda */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, DNI o email…"
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
              <th>ID</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(u => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.dni}</td>
                <td>{u.email}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan="4" className="text-center">No hay resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <nav aria-label="Paginación usuarios">
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
