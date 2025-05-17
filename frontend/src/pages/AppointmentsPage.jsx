// src/pages/AppointmentsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
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
  const { user } = useAuth();
  const isDoctorOrAdmin = ['Doctor','Admin'].some(r => user.roles.includes(r));
  const isPatient = !isDoctorOrAdmin;

  // datos y estado
  const [appointments, setAppointments] = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [currentPage,  setCurrentPage]  = useState(1);
  const itemsPerPage = 10;

  // modal & formulario
  const [showAdd, setShowAdd]     = useState(false);
  const [showEdit, setShowEdit]   = useState(false);
  const [showDel, setShowDel]     = useState(false);
  const [current,  setCurrent]    = useState(null);
  const [form, setForm] = useState({
    patient_id:'', doctor_id:'', date:'', time:'', status:''
  });

  useEffect(() => {
    loadAppointments();
    loadDoctors();                    // ➞ siempre cargamos doctores
    if (isDoctorOrAdmin) loadPatients();  // ➞ pacientes solo para doctor/admin
  }, [isDoctorOrAdmin]);

  // 1) Traer citas
  async function loadAppointments() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/appointments');
      const mapped = data.map(a => {
        const [date, t] = a.date_time.split('T');
        const time = t?.slice(0,5) || '';
        return {
          ...a,
          date,
          time,
          patient_name: a.users_appointments_patient_idTousers?.name || `#${a.patient_id}`,
          doctor_name:  a.users_appointments_doctor_idTousers?.name  || `#${a.doctor_id}`
        };
      });
      setAppointments(mapped);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }

  // 2a) Traer lista de doctores (para el select), siempre
  async function loadDoctors() {
  try {
    // para paciente o doctor/admin, igual:
    // pedimos los primeros 10 doctores
    const { data } = await api.get('/api/users/search', {
      params: { role: 'Doctor', q: '' }
    });
    // data ya es un array de { user_id, name, dni }
    setDoctors(data);
  } catch (err) {
    console.error('Error loading doctors:', err);
  }
}

  // 2b) Traer lista de pacientes, solo si doctor/admin
  async function loadPatients() {
    try {
      const { data: all } = await api.get('/api/users');
      setPatients(all.filter(u => u.roles?.includes('Patient')));
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // ── ADD / PEDIR ──
  const openAdd = () => {
    setForm({
      // use user.user_id (from your AuthContext), not user.userId
      patient_id: isPatient ? user.user_id : '',
      doctor_id:  '',
      date:       '',
      time:       '',
      status:     ''
    });
    setShowAdd(true);
  };
  const submitAdd = async () => {
    try {
      await api.post('/api/appointments', {
       // again, pull from user.user_id
        patient_id: isPatient
          ? user.user_id
          : Number(form.patient_id),
        doctor_id:  Number(form.doctor_id),
        date:       form.date,
        time:       form.time,
        status:     form.status
      });
      setShowAdd(false);
      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ── EDIT ── (solo doctor/admin)
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
      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ── DELETE ── (solo doctor/admin)
  const openDel = appt => setCurrent(appt) || setShowDel(true);
  const submitDel = async () => {
    try {
      await api.delete(`/api/appointments/${current.appointment_id}`);
      setShowDel(false);
      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  // filtrado + paginación
  const filtered = appointments.filter(a =>
    a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor_name.toLowerCase().includes(search.toLowerCase())  ||
    a.status.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged      = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-4">
      <h2>Gestión de Citas</h2>

      {isPatient && (
        <Button variant="primary" className="mb-3" onClick={openAdd}>
          Pedir cita
        </Button>
      )}
      {isDoctorOrAdmin && (
        <Button variant="success" className="mb-3" onClick={openAdd}>
          + Nueva Cita
        </Button>
      )}

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
            {isDoctorOrAdmin && <th>Acciones</th>}
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
              {isDoctorOrAdmin && (
                <td>
                  <Button
                    size="sm"
                    onClick={() => openEdit(a)}
                    className="me-2"
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
              )}
            </tr>
          ))}
          {paged.length === 0 && (
            <tr>
              <td
                colSpan={isDoctorOrAdmin ? 7 : 6}
                className="text-center"
              >
                No hay resultados
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {Array.from({ length: totalPages }).map((_, i) => (
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

      {/* ── MODAL ADD / PEDIR ── */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isPatient ? 'Pedir cita' : 'Nueva Cita'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* para paciente: no necesita elegir paciente */}
            {isDoctorOrAdmin && (
              <Form.Group className="mb-3">
                <Form.Label>Paciente</Form.Label>
                <Form.Select
                  name="patient_id"
                  value={form.patient_id}
                  onChange={handleChange}
                >
                  <option value="">— selecciona paciente —</option>
                  {patients.map(p => (
                    <option key={p.user_id} value={p.user_id}>
                      {p.name} ({p.dni})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Médico</Form.Label>
              <Form.Select
                name="doctor_id"
                value={form.doctor_id}
                onChange={handleChange}
              >
                <option value="">— selecciona médico —</option>
                {doctors.map(d => (
                  <option key={d.user_id} value={d.user_id}>
                    {d.name} ({d.dni})
                  </option>
                ))}
              </Form.Select>
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
          <Button
            variant="secondary"
            onClick={() => setShowAdd(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={submitAdd}
          >
            {isPatient ? 'Pedir cita' : 'Crear'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── MODAL EDIT & DELETE (solo doctor/admin) ── */}
      {isDoctorOrAdmin && (
        <>
          <Modal show={showEdit} onHide={() => setShowEdit(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                Editar Cita #{current?.appointment_id}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Repite aquí los mismos <Form.Group> que en el modal de ADD */}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowEdit(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={submitEdit}
              >
                Guardar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showDel} onHide={() => setShowDel(false)} centered>
            <Modal.Header
              closeButton
              className="bg-danger text-white"
            >
              <Modal.Title>Confirmar Borrado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Seguro que deseas eliminar la cita #{current?.appointment_id}?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="light"
                onClick={() => setShowDel(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={submitDel}
              >
                Borrar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
}
