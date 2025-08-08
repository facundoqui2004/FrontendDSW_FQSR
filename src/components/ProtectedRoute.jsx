import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Función para normalizar roles (sincronizada con AuthContext)
const normalizeRole = (role) => {
    if (!role) return null;
    
    const roleUpper = role.toUpperCase();
    
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
            return role;
    }
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { isAuthenticated, user } = useAuth();

    // Normalizar el rol del usuario (usar .role en lugar de .rol)
    const userRole = normalizeRole(user?.role);

    console.log('🔍 ProtectedRoute - Verificando acceso:', { 
        isAuthenticated, 
        user, 
        requiredRole,
        originalRole: user?.role,
        normalizedUserRole: userRole
    });

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        console.log('🚫 Usuario no autenticado, redirigiendo a /login');
        return <Navigate to="/login" replace />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    if (requiredRole && userRole !== requiredRole) {
        console.log(`🚫 Usuario no tiene el rol requerido: ${requiredRole}, tiene: ${userRole} (original: ${user?.role})`);
        return <Navigate to="/" replace />;
    }

    console.log('✅ Acceso permitido a la ruta protegida');
    // Si todo está bien, renderizar el componente hijo
    return children;
};

export default ProtectedRoute;
