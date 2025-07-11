import { useState } from "react";
// Estructura de la aplicación
import Sidebar from "./components/shared/SidebarUser"; // Cambiado a 
import Footer from "./components/footer"; // Importa el footer
// Sidebar según tu archivo
import { CgMenuRound } from "react-icons/cg";
import { FaRegUserCircle, FaPlus, FaWindowClose } from "react-icons/fa";
import { RiHome6Line, RiCloseFill } from "react-icons/ri";

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showUser) {
      setShowUser(false); // Cierra el menú de usuario si el menú principal se abre
    }
  };
  
  const toggleUser = () => setShowUser(!showUser);
  
  const closeUser = () => setShowUser(false);

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

      <main className="lg:pl-28 grid grid-cols-1 lg:grid-cols-8 transition-all duration-300 ease-in-out flex-1 min-h-screen pb-0 lg:pb-0">

        {/* Contenido principal */}
        <div
          className={`p-4 bg-[#ec7c6a] text-white rounded-lg shadow-lg h-full transition-all duration-500 ease-in-out transform
            ${showUser ? "lg:col-span-6 bg-white " : "lg:col-span-8 bg-red flex-1 min-h-screen"}
            ${showUser ? "opacity-90" : "opacity-100"}
            hover:shadow-xl`}
        >
          <div className="flex-1 min-h-full transition-all duration-300 ease-in-out">
            <h1>Principal Content</h1>
          </div>
        </div>

        {/* Panel de usuario con transiciones mejoradas */}
        <div
          className={`fixed lg:static top-0 right-0 w-full lg:w-auto h-full z-50 transition-all duration-500 ease-in-out transform
            ${showUser 
              ? "translate-x-0 opacity-100 lg:col-span-2" 
              : "translate-x-full opacity-0 lg:translate-x-0 lg:opacity-0 lg:w-0 lg:overflow-hidden"
            }`}
        >
          <div className="p-4 bg-[#1F1D2B] text-white rounded-lg shadow-lg h-full transition-all duration-300 ease-in-out">
            <div className="relative pt-16 text-gray-300 p-8 transition-all duration-300 ease-in-out">
              <RiCloseFill
                onClick={closeUser}
                className="text-3xl absolute left-4 top-4 p-2 box-content text-gray-300 bg-[#ec7c6a] rounded-full cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#d66b59] active:scale-95 hover:shadow-lg"
              />
              <h1 className="text-2xl font-bold mb-4 flex items-center transition-all duration-300 ease-in-out">
                Mi Perfil
              </h1>
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

export default App;