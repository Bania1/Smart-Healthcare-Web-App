// src/pages/AppointmentsPage.jsx
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

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Búsqueda y paginación
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados de modales
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [current, setCurrent] = useState(null);

  // Formulario
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    status: ''
  });

  // Carga inicial
  useEffect(() => {
    load();
  }, []);

  // Función para obtener y transformar citas
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/appointments');
      const transformed = data.map(a => {
        // date_time viene en ISO, ej: "2025-05-08T14:30:00.000Z"
        const [date, rest] = a.date_time.split('T');
        const time = rest?.slice(0, 5) || '';
        return {
          ...a,
          date,
          time,
          // Si tu back incluye relaciones:
          patient_name: a.users_appointments_patient_idTousers?.name || `#${a.patient_id}`,
          doctor_name:  a.users_appointments_doctor_idTousers?.name || `#${a.doctor_id}`
        };
      });
      setAppointments(transformed);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ─── ADD ───
  const openAdd = () => {
    setForm({ patient_id:'', doctor_id:'', date:'', time:'', status:'' });
    setShowAdd(true);
  };
  const submitAdd = async () => {
    try {
      await api.post('/api/appointments', {
        patient_id: Number(form.patient_id),
        doctor_id:  Number(form.doctor_id),
        date:       form.date,
        time:       form.time,
        status:     form.status
      });
      setShowAdd(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ─── EDIT ───
  const openEdit = appt => {
    setCurrent(appt);
    setForm({
      patient_id: appt.patient_id,
      doctor_id:  appt.doctor_id,
      date:       appt.date,
      time:       appt.time,
      status:     appt.status
    });
    setShowEdit(true);
  };
  const submitEdit = async () => {
    try {
      await api.put(`/api/appointments/${current.appointment_id}`, {
        patient_id: Number(form.patient_id),
        doctor_id:  Number(form.doctor_id),
        date:       form.date,
        time:       form.time,
        status:     form.status
      });
      setShowEdit(false);
      setCurrent(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ─── DELETE ───
  const openDel = appt => {
    setCurrent(appt);
    setShowDel(true);
  };
  const submitDel = async () => {
    try {
      await api.delete(`/api/appointments/${current.appointment_id}`);
      setShowDel(false);
      setCurrent(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  // Filtrado y paginación
  const filtered = appointments.filter(a =>
    a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
    a.status.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="container mt-4">
      <h2>Gestión de Citas</h2>
      <Button variant="success" className="mb-3" onClick={openAdd}>
        + Nueva Cita
      </Button>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar por paciente, médico o estado…"
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paged.map(a => (
            <tr key={a.appointment_id}>
              <td>{a.appointment_id}</td>
              <td>{a.patient_name}</td>
              <td>{a.doctor_name}</td>
              <td>{a.date}</td>
              <td>{a.time}</td>
              <td>{a.status}</td>
              <td>
                <Button
                  size="sm"
                  className="me-2"
                  onClick={() => openEdit(a)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => openDel(a)}
                >
                  Borrar
                </Button>
              </td>
            </tr>
          ))}
          {paged.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">No hay resultados</td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* ─── MODAL ADD ─── */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Paciente</Form.Label>
              <Form.Control
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID Médico</Form.Label>
              <Form.Control
                name="doctor_id"
                value={form.doctor_id}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                name="status"
                value={form.status}
                onChange={handleChange}
              />
            </Form.Group>
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

      {/* ─── MODAL EDIT ─── */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cita #{current?.appointment_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Paciente</Form.Label>
              <Form.Control
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID Médico</Form.Label>
              <Form.Control
                name="doctor_id"
                value={form.doctor_id}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                name="status"
                value={form.status}
                onChange={handleChange}
              />
            </Form.Group>
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

      {/* ─── MODAL DELETE ─── */}
      <Modal show={showDel} onHide={() => setShowDel(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Borrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas eliminar la cita #{current?.appointment_id}?
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
  );
}
