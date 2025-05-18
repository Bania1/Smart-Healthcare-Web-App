// src/pages/MedicalRecordsPage.jsx
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

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const isDoctorOrAdmin = ['Doctor','Admin'].some(r => user.roles.includes(r));

  // state
  const [records, setRecords]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [patients, setPatients]     = useState([]);
  const [doctors,  setDoctors]      = useState([]);
  const [search,   setSearch]       = useState('');

  // server-side filters & pagination
  const [typeFilter,  setTypeFilter]  = useState('');
  const [dateFilter,  setDateFilter]  = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages]   = useState(1);

  // modals & form
  const [showAdd,   setShowAdd]   = useState(false);
  const [showEdit,  setShowEdit]  = useState(false);
  const [showDel,   setShowDel]   = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form, setForm] = useState({
    patient_id:'', doctor_id:'', date:'',
    time:'', type:'', diagnostic:'', treatment:''
  });

  // load users for dropdowns
  useEffect(() => {
    if (isDoctorOrAdmin) loadUsers();
  }, [isDoctorOrAdmin]);

  // load records only when page changes
  useEffect(() => {
    loadRecords();
  }, [currentPage]);

  async function loadRecords() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/medical-records', {
        params: {
          page: currentPage,
          size: itemsPerPage,
          type: typeFilter || undefined,
          date: dateFilter || undefined
        }
      });

      const fmt = data.records.map(r => {
        const pName = r.users_medical_records_patient_idTousers?.name || `#${r.patient_id}`;
        const dName = r.users_medical_records_doctor_idTousers?.name  || `#${r.doctor_id}`;
        const dateStr = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
        let timeStr = '';
        if (r.time) {
          const t = new Date(r.time);
          timeStr = `${String(t.getUTCHours()).padStart(2,'0')}:${String(t.getUTCMinutes()).padStart(2,'0')}`;
        }
        return {
          ...r,
          patient_name: pName,
          doctor_name:  dName,
          date: dateStr,
          time: timeStr
        };
      });

      setRecords(fmt);
      setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
    } catch (err) {
      console.error('Error fetching medical records:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    try {
      const { data: all } = await api.get('/api/users');
      setPatients(all.filter(u => u.roles?.includes('Patient')));
      setDoctors (all.filter(u => u.roles?.includes('Doctor')));
    } catch (err) {
      console.error('Error loading users:', err);
    }
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // ── ADD ──
  const openAdd = () => {
    setForm({ patient_id:'', doctor_id:'', date:'', time:'', type:'', diagnostic:'', treatment:'' });
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

  // client-side search
  const q = search.toLowerCase();
  const filtered = records.filter(r =>
    r.patient_name.toLowerCase().includes(q) ||
    r.doctor_name.toLowerCase().includes(q)  ||
    (r.diagnostic || '').toLowerCase().includes(q)
  );

  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Historial Médico</h2>

        {/* Filters */}
        <Form className="mb-3 d-flex gap-2 align-items-end">
          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              placeholder="p.ej. consulta"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={() => { setCurrentPage(1); loadRecords(); }}
          >
            Filtrar
          </Button>
        </Form>

        {/* New record button */}
        {isDoctorOrAdmin && (
          <Button variant="success" className="mb-3" onClick={openAdd}>
            + Nuevo Registro
          </Button>
        )}

        {/* Search */}
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por paciente, médico o diagnóstico…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>

        {/* Records table */}
        <Table className="table-custom" striped bordered hover responsive>
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
              {isDoctorOrAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.record_id}>
                <td>{r.record_id}</td>
                <td>{r.patient_name}</td>
                <td>{r.doctor_name}</td>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>{r.type}</td>
                <td>{r.diagnostic}</td>
                <td>{r.treatment}</td>
                {isDoctorOrAdmin && (
                  <td>
                    <Button size="sm" className="me-2" onClick={() => openEdit(r)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => openDel(r)}>
                      Borrar
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={isDoctorOrAdmin ? 9 : 8} className="text-center">
                  No hay resultados
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            />
            {Array.from({ length: totalPages }).map((_, i) => (
              <Pagination.Item
                key={i}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            />
          </Pagination>
        )}

        {/* ── MODAL ADD ── */}
        {isDoctorOrAdmin && (
          <Modal show={showAdd} onHide={() => setShowAdd(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Nuevo Historial</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* paciente */}
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
                {/* médico */}
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
                {/* fecha */}
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </Form.Group>
                {/* hora */}
                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                  />
                </Form.Group>
                {/* tipo */}
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  />
                </Form.Group>
                {/* diagnóstico */}
                <Form.Group className="mb-3">
                  <Form.Label>Diagnóstico</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="diagnostic"
                    value={form.diagnostic}
                    onChange={handleChange}
                  />
                </Form.Group>
                {/* tratamiento */}
                <Form.Group className="mb-3">
                  <Form.Label>Tratamiento</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
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
        )}

        {/* ── MODAL EDIT ── */}
        {isDoctorOrAdmin && (
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
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Diagnóstico</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="diagnostic"
                    value={form.diagnostic}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tratamiento</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="treatment"
                    value={form.treatment}
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
        )}

        {/* ── MODAL DELETE ── */}
        {isDoctorOrAdmin && (
          <Modal show={showDel} onHide={() => setShowDel(false)} centered>
            <Modal.Header closeButton className="bg-danger text-white">
              <Modal.Title>Confirmar Borrado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Seguro que deseas eliminar el registro #{currentRecord?.record_id}?
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
        )}
      </div>
    </div>
  );
}
