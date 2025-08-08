import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';

export default function HomeAdmin() {
  const navigate = useNavigate();
  
  return (
    <AdminLayout title="Panel de Administración">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card de Usuarios - Ahora interactivo */}
        <div 
          className="bg-[#1e293b] rounded-lg p-6 shadow-lg border border-slate-600 cursor-pointer hover:bg-[#334155] transition-colors group"
          onClick={() => navigate('/admin/gestionar-usuarios')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              Gestionar Usuarios
            </h3>
            <div className="w-10 h-10 bg-[#0891b2] rounded-full flex items-center justify-center group-hover:bg-[#0ea5e9] transition-colors">
              <span className="text-white font-bold">👥</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-2"></p>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Click para gestionar usuarios
          </p>
          <div className="mt-3 flex items-center text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Ver todos los usuarios</span>
            <span className="ml-2">→</span>
          </div>
        </div>

        {/* Card de Metahumanos - Ahora interactivo */}
        <div 
          className="bg-[#1e293b] rounded-lg p-6 shadow-lg border border-slate-600 cursor-pointer hover:bg-[#334155] transition-colors group"
          onClick={() => navigate('/admin/gestionar-metahumanos')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              Gestionar Metahumanos
            </h3>
            <div className="w-10 h-10 bg-[#06b6d4] rounded-full flex items-center justify-center group-hover:bg-[#0891b2] transition-colors">
              <img src="/Images/metahumano.png" alt="Meta" className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-2"></p>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Click para gestionar metahumanos
          </p>
          <div className="mt-3 flex items-center text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Ver todos los metahumanos</span>
            <span className="ml-2">→</span>
          </div>
        </div>

        {/* Card de Burócratas - Ahora interactivo */}
        <div 
          className="bg-[#1e293b] rounded-lg p-6 shadow-lg border border-slate-600 cursor-pointer hover:bg-[#334155] transition-colors group"
          onClick={() => navigate('/admin/gestionar-burocratas')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-500 transition-colors">
              Gestionar Burócratas
            </h3>
            <div className="w-10 h-10 bg-[#0ea5e9] rounded-full flex items-center justify-center group-hover:bg-[#0284c7] transition-colors">
              <img src="/Images/burocrataLogo.png" alt="Burocrata" className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-2"></p>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Click para gestionar burócratas
          </p>
          <div className="mt-3 flex items-center text-blue-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Ver todos los burócratas</span>
            <span className="ml-2">→</span>
          </div>
        </div>
      </div>

      {/* Tabla de actividades recientes */}
      <div className="bg-[#1e293b] rounded-lg shadow-lg border border-slate-600">
        <div className="p-6 border-b border-slate-600">
          <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#334155] rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#0891b2] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
                <div>
                  <p className="text-white font-medium">Nuevo usuario registrado</p>
                  <p className="text-gray-400 text-sm">hace 5 minutos</p>
                </div>
              </div>
              <span className="text-green-400 text-sm">✓ Completado</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#334155] rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#06b6d4] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <div>
                  <p className="text-white font-medium">Metahumano activado</p>
                  <p className="text-gray-400 text-sm">hace 15 minutos</p>
                </div>
              </div>
              <span className="text-green-400 text-sm">✓ Completado</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#334155] rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📋</span>
                </div>
                <div>
                  <p className="text-white font-medium">Trámite procesado</p>
                  <p className="text-gray-400 text-sm">hace 30 minutos</p>
                </div>
              </div>
              <span className="text-yellow-400 text-sm">⏳ En proceso</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
