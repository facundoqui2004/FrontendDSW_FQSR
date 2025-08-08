import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Estructura de la aplicación
import Sidebar from "../../components/shared/SidebarUser";
import Footer from "../../components/footer";
// Iconos
import { CgMenuRound } from "react-icons/cg";
import { FaRegUserCircle, FaPlus, FaWindowClose, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { RiHome6Line, RiCloseFill } from "react-icons/ri";

function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showUser) {
      setShowUser(false); // Cierra el menú de usuario si el menú principal se abre
    }
  };
  
  const toggleUser = () => setShowUser(!showUser);
  
  const closeUser = () => setShowUser(false);

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="bg-[#262837] w-full min-h-screen transition-colors duration-300">
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
        
        <button 
          onClick={goToLogin}
          className="text-white p-2 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 hover:bg-[#ec7c6a] rounded-full"
        >
          <FaSignInAlt />
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

      <main className="lg:pl-28 grid grid-cols-1 lg:grid-cols-8 flex-1 min-h-screen pb-0 lg:pb-0">

        {/* Contenido principal */}
        <div
          className={`p-4 bg-[#1F1D2B] text-white rounded-lg shadow-lg h-full hover:shadow-xl
            ${showUser ? "lg:col-span-6" : "lg:col-span-8"}
            ${showUser ? "opacity-90" : "opacity-100"}`}
        >
          <div className="flex-1 min-h-full">
            <h1 className="text-3xl font-bold mb-6">Bienvenido al Súper Gestor</h1>
            <p className="text-gray-300 mb-8">Sistema de gestión para metahumanos y burócratas.</p>
            
            {/* Botones de acceso principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={goToLogin}
                className="bg-[#ec7c6a] hover:bg-[#d66b59] text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3"
              >
                <FaSignInAlt className="text-xl" />
                <span>Iniciar Sesión</span>
              </button>
              
              <button
                onClick={goToRegister}
                className="bg-[#0891b2] hover:bg-[#0ea5e9] text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3"
              >
                <FaUserPlus className="text-xl" />
                <span>Registrarse</span>
              </button>
            </div>

            {/* Información de la aplicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#262837] p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-[#ec7c6a]">Para Metahumanos</h3>
                <p className="text-gray-300">
                  Registra y gestiona tus poderes especiales. Mantén un seguimiento oficial 
                  de tus habilidades y certificaciones.
                </p>
              </div>
              
              <div className="bg-[#262837] p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-[#0891b2]">Para Burócratas</h3>
                <p className="text-gray-300">
                  Administra trámites y documentación oficial. Supervisa y aprueba 
                  registros de metahumanos de manera eficiente.
                </p>
              </div>
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
                Acceso Rápido
              </h1>
              <div className="space-y-4">
                <button 
                  onClick={goToLogin}
                  className="w-full text-left border border-gray-600 rounded-lg p-3 hover:bg-[#262837] transition-colors duration-200 flex items-center space-x-3"
                >
                  <FaSignInAlt className="text-[#ec7c6a]" />
                  <div>
                    <h2 className="text-lg font-semibold">Iniciar Sesión</h2>
                    <p className="text-sm text-gray-400">Accede a tu cuenta</p>
                  </div>
                </button>
                
                <button 
                  onClick={goToRegister}
                  className="w-full text-left border border-gray-600 rounded-lg p-3 hover:bg-[#262837] transition-colors duration-200 flex items-center space-x-3"
                >
                  <FaUserPlus className="text-[#0891b2]" />
                  <div>
                    <h2 className="text-lg font-semibold">Registrarse</h2>
                    <p className="text-sm text-gray-400">Crear cuenta nueva</p>
                  </div>
                </button>
                
                <div className="border-t border-gray-600 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">INFORMACIÓN</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>• Sistema para metahumanos</p>
                    <p>• Gestión de burócratas</p>
                    <p>• Trámites oficiales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Home;