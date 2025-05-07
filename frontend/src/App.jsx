import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext';          // ① Importa tu contexto auténtico

import CoverPage from './pages/CoverPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);               // ② Usa useContext con AuthContext
  return user 
    ? children 
    : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useContext(AuthContext);               // ③ Saca user para rutas públicas

  return (
    <>
      {/* Solo muestras la barra cuando estés logueado */}
      {user && <Navbar />}

      <Routes>
        {/* 1) Portada pública */}
        <Route path="/" element={<CoverPage />} />

        {/* 2) Login/Register solo si NO estás autenticado */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/home" replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <RegisterPage /> : <Navigate to="/home" replace />} 
        />

        {/* 3) Hub y secciones protegidas */}
        <Route 
          path="/home" 
          element={<PrivateRoute><HomePage /></PrivateRoute>} 
        />
        <Route 
          path="/users" 
          element={<PrivateRoute><UsersPage /></PrivateRoute>} 
        />
        <Route 
          path="/appointments" 
          element={<PrivateRoute><AppointmentsPage /></PrivateRoute>} 
        />
        <Route 
          path="/medical-records" 
          element={<PrivateRoute><MedicalRecordsPage /></PrivateRoute>} 
        />

        {/* 4) Catch-all: si estás dentro, al hub; si no, a portada */}
        <Route 
          path="*" 
          element={
            user 
              ? <Navigate to="/home" replace /> 
              : <Navigate to="/" replace />
          } 
        />
      </Routes>
    </>
  );
}
