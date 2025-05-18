// src/pages/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  InputGroup,
  FormControl,
  Pagination
} from 'react-bootstrap';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Búsqueda y paginación
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modales: añadir, editar, borrar
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel] = useState(false);

  // Usuario actual para editar/borrar
  const [current, setCurrent] = useState(null);

  // Formulario (add/edit)
  const [form, setForm] = useState({ name: '', dni: '', email: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    api.get('/api/users')
      .then(({ data }) => setUsers(data))
      .catch(err => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // ── CREATE ──
  const openAdd = () => {
    setForm({ name: '', dni: '', email: '' });
    setShowAdd(true);
  };
  const submitAdd = () => {
    api.post('/api/users', form)
      .then(() => {
        setShowAdd(false);
        loadUsers();
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  // ── EDIT ──
  const openEdit = user => {
    setCurrent(user);
    setForm({ name: user.name, dni: user.dni, email: user.email });
    setShowEdit(true);
  };
  const submitEdit = () => {
    api.put(`/api/users/${current.user_id}`, form)
      .then(() => {
        setShowEdit(false);
        loadUsers();
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  // ── DELETE ──
  const openDel = user => {
    setCurrent(user);
    setShowDel(true);
  };
  const submitDel = () => {
    api.delete(`/api/users/${current.user_id}`)
      .then(() => {
        setShowDel(false);
        loadUsers();
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  // Filtrar
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.dni.includes(search) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Listado de Usuarios</h2>

        {/* Botón +Modal Añadir */}
        <Button variant="success" className="mb-3" onClick={openAdd}>
          + Nuevo Usuario
        </Button>

        {/* Búsqueda */}
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por nombre, DNI o email…"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>

        {/* Tabla */}
        <Table className="table-custom" striped bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(u => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.dni}</td>
                <td>{u.email}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-2"
                    onClick={() => openEdit(u)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => openDel(u)}
                  >
                    Borrar
                  </Button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay resultados
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Paginación */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            />
            {Array.from({ length: totalPages }).map((_, idx) => (
              <Pagination.Item
                key={idx}
                active={currentPage === idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            />
          </Pagination>
        )}

        {/* ─── MODAL AÑADIR ─── */}
        <Modal show={showAdd} onHide={() => setShowAdd(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Nuevo Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {['name', 'dni', 'email'].map(field => (
                <Form.Group className="mb-3" key={field}>
                  <Form.Label>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Cancelar
            </Button>
            <Button variant="success" onClick={submitAdd}>
              Crear
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ─── MODAL EDITAR ─── */}
        <Modal show={showEdit} onHide={() => setShowEdit(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuario #{current?.user_id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {['name', 'dni', 'email'].map(field => (
                <Form.Group className="mb-3" key={field}>
                  <Form.Label>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={submitEdit}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ─── MODAL BORRAR ─── */}
        <Modal show={showDel} onHide={() => setShowDel(false)} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>Confirmar borrado</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Seguro que quieres borrar <strong>#{current?.user_id} {current?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowDel(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={submitDel}>
              Borrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
