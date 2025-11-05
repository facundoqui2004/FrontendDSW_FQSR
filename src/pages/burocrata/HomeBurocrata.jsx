import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 🧱 Estructura
import Sidebar from "../../components/shared/SidebarBurocrata";
import Footer from "../../components/footer";
// 🔸 Iconos
import { CgMenuRound } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import BurocrataLayout from "../../components/layouts/BurocrataLayout";

function HomeBurocrata() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();

  // 📌 Navegación
  const goToCarpetas = () => navigate("/burocrata/carpetas");
  const goToPerfil = () => navigate("/burocrata/perfil");
  const goToSoporte = () => navigate("/burocrata/soporte");

  // 📌 Menú lateral y usuario
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showUser) setShowUser(false);
  };

  const toggleUser = () => setShowUser(!showUser);
  const closeUser = () => setShowUser(false);

  return (
   
    <BurocrataLayout>
      {/* Contenido principal */}
        {/* Encabezado */}
        <section className="text-center text-white mt-8 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            🏛️ Portal Burócrata
          </h1>
          <p className="opacity-90 text-base">
            Bienvenido al panel de control para usuarios burócratas.
          </p>
        </section>

        <section className="flex flex-col items-center gap-6">
          {/* Carpetas */}
          <div
            onClick={goToCarpetas}
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
                       p-6 rounded-2xl shadow-2xl text-white w-full max-w-md transition transform hover:-translate-y-1 hover:shadow-blue-500/30"
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              📂 Gestión Carpetas
            </h2>
            <p className="text-white/90 text-sm">
              Gestioná y supervisá todas tus carpetas burocráticas en un solo lugar.
            </p>
            <div className="text-right mt-3 text-2xl font-light">→</div>
          </div>

          {/* Mi Perfil */}
          <div
            onClick={goToPerfil}
            className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 
                       p-6 rounded-2xl shadow-2xl text-white w-full max-w-md transition transform hover:-translate-y-1 hover:shadow-emerald-500/30"
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              👤 Mi Perfil
            </h2>
            <p className="text-white/90 text-sm">
              Consultá y actualizá tu información personal, credenciales y preferencias.
            </p>
            <div className="text-right mt-3 text-2xl font-light">→</div>
          </div>

          {/* Soporte */}
          <div
            onClick={goToSoporte}
            className="cursor-pointer bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 
                       p-6 rounded-2xl shadow-2xl text-white w-full max-w-md transition transform hover:-translate-y-1 hover:shadow-fuchsia-500/30"
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              🛠️ Soporte
            </h2>
            <p className="text-white/90 text-sm">
              Accedé a ayuda, tutoriales y contactá con el equipo de soporte técnico.
            </p>
            <div className="text-right mt-3 text-2xl font-light">→</div>
          </div>
        </section>

        {/* Bloque informativo */}
        <section className="mt-12 text-center text-white/70">
          Panel de control Burócrata en desarrollo…
        </section>
      </BurocrataLayout>
  );
}

export default HomeBurocrata;