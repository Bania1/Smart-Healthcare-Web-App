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

  // Búsqueda y paginación
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modales y record actual
  const [showAdd, setShowAdd]     = useState(false);
  const [showEdit, setShowEdit]   = useState(false);
  const [showDel, setShowDel]     = useState(false);
  const [current, setCurrent]     = useState(null);

  // Formulario
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id:  '',
    type:       '',       // ← Nuevo campo type
    date:       '',
    diagnostic:'',
    treatment:  ''
  });

  // Carga inicial
  useEffect(() => {
    load();
  }, []);

  // Obtiene y transforma los registros
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/medical-records');
      // Si tu back devuelve date_time, lo partes en date+hora, si sólo date, úsalo directamente:
      const transformed = data.map(r => ({
        ...r,
        date: r.date_time?.split('T')[0] || r.date, 
        patient_name: r.users_medical_records_patient_idTousers?.name || `#${r.patient_id}`,
        doctor_name:  r.users_medical_records_doctor_idTousers?.name  || `#${r.doctor_id}`,
      }));
      setRecords(transformed);
    } catch (err) {
      console.error('Error fetching medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // ─── ADD ───
  const openAdd = () => {
    setForm({ patient_id:'', doctor_id:'', type:'', date:'', diagnostic:'', treatment:'' });
    setShowAdd(true);
  };
  const submitAdd = async () => {
    try {
      await api.post('/api/medical-records', {
        patient_id:  Number(form.patient_id),
        doctor_id:   Number(form.doctor_id),
        type:        form.type,
        date:        form.date,
        diagnostic:  form.diagnostic,
        treatment:   form.treatment
      });
      setShowAdd(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ─── EDIT ───
  const openEdit = rec => {
    setCurrent(rec);
    setForm({
      patient_id: rec.patient_id,
      doctor_id:  rec.doctor_id,
      type:       rec.type,
      date:       rec.date,
      diagnostic:rec.diagnostic,
      treatment:  rec.treatment
    });
    setShowEdit(true);
  };
  const submitEdit = async () => {
    try {
      await api.put(`/api/medical-records/${current.medical_record_id}`, {
        patient_id:  Number(form.patient_id),
        doctor_id:   Number(form.doctor_id),
        type:        form.type,
        date:        form.date,
        diagnostic:  form.diagnostic,
        treatment:   form.treatment
      });
      setShowEdit(false);
      setCurrent(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ─── DELETE ───
  const openDel = rec => {
    setCurrent(rec);
    setShowDel(true);
  };
  const submitDel = async () => {
    try {
      await api.delete(`/api/medical-records/${current.medical_record_id}`);
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

  // Filtrado + paginación
  const filtered = records.filter(r =>
    r.patient_name.toLowerCase().includes(search.toLowerCase()) ||
    r.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnostic.toLowerCase().includes(search.toLowerCase())
  );
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
          placeholder="Buscar por paciente, médico, tipo o diagnóstico…"
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
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Diagnóstico</th>
            <th>Tratamiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paged.map(r => (
            <tr key={r.medical_record_id}>
              <td>{r.medical_record_id}</td>
              <td>{r.patient_name}</td>
              <td>{r.doctor_name}</td>
              <td>{r.type}</td>
              <td>{r.date}</td>
              <td>{r.diagnostic}</td>
              <td>{r.treatment}</td>
              <td>
                <Button
                  size="sm"
                  className="me-2"
                  onClick={() => openEdit(r)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => openDel(r)}
                >
                  Borrar
                </Button>
              </td>
            </tr>
          ))}
          {paged.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">No hay resultados</td>
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

      {/* ───── MODAL CREAR ───── */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Registro</Modal.Title>
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
              <Form.Label>Tipo de Registro</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="">-- selecciona uno --</option>
                <option value="Checkup">Checkup</option>
                <option value="Surgery">Cirugía</option>
                <option value="Consultation">Consulta</option>
              </Form.Control>
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
              <Form.Label>Diagnóstico</Form.Label>
              <Form.Control
                name="diagnostic"
                value={form.diagnostic}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tratamiento</Form.Label>
              <Form.Control
                name="treatment"
                value={form.treatment}
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

      {/* ───── MODAL EDITAR ───── */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Registro #{current?.medical_record_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['patient_id','doctor_id','type','date','diagnostic','treatment'].map(name => {
              const label = {
                patient_id: 'ID Paciente',
                doctor_id:  'ID Médico',
                type:       'Tipo',
                date:       'Fecha',
                diagnostic:'Diagnóstico',
                treatment:  'Tratamiento'
              }[name];
              const props = name==='date'
                ? { type: 'date' }
                : name==='type'
                ? { as: 'select', children: (
                    <>
                      <option value="">--</option>
                      <option value="Checkup">Checkup</option>
                      <option value="Surgery">Cirugía</option>
                      <option value="Consultation">Consulta</option>
                    </>
                  )}
                : {};
              return (
                <Form.Group className="mb-3" key={name}>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    {...props}
                  />
                </Form.Group>
              );
            })}
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

      {/* ───── MODAL BORRAR ───── */}
      <Modal show={showDel} onHide={() => setShowDel(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Borrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas eliminar el registro #{current?.medical_record_id}?
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
