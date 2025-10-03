// src/api/multas.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/multas';

// 📌 Crear multa
export const createMultaRequest = (data) => axios.post(API_URL, data);

// 📌 Obtener todas las multas
export const getAllMultasRequest = () => axios.get(API_URL);

// 📌 Obtener una multa
export const getMultaByIdRequest = (id) => axios.get(`${API_URL}/${id}`);

// 📌 Eliminar multa
export const deleteMultaRequest = (id) => axios.delete(`${API_URL}/${id}`);
