import axios from "axios";

const API = 'http://localhost:3000/api';

// Crear instancia de axios específica para usuarios
const usuariosAPI = axios.create({
    baseURL: API,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para agregar token de autenticación si existe
usuariosAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Enviando request a:', config.url);
        return config;
    },
    (error) => {
        console.error('Error en request:', error);
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
usuariosAPI.interceptors.response.use(
    (response) => {
        console.log('Respuesta recibida de:', response.config.url);
        return response;
    },
    (error) => {
        console.error('Error en response:', error);
        
        if (error.response?.status === 401) {
            // Token expirado o no válido
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            console.error('No tienes permisos para realizar esta acción');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('El servidor no está disponible en:', API);
        }
        
        return Promise.reject(error);
    }
);

// Funciones específicas para usuarios
export const obtenerTodosLosUsuarios = () => usuariosAPI.get('/usuarios'); // Intenta primero /usuarios
export const obtenerUsuarioActual = () => usuariosAPI.get('/usuarios/me'); // Endpoint específico que mencionaste
export const obtenerUsuarioPorId = (id) => usuariosAPI.get(`/usuarios/${id}`);
export const actualizarUsuario = (id, userData) => usuariosAPI.put(`/usuarios/${id}`, userData);
export const eliminarUsuario = (id) => usuariosAPI.delete(`/usuarios/${id}`);
export const cambiarEstadoUsuario = (id, activo) => usuariosAPI.patch(`/usuarios/${id}/estado`, { activo });

// Funciones para obtener otros tipos de usuarios
export const obtenerMetahumanos = () => usuariosAPI.get('/metahumanos');
export const obtenerBurocratas = () => usuariosAPI.get('/Burocratas'); // Respetando la capitalización

// Funciones adicionales que podrías necesitar
export const obtenerUsuariosPorRol = (rol) => usuariosAPI.get(`/usuarios?rol=${rol}`);
export const obtenerEstadisticasUsuarios = () => usuariosAPI.get('/usuarios/estadisticas');
export const buscarUsuarios = (termino) => usuariosAPI.get(`/usuarios/buscar?q=${termino}`);

// Función especial para obtener todos los usuarios de todos los endpoints
export const obtenerTodosLosUsuariosCombinados = async () => {
    try {
        console.log('🔍 Obteniendo usuarios de endpoints disponibles...');
        
        const promesas = [];
        
        // Solo usar los endpoints que SÍ funcionan
        promesas.push(
            usuariosAPI.get('/metahumanos').catch((error) => {
                console.log('⚠️ Error en /metahumanos:', error.response?.status);
                return { data: { data: [] } };
            }),
            usuariosAPI.get('/Burocratas').catch((error) => {
                console.log('⚠️ Error en /Burocratas:', error.response?.status);
                return { data: { data: [] } };
            })
        );
        
        const resultados = await Promise.all(promesas);
        console.log('📊 Resultados obtenidos:', resultados);
        
        // Combinar todos los resultados
        let todosLosUsuarios = [];
        
        resultados.forEach((resultado, index) => {
            // La estructura de respuesta es: { message: "...", data: [...] }
            const usuarios = resultado.data?.data || [];
            
            if (Array.isArray(usuarios) && usuarios.length > 0) {
                // Convertir a formato estándar de usuario
                const usuariosConvertidos = usuarios.map(usuario => ({
                    id: usuario.id,
                    // Para metahumanos: usar 'nombre', para burócratas: usar 'nombreBuro'
                    nomUsuario: usuario.nombre || usuario.nombreBuro || usuario.nomUsuario || `Usuario${usuario.id}`,
                    email: usuario.mail || usuario.email || 'sin-email@ejemplo.com',
                    rol: index === 0 ? 'METAHUMANO' : 'BUROCRATA',
                    fechaCreacion: new Date().toISOString(), // Como no viene fecha, usar actual
                    activo: usuario.estado !== 'fugitivo' && usuario.estado !== 'inactivo', // Solo inactivo si es fugitivo
                    // Campos adicionales específicos de metahumanos
                    ...(usuario.alias && { alias: usuario.alias }),
                    ...(usuario.origen && { origen: usuario.origen }),
                    ...(usuario.telefono && { telefono: usuario.telefono }),
                    ...(usuario.poderes && { poderes: usuario.poderes }),
                    ...(usuario.nivelPeligrosidad && { nivelPeligrosidad: usuario.nivelPeligrosidad }),
                    ...(usuario.recompensa && { recompensa: usuario.recompensa }),
                    // Campos adicionales específicos de burócratas
                    ...(usuario.aliasBuro && { alias: usuario.aliasBuro }),
                    ...(usuario.origenBuro && { origen: usuario.origenBuro }),
                    ...(usuario.estado && { estadoOriginal: usuario.estado })
                }));
                
                todosLosUsuarios = [...todosLosUsuarios, ...usuariosConvertidos];
                console.log(`✅ Agregados ${usuariosConvertidos.length} usuarios de tipo: ${index === 0 ? 'METAHUMANO' : 'BUROCRATA'}`);
            } else {
                console.log(`ℹ️ No se encontraron usuarios en el endpoint: ${index === 0 ? '/metahumanos' : '/Burocratas'}`);
            }
        });
        
        console.log(`✅ Total usuarios combinados: ${todosLosUsuarios.length}`);
        return { data: todosLosUsuarios };
    } catch (error) {
        console.error('❌ Error al obtener usuarios combinados:', error);
        throw error;
    }
};

export default usuariosAPI;
