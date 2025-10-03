// src/api/evidencias.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/evidencias';

// 📌 Crear evidencia
export const createEvidenciaRequest = (data) => axios.post(API_URL, data);

// 📌 Eliminar evidencia
export const deleteEvidenciaRequest = (id) => axios.delete(`${API_URL}/${id}`);

// 📌 Obtener una evidencia
export const getEvidenciaByIdRequest = (id) => axios.get(`${API_URL}/${id}`);

// 📌 Obtener todas (si querés)
export const getAllEvidenciasRequest = () => axios.get(API_URL);
