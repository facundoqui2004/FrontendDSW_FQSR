import React from 'react';
import Sidebar from "../shared/SidebarAdmin";
import Footer from "../footer";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({ children, title = "Panel de Administración" }) {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#0f172a] flex overflow-x-hidden">
      {/* Sidebar fijo con scroll interno */}
      <div className="fixed left-0 top-0 h-screen z-20 w-28">
        <Sidebar showMenu={true} toggleUser={() => {}} />
      </div>
      
      {/* Contenido principal con offset para el sidebar y scroll propio */}
      <div className="flex-1 ml-28 min-h-screen flex flex-col overflow-y-auto overflow-x-hidden max-w-full">
        {/* Header - sticky para que permanezca visible al hacer scroll */}
        <div className="sticky top-0 bg-[#1e293b] p-4 md:p-6 shadow-lg z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0891b2] rounded-full flex items-center justify-center flex-shrink-0">
                <img
                  src="/Images/Admin.png"
                  alt="Admin"
                  className="w-6 h-6 md:w-8 md:h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="text-white font-bold text-lg hidden">👑</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-white truncate">
                  {title}
                </h1>
                <p className="text-xs md:text-sm text-gray-400 truncate">
                  Bienvenido, {user?.nomUsuario || 'Administrador'}
                </p>
              </div>
            </div>
            <div className="text-left md:text-right flex-shrink-0">
              <p className="text-xs md:text-sm text-gray-400">Rol: {user?.rol}</p>
              <p className="text-xs md:text-sm text-gray-400">ID: {user?.id}</p>
            </div>
          </div>
        </div>

        {/* Contenido dinámico con scroll */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden w-full">
          <div className="max-w-full overflow-x-hidden">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-shrink-0">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
