import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { isAuthenticated, user } = useAuth();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        console.log('🚫 Usuario no autenticado, redirigiendo a /login');
        return <Navigate to="/login" replace />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    if (requiredRole && user?.rol !== requiredRole) {
        console.log(`🚫 Usuario no tiene el rol requerido: ${requiredRole}, tiene: ${user?.rol}`);
        return <Navigate to="/" replace />;
    }

    // Si todo está bien, renderizar el componente hijo
    return children;
};

export default ProtectedRoute;
