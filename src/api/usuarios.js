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
        
        // Intentar obtener metahumanos y burócratas
        promesas.push(
            api.get('/metahumanos').catch((error) => {
                console.log('⚠️ Error en /metahumanos:', error.response?.status || error.message);
                return { data: { data: [] } };
            }),
            api.get('/Burocratas').catch((error) => {
                console.log('⚠️ Error en /Burocratas:', error.response?.status || error.message);
                return { data: { data: [] } };
            })
        );
        
        const resultados = await Promise.all(promesas);
        console.log('📊 Resultados obtenidos:', resultados);
        
        // Combinar todos los resultados
        let todosLosUsuarios = [];
        
        resultados.forEach((resultado, index) => {
            console.log(`📋 Procesando resultado ${index}:`, resultado);
            
            // La estructura de respuesta puede variar
            let usuarios = [];
            
            if (resultado.data) {
                // Intentar diferentes estructuras de respuesta
                if (Array.isArray(resultado.data)) {
                    usuarios = resultado.data;
                } else if (resultado.data.data && Array.isArray(resultado.data.data)) {
                    usuarios = resultado.data.data;
                } else if (resultado.data.metahumanos && Array.isArray(resultado.data.metahumanos)) {
                    usuarios = resultado.data.metahumanos;
                } else if (resultado.data.burocratas && Array.isArray(resultado.data.burocratas)) {
                    usuarios = resultado.data.burocratas;
                }
            }
            
            console.log(`📦 Usuarios extraídos del resultado ${index}:`, usuarios);
            
            if (Array.isArray(usuarios) && usuarios.length > 0) {
                const tipoUsuario = index === 0 ? 'METAHUMANO' : 'BUROCRATA';
                
                // Convertir a formato estándar de usuario
                const usuariosConvertidos = usuarios.map(usuario => {
                    console.log(`🔄 Convirtiendo ${tipoUsuario}:`, usuario);
                    
                    return {
                        id: usuario.id,
                        // Para metahumanos: usar 'nombre', para burócratas: usar 'nombreBuro' o 'nomBurocrata'
                        nomUsuario: usuario.nombre || usuario.nombreBuro || usuario.nomBurocrata || usuario.nomUsuario || `Usuario${usuario.id}`,
                        email: usuario.mail || usuario.email || 'sin-email@ejemplo.com',
                        rol: tipoUsuario,
                        fechaCreacion: usuario.fechaCreacion || usuario.createdAt || new Date().toISOString(),
                        estado: usuario.estado || 'ACTIVO',
                        activo: usuario.activo !== false && usuario.estado !== 'fugitivo' && usuario.estado !== 'inactivo',
                        // Campos adicionales específicos de metahumanos
                        ...(usuario.alias && { alias: usuario.alias }),
                        ...(usuario.origen && { origen: usuario.origen }),
                        ...(usuario.telefono && { telefono: usuario.telefono }),
                        ...(usuario.poderes && { poderes: usuario.poderes }),
                        ...(usuario.nivelPeligrosidad && { nivelPeligrosidad: usuario.nivelPeligrosidad }),
                        ...(usuario.recompensa && { recompensa: usuario.recompensa }),
                        // Campos adicionales específicos de burócratas
                        ...(usuario.nomBurocrata && { nomBurocrata: usuario.nomBurocrata }),
                        ...(usuario.departamento && { departamento: usuario.departamento }),
                        ...(usuario.cargo && { cargo: usuario.cargo }),
                        // Guardar el objeto original por si acaso
                        _original: usuario
                    };
                });
                
                todosLosUsuarios = [...todosLosUsuarios, ...usuariosConvertidos];
                console.log(`✅ Agregados ${usuariosConvertidos.length} usuarios de tipo: ${tipoUsuario}`);
            } else {
                console.log(`ℹ️ No se encontraron usuarios en el endpoint: ${index === 0 ? '/metahumanos' : '/Burocratas'}`);
            }
        });
        
        console.log(`✅ Total usuarios combinados: ${todosLosUsuarios.length}`);
        console.log('👥 Usuarios finales:', todosLosUsuarios);
        
        return { data: todosLosUsuarios };
    } catch (error) {
        console.error('❌ Error al obtener usuarios combinados:', error);
        throw error;
    }
};