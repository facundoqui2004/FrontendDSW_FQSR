import axios from "axios";

const API = 'http://localhost:3000/api';

// Crear instancia de axios con configuración
const apiClient = axios.create({
    baseURL: API,
    timeout: 10000, // 10 segundos de timeout
    headers: {
        'Content-Type': 'application/json',
    }
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

export const registerRequest = user => apiClient.post('/usuarios/register', user);
export const loginRequest = user => apiClient.post('/usuarios/login', user);