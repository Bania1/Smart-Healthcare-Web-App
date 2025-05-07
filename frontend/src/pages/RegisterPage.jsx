// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    role: 'patient',
    specialty: '',
    availability: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      // Llamada única al backend que ya crea users, details y roles
      await api.post('/api/auth/register', {
        name: `${form.firstName} ${form.lastName}`,
        dni: form.dni,
        email: form.email,
        password: form.password,
        role: form.role,
        date_of_birth: form.dateOfBirth || null,
        contact_info: form.phone || null,
        specialty: form.role === 'doctor' ? form.specialty : undefined,
        availability: form.role === 'doctor' ? form.availability : undefined
      });
      // Redirige al login
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Error en el registro');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 540 }}>
      <h2 className="mb-4">Registro de Usuario</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Tipo de usuario */}
        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <select
            className="form-select"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="patient">Paciente</option>
            <option value="doctor">Médico</option>
          </select>
        </div>

        {/* Nombre y apellidos */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* DNI */}
        <div className="mb-3">
          <label className="form-label">DNI</label>
          <input
            type="text"
            className="form-control"
            name="dni"
            value={form.dni}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contraseña */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Teléfono */}
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* Fecha de nacimiento */}
        <div className="mb-3">
          <label className="form-label">Fecha de nacimiento</label>
          <input
            type="date"
            className="form-control"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        {/* Campos extra para médicos */}
        {form.role === 'doctor' && (
          <>
            <div className="mb-3">
              <label className="form-label">Especialidad</label>
              <input
                type="text"
                className="form-control"
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Disponibilidad</label>
              <input
                type="text"
                className="form-control"
                name="availability"
                value={form.availability}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Registrarse
        </button>
      </form>

      <p className="mt-3 text-center">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
