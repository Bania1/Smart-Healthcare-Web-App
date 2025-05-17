import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext';

import CoverPage from './pages/CoverPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorHub from './pages/DoctorHubPage';
import PatientHub from './pages/PatientHubPage';
import UsersPage from './pages/UsersPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import Navbar from './components/Navbar';

function AfterLogin() {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.roles.includes('Doctor')) return <Navigate to="/doctor" replace />;
  if (user.roles.includes('Patient')) return <Navigate to="/patient" replace />;
  return <Navigate to="/login" replace />;
}

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && <Navbar />}

      <Routes>
        {/* Public cover page */}
        <Route path="/" element={<CoverPage />} />

        {/* Authentication pages with redirection if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/home" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/home" replace /> : <RegisterPage />}
        />

        {/* Hub redirection logic after login */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <AfterLogin />
            </PrivateRoute>
          }
        />

        {/* Role-based hubs with nested routes allowed */}
        <Route
          path="/doctor/*"
          element={
            <PrivateRoute>
              <DoctorHub />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/*"
          element={
            <PrivateRoute>
              <PatientHub />
            </PrivateRoute>
          }
        />

        {/* Shared protected pages */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <AppointmentsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/medical-records"
          element={
            <PrivateRoute>
              <MedicalRecordsPage />
            </PrivateRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
      </Routes>
    </>
  );
}
