/* src/pages/RegisterPage.jsx */
import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../auth/AuthContext';

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
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
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      // Registro de usuario
      const { data: registerData } = await api.post('/api/auth/register', {
        name: `${form.firstName} ${form.lastName}`,
        dni: form.dni,
        email: form.email,
        password: form.password
      });
      const userId = registerData.user.user_id;

      // Crear detalles del usuario
      const detailsPayload = {
        user_id: userId,
        date_of_birth: form.dateOfBirth || null,
        contact_info: form.phone || null
      };
      if (form.role === 'doctor') {
        detailsPayload.specialty = form.specialty || null;
        detailsPayload.availability = form.availability || null;
      }
      await api.post('/api/users-details', detailsPayload);

      // Asignar rol de médico si corresponde
      if (form.role === 'doctor') {
        await api.post('/api/user-roles', {
          user_id: userId,
          role_id: 2
        });
      }

      // Login automático
      await login({ dni: form.dni, password: form.password });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error en el registro');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2>Registro de Usuario</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Tipo de usuario */}
        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <select name="role" className="form-select" value={form.role} onChange={handleChange}>
            <option value="patient">Paciente</option>
            <option value="doctor">Médico</option>
          </select>
        </div>

        {/* Nombre y Apellidos */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" name="firstName" className="form-control" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Apellidos</label>
            <input type="text" name="lastName" className="form-control" value={form.lastName} onChange={handleChange} required />
          </div>
        </div>

        {/* DNI */}
        <div className="mb-3">
          <label className="form-label">DNI</label>
          <input type="text" name="dni" className="form-control" value={form.dni} onChange={handleChange} required />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>

        {/* Contraseña y Confirmación */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Confirmar Contraseña</label>
            <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={handleChange} required />
          </div>
        </div>

        {/* Teléfono */}
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
        </div>

        {/* Fecha de Nacimiento */}
        <div className="mb-3">
          <label className="form-label">Fecha de Nacimiento</label>
          <input type="date" name="dateOfBirth" className="form-control" value={form.dateOfBirth} onChange={handleChange} />
        </div>

        {/* Opciones para médico */}
        {form.role === 'doctor' && (
          <>
            <div className="mb-3">
              <label className="form-label">Especialidad</label>
              <input type="text" name="specialty" className="form-control" value={form.specialty} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Disponibilidad</label>
              <input type="text" name="availability" className="form-control" value={form.availability} onChange={handleChange} />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">Registrarse</button>
        <p className="mt-3">¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
      </form>
    </div>
  );
}
