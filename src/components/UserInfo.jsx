import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserInfo = () => {
  const { user, isAuthenticated, getHomeRouteByRole } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-600">No hay usuario autenticado</p>
      </div>
    );
  }

  const homeRoute = getHomeRouteByRole();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Información del Usuario</h2>
      
      <div className="space-y-3">
        <div>
          <label className="font-semibold text-gray-700">Nombre:</label>
          <p className="text-gray-600">{user.nomUsuario || user.nom_usuario || 'No disponible'}</p>
        </div>
        
        <div>
          <label className="font-semibold text-gray-700">Email:</label>
          <p className="text-gray-600">{user.mail || 'No disponible'}</p>
        </div>
        
        <div>
          <label className="font-semibold text-gray-700">Rol:</label>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            user.rol === 'METAHUMANO' 
              ? 'bg-blue-100 text-blue-800' 
              : user.rol === 'BUROCRATA'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {user.rol || 'Sin rol'}
          </span>
        </div>
        
        <div>
          <label className="font-semibold text-gray-700">Página de inicio asignada:</label>
          <p className="text-blue-600 font-mono">{homeRoute}</p>
        </div>
        
        <div>
          <label className="font-semibold text-gray-700">Estado:</label>
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Autenticado
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
