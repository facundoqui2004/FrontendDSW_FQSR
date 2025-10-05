import { api } from './client';

export const obtenerTodosLosUsuarios   = ()      => api.get('/usuarios');
export const getMe                     = ()      => api.get('/usuarios/me');
export const obtenerUsuarioPorId       = (id)    => api.get(`/usuarios/${id}`);
export const actualizarUsuario         = (id,d)  => api.put(`/usuarios/${id}`, d);
export const eliminarUsuario           = (id)    => api.delete(`/usuarios/${id}`);
export const cambiarEstadoUsuario      = (id,a)  => api.patch(`/usuarios/${id}/estado`, { activo: a });

export const obtenerMetahumanos        = ()      => api.get('/metahumanos');
export const obtenerBurocratas         = ()      => api.get('/Burocratas');
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