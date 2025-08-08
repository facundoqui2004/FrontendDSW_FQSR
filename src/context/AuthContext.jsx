import { createContext, useState, useContext, useEffect } from "react";
import { registerMetahumanoRequest, registerBurocrataRequest, loginRequest, logoutRequest, getPerfilRequest } from '../api/auth';
import { getUserFromCookie, isAuthenticated as checkCookieAuth, getFormattedUserInfo } from '../utils/cookies';



export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({children}) => {
    // Inicializar con datos de localStorage como principal (temporal hasta arreglar CORS)
    const [user, setUser] = useState(() => {
        // Temporal: usar localStorage como principal hasta que CORS esté arreglado
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Error al recuperar usuario del localStorage:', error);
            return null;
        }
    });
    
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Temporal: usar localStorage como principal hasta que CORS esté arreglado
        try {
            const savedAuth = localStorage.getItem('isAuthenticated');
            return savedAuth === 'true';
        } catch (error) {
            console.error('Error al recuperar estado de autenticación:', error);
            return false;
        }
    });
    
    const [error, setError] = useState(null);

    // Efecto para sincronizar cambios con localStorage (modo temporal)
    useEffect(() => {
        if (user && isAuthenticated) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
            console.log('💾 Sesión guardada en localStorage (modo temporal)');
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        }
    }, [user, isAuthenticated]);
    
    // Función para normalizar roles que vienen del backend
    const normalizeRole = (role) => {
        if (!role) return null;
        
        const roleUpper = role.toUpperCase();
        console.log('🔄 Normalizando rol:', role, '→', roleUpper);
        
        switch (roleUpper) {
            case 'METAHUMANO':
            case 'META':
                return 'METAHUMANO';
            case 'BUROCRATA':
            case 'BURO':
                return 'BUROCRATA';
            case 'ADMIN':
            case 'ADMINISTRATOR':
                return 'admin';
            default:
                console.log('⚠️ Rol no reconocido, usando valor original:', role);
                return role;
        }
    };
    
    // Función para obtener la ruta según el rol
    const getHomeRouteByRole = () => {
        console.log('🔍 Obteniendo ruta para usuario:', user);
        if (!user || !user.role) {
            console.log('❌ No hay usuario o rol, redirigiendo a /');
            return '/';
        }
        
        // Normalizar el rol antes de usar
        const normalizedRole = normalizeRole(user.role);
        console.log('👤 Rol original:', user.role, '→ Rol normalizado:', normalizedRole);
        
        switch (normalizedRole) {
            case 'METAHUMANO':
                console.log('🦸‍♂️ Redirigiendo a /homeMeta');
                return '/homeMeta';
            case 'BUROCRATA':
                console.log('📋 Redirigiendo a /homeBurocrata');
                return '/homeBurocrata';
            case 'admin':
                console.log('👑 Redirigiendo a /homeAdmin');
                return '/homeAdmin';
            default:
                console.log('❓ Rol desconocido después de normalización, redirigiendo a /', normalizedRole);
                return '/';
        }
    };
    
    const signup = async (userData, userType = 'metahumano') => {
        try {
            setError(null);
            console.log('🔄 Iniciando registro como:', userType);
            console.log('📦 Datos para registro:', userData);
            
            // Usar el endpoint correcto según el tipo de usuario
            let registerFunc;
            if (userType === 'metahumano') {
                registerFunc = registerMetahumanoRequest;
            } else if (userType === 'burocrata') {
                registerFunc = registerBurocrataRequest;
            } else {
                // Por defecto metahumano si no se especifica
                registerFunc = registerMetahumanoRequest;
            }
            
            const res = await registerFunc(userData);
            console.log('🌐 Respuesta del servidor para registro:', res.data);
            
            // SOLO registrar, NO hacer login automático aquí
            // El login se hará por separado desde el RegisterPage
            const userDataFromServer = res.data.data || res.data;
            console.log('✅ Registro exitoso (sin login automático)');
            return { success: true, data: userDataFromServer };
        } catch (error) {
            console.error('❌ Error en registro:', error);
            
            let errorMessage = 'Error en el registro';
            
            if (error.response) {
                errorMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             `Error del servidor: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No se pudo conectar con el servidor. Verifica que esté ejecutándose.';
            } else {
                errorMessage = error.message || 'Error desconocido';
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const login = async (userData) => {
        try {
            setError(null);
            console.log('🔄 Iniciando login con datos:', userData);
            console.log('🌐 Consultando endpoint: POST /api/auth/login');
            
            const res = await loginRequest(userData);
            console.log('🌐 Respuesta del servidor completa:', res.data);
            
            // Usar datos del usuario del servidor (está en res.data.usuario)
            const userDataFromServer = res.data.usuario;
            console.log('👤 Datos del usuario del servidor:', userDataFromServer);
            console.log('🎭 Rol del usuario:', userDataFromServer?.role);
            
            setUser(userDataFromServer);
            setIsAuthenticated(true);
            console.log('🔐 Login exitoso, sesión iniciada. Estado actualizado:', {
                user: userDataFromServer,
                isAuthenticated: true
            });
            return { success: true, data: userDataFromServer };
        } catch (error) {
            console.error('❌ Error en login:', error);
            
            let errorMessage = 'Error en el login';
            
            if (error.response) {
                const status = error.response.status;
                const serverMessage = error.response.data?.message || error.response.data?.error;
                
                switch (status) {
                    case 401:
                        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
                        break;
                    case 404:
                        errorMessage = 'Usuario no encontrado. Verifica que el email sea correcto o regístrate.';
                        break;
                    case 400:
                        errorMessage = serverMessage || 'Datos de login inválidos.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Intenta más tarde.';
                        break;
                    default:
                        errorMessage = serverMessage || `Error del servidor: ${status}`;
                }
                
                console.log(`🚨 Error ${status}: ${errorMessage}`);
            } else if (error.request) {
                errorMessage = 'No se pudo conectar con el servidor. Verifica que esté ejecutándose en http://localhost:3000';
                console.log('🌐 Error de conexión - servidor no disponible');
            } else {
                errorMessage = error.message || 'Error desconocido';
                console.log('❓ Error desconocido:', error.message);
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            console.log('🚪 Cerrando sesión...');
            
            // TEMPORAL: Comentado hasta arreglar CORS
            // await logoutRequest();
            console.log('✅ Logout (modo temporal - sin llamada al servidor)');
        } catch (error) {
            console.error('Error al hacer logout en el servidor:', error);
            // Continuar con el logout local aunque falle el servidor
        }
        
        // Limpiar estado local
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        
        // Limpiar localStorage para retrocompatibilidad
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token'); // Por si acaso hay token guardado
        
        console.log('✅ Sesión cerrada correctamente, estado local limpiado');
    };

    // Función para refrescar el perfil del usuario
    const refreshProfile = async () => {
        try {
            const res = await getPerfilRequest();
            const profileData = res.data;
            
            // Actualizar con datos del servidor
            setUser(profileData);
            console.log('🔄 Perfil actualizado desde el servidor');
            return { success: true, data: profileData };
        } catch (error) {
            console.error('Error al refrescar perfil:', error);
            return { success: false, error: error.message };
        }
    };

    return(
        <AuthContext.Provider value={{
            signup,
            login,
            logout,
            refreshProfile,
            user,
            isAuthenticated,
            error,
            getHomeRouteByRole,
        }}>
            {children}
        </AuthContext.Provider>
    )
}