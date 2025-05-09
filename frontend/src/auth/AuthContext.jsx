// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // <-- Solo funciona si AuthProvider está dentro de <BrowserRouter>

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/profile')
        .then(({ data }) => setUser(data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ dni, password }) => {
    // Llamada al endpoint correcto
    const { data } = await api.post('/api/auth/login', { dni, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    navigate('/home');  // Redirige al home hub
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');  // Vuelve al login
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}