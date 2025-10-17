// src/api/carpetas.js
import { api } from './client';
// Obtener todas las carpetas
export const getAllCarpetasRequest = () => api.get('/carpetas');
// Obtener una carpeta por ID
export const getCarpetaByIdRequest = (id) => api.get(`/carpetas/${id}`);
// Crear una nueva carpeta
export const createCarpetaRequest = (data) => api.post('/carpetas', data);
// Eliminar una carpeta
export const deleteCarpetaRequest = (id) => api.delete(`/carpetas/${id}`);
// Actualizar carpeta
export const updateCarpetaRequest = (id, data) => api.put(`/carpetas/${id}`, data);
// Cambiar estado
export const patchCarpetaEstadoRequest = (id, estado) => api.patch(`/carpetas/${id}/estado`, { estado });
// Buscar carpertas por ID de Metahumano
export const getCarpetasByMetahumanoRequest = (metahumanoId) => api.get(`/carpetas/by-metahumano/${metahumanoId}`);