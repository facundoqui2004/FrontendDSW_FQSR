import { useState } from "react";
// Estructura de la aplicación
import Sidebar from "../../components/shared/SidebarMetaHum";
import Footer from "../../components/footer";
import { useNavigate } from "react-router-dom";
// Iconos
import { CgMenuRound } from "react-icons/cg";
import { FaRegUserCircle, FaPlus, FaWindowClose } from "react-icons/fa";
import { RiHome6Line, RiCloseFill } from "react-icons/ri";

function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();


  const goToTramites = () => {
    navigate('/meta/tramites');
  }
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showUser) {
      setShowUser(false); // Cierra el menú de usuario si el menú principal se abre
    }
  };
  
  const toggleUser = () => setShowUser(!showUser);
  
  const closeUser = () => setShowUser(false);

  return (
    <div className="bg-[#545877] w-full min-h-screen transition-colors duration-300">
      <Sidebar showMenu={showMenu} toggleUser={toggleUser} />

      {/* MENU */}
      <nav className="bg-[#1F1D2B] lg:hidden fixed w-full bottom-0 left-0 text-4xl text-gray-500 py-2 px-8 flex items-center rounded-tl-xl rounded-tr-xl shadow-lg justify-between transition-all duration-300 ease-in-out transform">
        
        <button 
          onClick={toggleUser} 
          className="p-2 transition-all duration-200 ease-in-out hover:text-white hover:scale-110 active:scale-95"
        >
          <FaRegUserCircle />
        </button>
        
        <button className="p-2 transition-all duration-200 ease-in-out hover:text-white hover:scale-110 active:scale-95">
          <RiHome6Line />
        </button>
        
        <button className="text-white p-2 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 hover:bg-[#ec7c6a] rounded-full">
          <FaPlus />
        </button>
        
        <button 
          onClick={toggleMenu} 
          className="p-2 transition-all duration-300 ease-in-out hover:text-white hover:scale-110 active:scale-95"
        >
          <div className="transition-transform duration-300 ease-in-out">
            {showMenu ? <FaWindowClose /> : <CgMenuRound />}
          </div>
        </button>
      </nav>

      <main className="lg:pl-28 grid grid-cols-1 lg:grid-cols-8 flex-1 min-h-screen pb-0 lg:pb-0 h-full">

        {/* Contenido principal */}
        <div
          className={`p-4 bg-[#296588] text-white rounded-lg shadow-lg h-full hover:shadow-xl
            ${showUser ? "lg:col-span-6" : "lg:col-span-8"}
            ${showUser ? "opacity-90" : "opacity-100"}`}
        >
          <div className="flex-1 min-h-full">
            <h1 className="text-3xl font-bold mb-6">🦸‍♀️ Portal Metahumano</h1>
            <p className="text-gray-300 mb-6">Bienvenido al panel de control para usuarios Metahumanos.</p>
            
            {/* Aquí puedes agregar contenido específico para Metahumanos */}
            <div className="text-center py-8">
              <p className="text-gray-400">Panel de control Metahumano en desarrollo...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Botón Mis Proyectos */}
              <button className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-left">📋 Mis Proyectos</h2>
                    <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center group-hover:bg-blue-400/50 transition-colors">
                      <span className="text-sm">→</span>
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm text-left leading-relaxed">
                    Gestiona y supervisa todos tus proyectos Metahumanos en un solo lugar.
                  </p>
                </div>
              </button>

              {/* Botón Mis Trámites */}
              <button 
                onClick={goToTramites}
                className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-left">⚡ Mis Trámites</h2>
                    <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center group-hover:bg-purple-400/50 transition-colors">
                      <span className="text-sm">→</span>
                    </div>
                  </div>
                  <p className="text-purple-100 text-sm text-left leading-relaxed">
                    Administra tus trámites de roles y poderes de forma rápida y eficiente.
                  </p>
                </div>
              </button>
            </div>
          </div>
          


        </div>
































































        {/* Panel de usuario */}
        <div
          className={`fixed lg:static top-0 right-0 w-full lg:w-auto h-full z-50
            ${showUser 
              ? "translate-x-0 opacity-100 lg:col-span-2" 
              : "translate-x-full opacity-0 lg:translate-x-0 lg:opacity-0 lg:w-0 lg:overflow-hidden"
            }`}
        >
          <div className="p-4 bg-[#1F1D2B] text-white rounded-lg shadow-lg h-full">
            <div className="relative pt-16 text-gray-300 p-8">
              <RiCloseFill
                onClick={closeUser}
                className="text-3xl absolute left-4 top-4 p-2 box-content text-gray-300 bg-[#ec7c6a] rounded-full cursor-pointer hover:scale-110 hover:bg-[#d66b59] active:scale-95 hover:shadow-lg"
              />
              <h1 className="text-2xl font-bold mb-4 flex items-center">
                Mi Perfil
              </h1>
              <div className="space-y-4">
                <div className="border-b border-gray-600 pb-2">
                  <h2 className="text-lg font-semibold">Información Personal</h2>
                  <p className="text-sm text-gray-400">Gestiona tu información</p>
                </div>
                <div className="border-b border-gray-600 pb-2">
                  <h2 className="text-lg font-semibold">Configuración</h2>
                  <p className="text-sm text-gray-400">Ajusta tus preferencias</p>
                </div>
                <div className="border-b border-gray-600 pb-2">
                  <h2 className="text-lg font-semibold">Notificaciones</h2>
                  <p className="text-sm text-gray-400">Controla las notificaciones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer
          className={`
            ${showMenu 
              ? "pl-4 lg:pl-28" 
              : "pl-0"
            }`}
        >
        <Footer />
      </footer>
    </div>
  );
}

export default Home;