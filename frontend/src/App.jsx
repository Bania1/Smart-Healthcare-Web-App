// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext';

import CoverPage          from './pages/CoverPage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import DoctorHub          from './pages/DoctorHubPage';
import PatientHub         from './pages/PatientHubPage';
import UsersPage          from './pages/UsersPage';
import AppointmentsPage   from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import Navbar             from './components/Navbar';

function AfterLogin() {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.roles.includes('Doctor'))  return <Navigate to="/doctor" replace />;
  if (user.roles.includes('Patient')) return <Navigate to="/patient" replace />;
  return <Navigate to="/login" replace />;
}

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* 1) Portada pública */}
        <Route path="/" element={<CoverPage />} />

        {/* 2) Autenticación */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 3) Ruta intermedia que decide hub */}
        <Route path="/home" element={<PrivateRoute><AfterLogin/></PrivateRoute>} />

        {/* 4) Hubs según rol */}
        <Route path="/doctor"  element={<PrivateRoute><DoctorHub /></PrivateRoute>} />
        <Route path="/patient" element={<PrivateRoute><PatientHub/></PrivateRoute>} />

        {/* 5) Rutas protegidas comunes */}
        <Route path="/users"           element={<PrivateRoute><UsersPage /></PrivateRoute>} />
        <Route path="/appointments"    element={<PrivateRoute><AppointmentsPage /></PrivateRoute>} />
        <Route path="/medical-records" element={<PrivateRoute><MedicalRecordsPage /></PrivateRoute>} />

        {/* 6) Cualquier otra: vuelta a portada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}