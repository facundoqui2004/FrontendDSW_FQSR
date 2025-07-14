import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest } from '../api/auth';



export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({children}) => {
    // Recuperar datos del localStorage al inicializar
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Error al recuperar usuario del localStorage:', error);
            return null;
        }
    });
    
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        try {
            const savedAuth = localStorage.getItem('isAuthenticated');
            return savedAuth === 'true';
        } catch (error) {
            console.error('Error al recuperar estado de autenticación:', error);
            return false;
        }
    });
    
    const [error, setError] = useState(null);

    // Efecto para sincronizar cambios con localStorage
    useEffect(() => {
        if (user && isAuthenticated) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
            console.log('💾 Sesión guardada en localStorage');
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        }
    }, [user, isAuthenticated]);
    
    // Función para obtener la ruta según el rol
    const getHomeRouteByRole = () => {
        console.log('🔍 Obteniendo ruta para usuario:', user);
        if (!user || !user.rol) {
            console.log('❌ No hay usuario o rol, redirigiendo a /');
            return '/';
        }
        
        console.log('👤 Rol del usuario:', user.rol);
        
        switch (user.rol) {
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
                console.log('❓ Rol desconocido, redirigiendo a /', user.rol);
                return '/';
        }
    };
    
    const signup = async (userData) => {
        try {
            setError(null);
            const res = await registerRequest(userData);
            console.log('Respuesta del servidor:', res.data);
            const userDataFromServer = res.data.data || res.data;
            setUser(userDataFromServer);
            setIsAuthenticated(true);
            console.log('🔐 Registro exitoso, sesión iniciada');
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
            const res = await loginRequest(userData);
            console.log('Respuesta del servidor:', res.data);
            const userDataFromServer = res.data.data;
            setUser(userDataFromServer);
            setIsAuthenticated(true);
            console.log('🔐 Login exitoso, sesión iniciada y guardada');
            return { success: true, data: userDataFromServer };
        } catch (error) {
            console.error('Error en login:', error);
            
            let errorMessage = 'Error en el login';
            
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

    const logout = () => {
        console.log('🚪 Cerrando sesión...');
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        // Limpiar localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token'); // Por si acaso hay token guardado
        console.log('✅ Sesión cerrada correctamente, localStorage limpiado');
    };

    return(
        <AuthContext.Provider value={{
            signup,
            login,
            logout,
            user,
            isAuthenticated,
            error,
            getHomeRouteByRole,
        }}>
            {children}
        </AuthContext.Provider>
    )
}