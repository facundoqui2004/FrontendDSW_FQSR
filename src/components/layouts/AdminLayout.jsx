import React, { useState } from 'react';
import Sidebar from "../shared/SidebarAdmin";
import Footer from "../footer";
import { useAuth } from "../../context/AuthContext";
import { CgMenuRound } from "react-icons/cg";
import { RiCloseFill } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";

export default function AdminLayout({ children, title = "Panel de Administración" }) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  return (
    <div className="bg-[#0f172a] w-full min-h-screen transition-colors duration-300 flex flex-col">
      {/* Sidebar */}
      <Sidebar showMenu={showMenu} toggleUser={() => {}} />

      {/* MENU MOBILE */}
      <nav className="bg-[#1e293b] lg:hidden fixed top-0 left-0 w-full flex justify-between items-center p-4 z-20 shadow-lg">
        <button onClick={toggleMenu} className="text-white text-3xl">
          {showMenu ? <RiCloseFill /> : <CgMenuRound />}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">{user?.nomUsuario || 'Admin'}</span>
          <button className="text-white text-2xl">
            <FaRegUserCircle />
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main
        className={`flex-1 pt-20 lg:pt-6 pb-10 transition-all duration-300 ease-in-out
        ${showMenu ? "pl-4" : "pl-0"} lg:ml-28`}
      >
        {/* Header - visible en desktop */}
        <div className="hidden lg:block sticky top-0 bg-[#1e293b] p-4 md:p-6 shadow-lg z-10 mb-6">
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

        {/* Contenido dinámico */}
        <div className="px-4 md:px-6">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className={`mt-auto ${showMenu ? "pl-4" : "pl-0"} transition-all duration-300 ease-in-out lg:ml-28`}
      >
        <Footer />
      </footer>
    </div>
  );
}
