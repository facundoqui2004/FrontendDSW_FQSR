// src/api/client.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true, // para cookies (coincide con tu app.ts: credentials: true)
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor (logging, headers extra si algún día usas Bearer)
api.interceptors.request.use(
  (config) => {
    // console.log('➡️', config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor global (manejo de 401/403, logs, etc.)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // sesión expirada / no autenticado
      // opcional: redirigir a login
      // window.location.href = '/login';
    }
    // console.error('⬅️ Error', status, error.config?.url);
    return Promise.reject(error);
  }
);
