import { createContext, useState, useContext, useEffect } from "react";
import { registerMetahumanoRequest, registerBurocrataRequest, loginRequest, logoutRequest, getPerfilRequest } from '../api/auth';
import { getUserFromCookie } from '../utils/cookies';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({children}) => {
    // Inicializar con cookies primero, localStorage como respaldo
    const [user, setUser] = useState(() => {
        try {
            // PRIORIDAD 1: Intentar obtener de cookies
            let userData = getUserFromCookie();
            
            if (userData) {
                console.log('Usuario encontrado en cookies:', userData);
                return userData;
            }
            
            // PRIORIDAD 2: Respaldo en localStorage
            const savedUser = localStorage.getItem('user_info'); // Cambiado a user_info
            if (savedUser) {
                userData = JSON.parse(savedUser);
                console.log('Usuario encontrado en localStorage:', userData);
                return userData;
            }
            
            console.log('No se encontró usuario en cookies ni localStorage');
            return null;
        } catch (error) {
            console.error('Error al recuperar usuario:', error);
            return null;
        }
    });
    
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Verificar si hay usuario válido
        const hasUser = getUserFromCookie() !== null || localStorage.getItem('user_info') !== null;
        console.log('Estado de autenticación inicial:', hasUser);
        return hasUser;
    });
    
    const [error, setError] = useState(null);

    // Efecto para sincronizar cambios y guardar en ambos lugares
    useEffect(() => {
        if (user && isAuthenticated) {
            // Guardar en localStorage como respaldo
            localStorage.setItem('user_info', JSON.stringify(user));
            console.log('Sesión guardada en localStorage');
            console.log('Datos del usuario guardados:', {
                id: user.id,
                role: user.role,
                alias: user.alias,
                perfil: user.perfil,
                perfilId: user.perfilId
            });
        } else {
            // Limpiar localStorage
            localStorage.removeItem('user_info');
            localStorage.removeItem('user'); // Limpiar el anterior también
            localStorage.removeItem('isAuthenticated');
        }
    }, [user, isAuthenticated]);

    // Función para guardar usuario completo
    const saveUserData = (userData) => {
        console.log('Guardando datos completos del usuario:', userData);
        
        // Estructurar datos completos para guardar
        const completeUserData = {
            id: userData.id || userData.usuarioId,
            role: userData.role || userData.rol,
            alias: userData.alias,
            perfil: userData.perfil,
            perfilId: userData.perfilId,
            // Agregar más campos que necesites
            nombre: userData.nombre,
            email: userData.email || userData.mail,
            // Datos adicionales del backend
            ...userData
        };
        
        console.log('Estructura completa a guardar:', completeUserData);
        
        // Guardar en localStorage (las cookies se manejan automáticamente por el backend)
        localStorage.setItem('user_info', JSON.stringify(completeUserData));
        
        // Actualizar estado
        setUser(completeUserData);
        setIsAuthenticated(true);
        
        return completeUserData;
    };
    
    // Función para normalizar roles que vienen del backend
    const normalizeRole = (role) => {
        if (!role) return null;
        
        const roleUpper = role.toUpperCase();
        console.log('Normalizando rol:', role, '→', roleUpper);
        
        switch (roleUpper) {
            case 'METAHUMANO':
            case 'META':
                return 'METAHUMANO';
            case 'BUROCRATA':
            case 'BURO':
                return 'BUROCRATA';
            case 'ADMIN':
            case 'ADMINISTRATOR':
                return 'ADMIN';
            default:
                console.log('Rol no reconocido, usando valor original:', role);
                return role;
        }
    };
    
    // Función para obtener la ruta según el rol
    const getHomeRouteByRole = () => {
        console.log('Obteniendo ruta para usuario:', user);
        if (!user || !user.role) {
            console.log('No hay usuario o rol, redirigiendo a /');
            return '/';
        }
        
        const normalizedRole = normalizeRole(user.role);
        console.log('Rol original:', user.role, '→ Rol normalizado:', normalizedRole);
        
        switch (normalizedRole) {
            case 'METAHUMANO':
                console.log('Redirigiendo a /metahumano');
                return '/metahumano';
            case 'BUROCRATA':
                console.log('Redirigiendo a /homeBurocrata');
                return '/burocrata';
            case 'ADMIN':
                console.log('Redirigiendo a /admin');
                return '/admin';
            default:
                console.log('Rol desconocido, redirigiendo a /', normalizedRole);
                return '/';
        }
    };
    
    const signup = async (userData, userType = 'metahumano') => {
        try {
            setError(null);
            console.log('Iniciando registro como:', userType);
            console.log('Datos para registro:', userData);
            
            let registerFunc;
            if (userType === 'metahumano') {
                registerFunc = registerMetahumanoRequest;
            } else if (userType === 'burocrata') {
                registerFunc = registerBurocrataRequest;
            } else {
                registerFunc = registerMetahumanoRequest;
            }
            
            const res = await registerFunc(userData);
            console.log('Respuesta del servidor para registro:', res.data);
            
            const userDataFromServer = res.data.data || res.data;
            console.log('Registro exitoso (sin login automático)');
            return { success: true, data: userDataFromServer };
        } catch (error) {
            console.error('Error en registro:', error);
            
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
            console.log('Iniciando login con datos:', userData);
            console.log('Consultando endpoint: POST /api/auth/login');
            
            const res = await loginRequest(userData);
            console.log('Respuesta del servidor completa:', res.data);
            
            // Extraer datos del usuario del servidor
            const userDataFromServer = res.data.usuario || res.data.user || res.data;
            console.log('Datos del usuario del servidor:', userDataFromServer);
            console.log('Rol del usuario:', userDataFromServer?.role);
            
            // Guardar datos completos
            const completeUser = saveUserData(userDataFromServer);
            
            console.log('Login exitoso, sesión iniciada. Usuario completo:', completeUser);
            return { success: true, data: completeUser };
        } catch (error) {
            console.error('Error en login:', error);
            
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
                
                console.log(`Error ${status}: ${errorMessage}`);
            } else if (error.request) {
                errorMessage = 'No se pudo conectar con el servidor. Verifica que esté ejecutándose en http://localhost:3000';
                console.log('Error de conexión - servidor no disponible');
            } else {
                errorMessage = error.message || 'Error desconocido';
                console.log('Error desconocido:', error.message);
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            console.log('Cerrando sesión...');
            
            // Intentar logout en servidor (con cookies)
            await logoutRequest();
            console.log('Logout exitoso en servidor');
        } catch (error) {
            console.error('Error al hacer logout en el servidor:', error);
            // Continuar con el logout local aunque falle el servidor
        }
        
        // Limpiar estado local
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        
        // Limpiar todo el localStorage relacionado
        localStorage.removeItem('user_info');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        
        console.log('Sesión cerrada correctamente, estado local limpiado');
    };

    // Función para refrescar el perfil del usuario
    const refreshProfile = async () => {
        try {
            const res = await getPerfilRequest();
            const profileData = res.data;
            
            // Actualizar con datos completos del servidor
            const updatedUser = saveUserData(profileData);
            console.log('Perfil actualizado desde el servidor:', updatedUser);
            return { success: true, data: updatedUser };
        } catch (error) {
            console.error('Error al refrescar perfil:', error);
            return { success: false, error: error.message };
        }
    };

    // obtener datos específicos del usuario
    const getUserId = () => user?.id || user?.usuarioId || null;
    const getPerfilId = () => user?.perfilId || null;
    const getUserRole = () => user?.role || user?.rol || null;
    const getUserAlias = () => user?.alias || null;

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
            getUserId,
            getPerfilId,
            getUserRole,
            getUserAlias,
            saveUserData,
        }}>
            {children}
        </AuthContext.Provider>
    )
}