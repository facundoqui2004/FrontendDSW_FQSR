import React from 'react';
import Sidebar from "../components/shared/SidebarAdmin";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";

export default function HomeAdmin() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#262837]">
      {/* Sidebar fijo */}
      <div className="fixed left-0 top-0 h-full z-20">
        <Sidebar showMenu={true} toggleUser={() => {}} />
      </div>
      
      {/* Contenido principal con offset para el sidebar */}
      <main className="ml-28 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-[#1F1D2B] p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/Images/Admin.png"
                alt="Admin"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Panel de Administración
                </h1>
                <p className="text-gray-400">
                  Bienvenido, {user?.nomUsuario || 'Administrador'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Rol: {user?.rol}</p>
              <p className="text-sm text-gray-400">ID: {user?.id}</p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card de Usuarios */}
            <div className="bg-[#1F1D2B] rounded-lg p-6 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Usuarios</h3>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">👥</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-2">1,234</p>
              <p className="text-sm text-gray-400">Total de usuarios registrados</p>
            </div>

            {/* Card de Metahumanos */}
            <div className="bg-[#1F1D2B] rounded-lg p-6 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Metahumanos</h3>
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <img src="/Images/metahumano.png" alt="Meta" className="w-6 h-6" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-2">567</p>
              <p className="text-sm text-gray-400">Metahumanos activos</p>
            </div>

            {/* Card de Burócratas */}
            <div className="bg-[#1F1D2B] rounded-lg p-6 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Burócratas</h3>
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <img src="/Images/burocrataLogo.png" alt="Burocrata" className="w-6 h-6" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-2">321</p>
              <p className="text-sm text-gray-400">Burócratas en el sistema</p>
            </div>
          </div>

          {/* Tabla de actividades recientes */}
          <div className="bg-[#1F1D2B] rounded-lg shadow-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#262837] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Nuevo usuario registrado</p>
                      <p className="text-gray-400 text-sm">hace 5 minutos</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-sm">✓ Completado</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#262837] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⚡</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Metahumano activado</p>
                      <p className="text-gray-400 text-sm">hace 15 minutos</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-sm">✓ Completado</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#262837] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="ml-28">
        <Footer />
      </footer>
    </div>
  );
}
