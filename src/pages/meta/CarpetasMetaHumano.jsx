import { useEffect, useState } from "react";
import Sidebar from "../../components/shared/SidebarMetaHum";
import Footer from "../../components/footer";
import { CgMenuRound } from "react-icons/cg";
import { FaRegUserCircle, FaPlus, FaWindowClose } from "react-icons/fa";
import { RiHome6Line, RiCloseFill } from "react-icons/ri";
import { getMe } from "../../api/usuarios";
import { getCarpetasByMetahumanoRequest } from "../../api/carpetas";
import { useNavigate } from "react-router-dom";

export default function CarpetasMetaHumano() {
    const [carpetas, setCarpetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showUser) {
      setShowUser(false); // Cierra el menú de usuario si el menú principal se abre
    }
    };
    
    const goToTramites = () => {
        navigate('/metahumano/tramites');
    }
    const goToCarpetas = () => {
        navigate('/metahumano/carpetas');
    }

    const toggleUser = () => setShowUser(!showUser);
    
    const closeUser = () => setShowUser(false);

    useEffect(() => {
    (async () => {
      try {
        // 1) quién soy
        const meRes = await getMe();
        const u = meRes.data?.data;
        if (!u || u.perfil !== 'METAHUMANO' || !u.perfilId) {
          alert('Debés iniciar sesión como METAHUMANO.');
          setLoading(false);
          return;
        }

        // 2) pedir carpetas
        const res = await getCarpetasByMetahumanoRequest(u.perfilId);
        setCarpetas(res.data?.data || []);
      } catch (e) {
        console.error('❌ Error cargando carpetas del metahumano:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

            <div
          className={`p-4 bg-[#296588] text-white rounded-lg shadow-lg h-full hover:shadow-xl
            ${showUser ? "lg:col-span-6" : "lg:col-span-8"}
            ${showUser ? "opacity-90" : "opacity-100"}`}
        >
                <h1 className="text-2xl font-bold mb-4">Mis Carpetas</h1>

                {loading ? (
                <p>Cargando…</p>
                ) : carpetas.length === 0 ? (
                <p>No tenés carpetas asociadas.</p>
                ) : (
                <ul className="space-y-3">
                    {carpetas.map((c) => (
                    <li key={c.id} className="bg-[#2e2e2e] p-4 rounded flex justify-between items-center">
                        <div>
                        <p className="font-semibold">#{c.id} — {c.descripcion || 'Sin descripción'}</p>
                        <p className="text-sm text-gray-300">
                            Estado: <span className="capitalize">{c.estado}</span> — Tipo: <span className="capitalize">{c.tipo}</span>
                        </p>
                        </div>
                        <useNavigate
                        to={`/metahumano/carpetas/${c.id}`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                        >
                        Ver
                        </useNavigate>
                    </li>
                    ))}
                </ul>
                )}
            </div>
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
