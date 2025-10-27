// src/api/burocratas.js
import { api } from './client';
// Listar burócratas
export const getBurocratasRequest = () => api.get('/burocratas');
// Obtener un burócrata por ID
export const getBurocrataByIdRequest = (id) => api.get(`/burocratas/${id}`);
// Carpetas de un burócrata
export const getCarpetasByBurocrataId = (id) =>
  api.get(`/burocratas/${id}/carpetas`);
// Crear/Actualizar/Eliminar (si existen en tu backend)
export const createBurocrataRequest = (data) => api.post('/burocratas', data);
export const updateBurocrataRequest = (id, data) =>
  api.put(`/burocratas/${id}`, data);
export const deleteBurocrataRequest = (id) => api.delete(`/burocratas/${id}`);
