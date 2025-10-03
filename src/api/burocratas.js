import axios from 'axios';

const API = 'http://localhost:3000/api';

// Crear instancia de axios con configuración
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000, // 10 segundos de timeout
  // withCredentials: true, // si necesitás cookies más adelante
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    console.log('Enviando request a:', config.url);
    return config;
  },
  (error) => {
    console.error('Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('Respuesta recibida de:', response.config.url);
    return response;
  },
  (error) => {
    console.error('Error en response:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('El servidor no está disponible en:', API);
    }
    return Promise.reject(error);
  }
);

// ==================== 🧍 Burocratas ====================

// Obtener todos los burocratas
export const getAllBurocratasRequest = () => apiClient.get('/burocratas');

// Obtener un burocrata por ID
export const getBurocrataByIdRequest = (id) =>
  apiClient.get(`/burocratas/${id}`);

// Crear un nuevo burocrata
export const createBurocrataRequest = (data) =>
  apiClient.post('/burocratas', data);

// Actualizar un burocrata existente
export const updateBurocrataRequest = (id, data) =>
  apiClient.put(`/burocratas/${id}`, data);

// Eliminar un burocrata
export const deleteBurocrataRequest = (id) =>
  apiClient.delete(`/burocratas/${id}`);

// Obtener todas las carpetas asociadas a un burocrata
export const getCarpetasByBurocrataIdRequest = (id) =>
  apiClient.get(`/burocratas/${id}/carpetas`);
