import React from 'react';
import Sidebar from "../shared/SidebarAdmin";
import Footer from "../footer";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({ children, title = "Panel de Administración" }) {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Sidebar fijo */}
      <div className="fixed left-0 top-0 h-full z-20">
        <Sidebar showMenu={true} toggleUser={() => {}} />
      </div>
      
      {/* Contenido principal con offset para el sidebar */}
      <main className="ml-28 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-[#1e293b] p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#0891b2] rounded-full flex items-center justify-center">
                <img
                  src="/Images/Admin.png"
                  alt="Admin"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="text-white font-bold text-lg hidden">👑</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {title}
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

        {/* Contenido dinámico */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="ml-28">
        <Footer />
      </footer>
    </div>
  );
}
