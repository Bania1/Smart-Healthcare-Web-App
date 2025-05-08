// src/pages/MedicalRecordsPage.jsx
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

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors]   = useState([]);

  // búsqueda, paginación
  const [search, setSearch]         = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // modales y formulario
  const [showAdd, setShowAdd]           = useState(false);
  const [showEdit, setShowEdit]         = useState(false);
  const [showDel, setShowDel]           = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    type: '',
    diagnostic: '',
    treatment: ''
  });

  useEffect(() => {
    loadRecords();
    loadUsers();
  }, []);

  // 1) cargar historiales
  const loadRecords = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/medical-records');
      const formatted = data.map(r => {
        const patientName = r.users_medical_records_patient_idTousers?.name || `#${r.patient_id}`;
        const doctorName  = r.users_medical_records_doctor_idTousers?.name  || `#${r.doctor_id}`;
        // fecha YYYY-MM-DD
        const dateStr = r.date
          ? new Date(r.date).toISOString().split('T')[0]
          : '';
        // hora HH:MM
        let timeStr = '';
        if (r.time) {
          const t = new Date(r.time);
          const hh = String(t.getUTCHours()).padStart(2,'0');
          const mm = String(t.getUTCMinutes()).padStart(2,'0');
          timeStr = `${hh}:${mm}`;
        }
        return {
          ...r,
          patient_name: patientName,
          doctor_name:  doctorName,
          date:  dateStr,
          time:  timeStr
        };
      });
      setRecords(formatted);
    } catch (err) {
      console.error('Error fetching medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2) cargar pacientes y doctores
  const loadUsers = async () => {
    try {
      const { data: all } = await api.get('/api/users');
      setPatients(all.filter(u => u.roles?.includes('Patient')));
      setDoctors (all.filter(u => u.roles?.includes('Doctor')));
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ── ADD ──
  const openAdd = () => {
    setForm({
      patient_id: '',
      doctor_id: '',
      date: '',
      time: '',
      type: '',
      diagnostic: '',
      treatment: ''
    });
    setShowAdd(true);
  };
  const submitAdd = async () => {
    try {
      await api.post('/api/medical-records', {
        patient_id: Number(form.patient_id),
        doctor_id:  Number(form.doctor_id),
        date:       form.date,
        time:       form.time,
        type:       form.type,
        diagnostic: form.diagnostic,
        treatment:  form.treatment
      });
      setShowAdd(false);
      loadRecords();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ── EDIT ──
  const openEdit = r => {
    setCurrentRecord(r);
    setForm({
      patient_id: r.patient_id,
      doctor_id:  r.doctor_id,
      date:       r.date,
      time:       r.time,
      type:       r.type,
      diagnostic: r.diagnostic || '',
      treatment:  r.treatment  || ''
    });
    setShowEdit(true);
  };
  const submitEdit = async () => {
    try {
      await api.put(`/api/medical-records/${currentRecord.record_id}`, {
        patient_id: Number(form.patient_id),
        doctor_id:  Number(form.doctor_id),
        date:       form.date,
        time:       form.time,
        type:       form.type,
        diagnostic: form.diagnostic,
        treatment:  form.treatment
      });
      setShowEdit(false);
      setCurrentRecord(null);
      loadRecords();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ── DELETE ──
  const openDel = r => {
    setCurrentRecord(r);
    setShowDel(true);
  };
  const submitDel = async () => {
    try {
      await api.delete(`/api/medical-records/${currentRecord.record_id}`);
      setShowDel(false);
      setCurrentRecord(null);
      loadRecords();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  // filtrado
  const q = search.toLowerCase();
  const filtered = records.filter(r =>
    r.patient_name.toLowerCase().includes(q) ||
    r.doctor_name.toLowerCase().includes(q)  ||
    (r.diagnostic || '').toLowerCase().includes(q)
  );

  // paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="container mt-4">
      <h2>Historial Médico</h2>
      <Button variant="success" className="mb-3" onClick={openAdd}>
        + Nuevo Registro
      </Button>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar por paciente, médico o diagnóstico…"
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
            <th>Tipo</th>
            <th>Diagnóstico</th>
            <th>Tratamiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paged.map(r => (
            <tr key={r.record_id}>
              <td>{r.record_id}</td>
              <td>{r.patient_name}</td>
              <td>{r.doctor_name}</td>
              <td>{r.date}</td>
              <td>{r.time}</td>
              <td>{r.type}</td>
              <td>{r.diagnostic}</td>
              <td>{r.treatment}</td>
              <td>
                <Button size="sm" className="me-2" onClick={() => openEdit(r)}>
                  Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => openDel(r)}>
                  Borrar
                </Button>
              </td>
            </tr>
          ))}
          {paged.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">No hay resultados</td>
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

      {/* ── MODAL ADD ── */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Historial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
              <Form.Control type="date" name="date" value={form.date} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Control type="time" name="time" value={form.time} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control name="type" value={form.type} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diagnóstico</Form.Label>
              <Form.Control
                as="textarea"
                name="diagnostic"
                rows={2}
                value={form.diagnostic}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tratamiento</Form.Label>
              <Form.Control
                as="textarea"
                name="treatment"
                rows={2}
                value={form.treatment}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancelar</Button>
          <Button variant="success" onClick={submitAdd}>Crear</Button>
        </Modal.Footer>
      </Modal>

      {/* ── MODAL EDIT ── */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Historial #{currentRecord?.record_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
              <Form.Control type="date" name="date" value={form.date} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Control type="time" name="time" value={form.time} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control name="type" value={form.type} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diagnóstico</Form.Label>
              <Form.Control
                as="textarea"
                name="diagnostic"
                rows={2}
                value={form.diagnostic}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tratamiento</Form.Label>
              <Form.Control
                as="textarea"
                name="treatment"
                rows={2}
                value={form.treatment}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancelar</Button>
          <Button variant="primary" onClick={submitEdit}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* ── MODAL DELETE ── */}
      <Modal show={showDel} onHide={() => setShowDel(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas eliminar el historial #{currentRecord?.record_id}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDel(false)}>Cancelar</Button>
          <Button variant="danger" onClick={submitDel}>Borrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
