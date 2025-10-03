import { useState, useEffect } from "react";
// Estructura de la aplicación
import Sidebar from "../../components/shared/SidebarMetaHum";
import Footer from "../../components/footer";
// Context para autenticación
import { useAuth } from "../../context/AuthContext";
// Iconos
import { CgMenuRound } from "react-icons/cg";
import { FaRegUserCircle, FaPlus, FaWindowClose } from "react-icons/fa";
import { RiHome6Line, RiCloseFill } from "react-icons/ri";

function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showFormPowers, setShowFormPowers] = useState(false);
  const [tipoSolicitud, setTipoSolicitud] = useState("");
  const [poderes, setPoderes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Obtener datos del usuario desde el contexto
  const { 
    user, 
    isAuthenticated, 
    getUserId, 
    getPerfilId, 
    getUserRole, 
    getUserAlias 
  } = useAuth();

  // Función para obtener poderes del backend
  const fetchPoderes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch('http://localhost:3000/api/poderes', {
        credentials: 'include' // Incluir cookies para autenticación
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener los poderes');
      }
      
      const data = await response.json();
      setPoderes(data.data || []);
    } catch (err) {
      setError('No se pudieron cargar los poderes disponibles');
      console.error('Error fetching poderes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para solicitar un poder
const solicitarPoder = async (poder) => {
  try {
    setLoading(true);
    setError("");
    
    // Verificar autenticación
    if (!isAuthenticated || !user) {
      setError('Debes iniciar sesión para solicitar poderes');
      return;
    }

    // Verificar que es un metahumano
    const userRole = getUserRole();
    if (userRole !== 'METAHUMANO') {
      setError('Solo los metahumanos pueden solicitar poderes');
      return;
    }

    // Obtener datos del usuario desde el contexto
    const userId = getUserId();
    const alias = getUserAlias();

    console.log('👤 Datos del usuario para solicitud:', {
      userId,
      userRole,
      alias,
      user
    });

    if (!userId) {
      setError('No se pudo obtener la información del usuario');
      return;
    }

    // PASO NUEVO: Obtener el ID del metahumano desde la API
    console.log('🔍 Obteniendo datos completos del usuario desde la API...');
    const userResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
      credentials: 'include'
    });

    if (!userResponse.ok) {
      throw new Error('Error al obtener los datos del usuario');
    }

    const userData = await userResponse.json();
    console.log('📡 Datos completos del usuario:', userData);

    // Extraer el ID del metahumano
    const metahumanoId = userData.usuario?.metahumano?.id;
    
    if (!metahumanoId) {
      setError('No se pudo obtener el ID del metahumano. Verifica que tu perfil esté completo.');
      console.error('❌ No se encontró metahumano.id en:', userData);
      return;
    }

    console.log('🦸‍♂️ ID del metahumano obtenido:', metahumanoId);

    // Preparar los datos completos para la asignación de metapoder
    const asignacionData = {
      metahumanoId: parseInt(metahumanoId), // Usar el ID correcto del metahumano
      poderId: parseInt(poder.id),
      dominio: "NOVATO", // Nivel inicial para nuevos poderes
      nivelControl: 25, // Nivel de control inicial (0-100)
      estado: "SOLICITADO", // Estado del poder
      fechaAdquisicion: new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
    };

    console.log('📤 Enviando solicitud de metapoder:', asignacionData);
    console.log('⚡ Poder seleccionado:', poder.nomPoder);
    
    // Enviar petición al backend
    const response = await fetch('http://localhost:3000/api/metapoderes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación
      body: JSON.stringify(asignacionData),
    });

    console.log('📡 Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('❌ Error del servidor:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        console.log('No se pudo parsear el error como JSON');
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Metapoder asignado exitosamente:', result);
    
    // Mostrar mensaje de éxito con más detalles
    setSuccessMessage(
      `¡Éxito! Has adquirido el poder "${poder.nomPoder}" con dominio NOVATO y 25% de control. 🎉`
    );
    setError(""); // Limpiar errores previos
    
    // Limpiar el mensaje de éxito después de 5 segundos
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
    
  } catch (err) {
    setError(`Error al solicitar el poder: ${err.message}`);
    console.error('Error solicitando poder:', err);
  } finally {
    setLoading(false);
  }
};

  // Cargar poderes cuando se selecciona "solicitar"
  useEffect(() => {
    if (tipoSolicitud === "solicitar") {
      // Verificar autenticación antes de cargar poderes
      if (!isAuthenticated) {
        setError('Debes iniciar sesión para ver los poderes disponibles');
        return;
      }
      
      if (getUserRole() !== 'METAHUMANO') {
        setError('Solo los metahumanos pueden ver los poderes disponibles');
        return;
      }
      
      fetchPoderes();
    }
  }, [tipoSolicitud, isAuthenticated, getUserRole]);

  const togglePowersForm = () => {
    setShowFormPowers(!showFormPowers);
    // Limpiar errores y mensajes al cerrar/abrir el formulario
    if (!showFormPowers) {
      setError("");
      setSuccessMessage("");
      setTipoSolicitud("");
    }
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showUser) {
      setShowUser(false);
    }
  };
  
  const toggleUser = () => setShowUser(!showUser);
  const closeUser = () => setShowUser(false);

  // Verificar autenticación en el componente
  if (!isAuthenticated) {
    return (
      <div className="bg-[#545877] w-full min-h-screen flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-600 rounded-lg p-6 max-w-md mx-4">
          <p className="text-red-200 text-center">
            <span className="mr-2">🔒</span>
            Debes iniciar sesión para acceder a esta página
          </p>
        </div>
      </div>
    );
  }

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

      <main className="lg:pl-28 grid grid-cols-1 lg:grid-cols-8 flex-1 min-h-screen pb-0 lg:pb-0">

        {/* Contenido principal */}
        <div
          className={`p-4 bg-[#296588] text-white rounded-lg shadow-lg h-full hover:shadow-xl
            ${showUser ? "lg:col-span-6" : "lg:col-span-8"}
            ${showUser ? "opacity-90" : "opacity-100"}`}
        >
          <div className="flex-1 min-h-full">
            <div className="p-6 bg-[#044b97] text-white text-2xl text-bold rounded-lg h-full flex flex-col justify-center items-center">
                <h1>Panel de Tramites Metahumano</h1>
                {/* Mostrar información del usuario */}
                {user && (
                  <p className="text-lg mt-2 opacity-80">
                    Bienvenido, {getUserAlias() || user.nombre || 'Metahumano'}
                  </p>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Botón Gestión de Poderes */}
              <button 
                onClick={togglePowersForm}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-left">Gestión de Poderes</h2>
                    <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center group-hover:bg-blue-400/50 transition-colors">
                      <span className="text-sm">→</span>
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm text-left leading-relaxed">
                    Solicita y cancelar poderes de manera sencilla.
                  </p>
                </div>
              </button>

              {/* Botón Definir Estilo de Vida */}
              <button 
                className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-left">Definir Estilo de Vida</h2>
                    <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center group-hover:bg-purple-400/50 transition-colors">
                      <span className="text-sm">→</span>
                    </div>
                  </div>
                  <p className="text-purple-100 text-sm text-left leading-relaxed">
                    Determine si que tipo de vida llevara su metahumano. (Ej: Heroe, Villano)
                  </p>
                </div>
              </button>
            </div>
            
            {/* Formulario de Gestión de Poderes */}
            {showFormPowers && (
              <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-2xl border border-slate-600">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    Gestión de Poderes
                  </h3>
                  <button 
                    onClick={togglePowersForm}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Solicitar Poderes */}
                  <button 
                    onClick={() => setTipoSolicitud("solicitar")}
                    className="group relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-green-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-2xl mb-2">✨</div>
                      <h3 className="text-lg font-bold mb-1">Solicitar Poderes</h3>
                      <p className="text-green-100 text-xs">Pide nuevos poderes</p>
                    </div>
                  </button>
                  
                  {/* Eliminar Poderes */}
                  <button className="group relative overflow-hidden bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-red-500/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-2xl mb-2">🗑️</div>
                      <h3 className="text-lg font-bold mb-1">Eliminar Poderes</h3>
                      <p className="text-red-100 text-xs">Cancela poderes existentes</p>
                    </div>
                  </button>
                  
                  {/* Verificar Solicitudes */}
                  <button className="group relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-amber-500/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-2xl mb-2">📋</div>
                      <h3 className="text-lg font-bold mb-1">Verificar Solicitudes</h3>
                      <p className="text-amber-100 text-xs">Revisa el estado</p>
                    </div>
                  </button>
                </div>
                
                {/* Lista de Poderes Disponibles - Solo cuando se selecciona "solicitar" */}
                {tipoSolicitud === "solicitar" && (
                  <div className="mt-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      ⚡ Poderes Disponibles
                    </h4>
                    
                    {loading && (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="text-gray-400 mt-2">Cargando poderes...</p>
                      </div>
                    )}
                    
                    {error && (
                      <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 mb-4">
                        <p className="text-red-200 flex items-center">
                          <span className="mr-2">❌</span>
                          {error}
                        </p>
                      </div>
                    )}
                    
                    {successMessage && (
                      <div className="bg-green-900/50 border border-green-600 rounded-lg p-4 mb-4">
                        <p className="text-green-200 flex items-center">
                          <span className="mr-2">✅</span>
                          {successMessage}
                        </p>
                      </div>
                    )}
                    
                    {!loading && !error && poderes.length > 0 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {poderes.map((poder) => (
                          <div key={poder.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:border-blue-500 transition-all duration-200 hover:shadow-lg">
                            <div className="flex items-start justify-between mb-3">
                              <h5 className="font-bold text-white text-lg">{poder.nomPoder}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                poder.categoria === 'FISICO' ? 'bg-red-600 text-red-100' :
                                poder.categoria === 'SENSORIAL' ? 'bg-blue-600 text-blue-100' :
                                poder.categoria === 'MENTAL' ? 'bg-purple-600 text-purple-100' :
                                'bg-gray-600 text-gray-100'
                              }`}>
                                {poder.categoria}
                              </span>
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-3 leading-relaxed">{poder.descPoder}</p>
                            
                            <div className="space-y-3">
                              <div className="bg-orange-900/30 border border-orange-600/50 rounded-lg p-3">
                                <p className="text-orange-200 text-xs font-bold mb-1 flex items-center">
                                  ⚠️ Debilidad: {poder.debilidad}
                                </p>
                                <p className="text-orange-100 text-xs">{poder.descDebilidad}</p>
                              </div>
                              
                              <div className="flex justify-between items-center bg-slate-800 rounded-lg p-3">
                                <div className="flex items-center">
                                  <span className="text-green-400 font-bold text-lg">
                                    💰 ${poder.costoMulta.toLocaleString()}
                                  </span>
                                  <span className="text-gray-400 text-xs ml-2">costo de multa</span>
                                </div>
                                <button 
                                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                                  onClick={() => solicitarPoder(poder)}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Procesando...
                                    </>
                                  ) : (
                                    <>
                                      ✨ Solicitar
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {!loading && !error && poderes.length === 0 && tipoSolicitud === "solicitar" && (
                      <div className="text-center py-8 bg-slate-700 rounded-lg">
                        <p className="text-gray-400">📭 No hay poderes disponibles en este momento</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
              
              {/* Mostrar información del usuario en el panel */}
              {user && (
                <div className="space-y-4 mb-6">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Información de Usuario</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">ID:</span> {getUserId()}</p>
                      <p><span className="text-gray-400">Alias:</span> {getUserAlias() || 'Sin alias'}</p>
                      <p><span className="text-gray-400">Rol:</span> {getUserRole()}</p>
                      {getPerfilId() && (
                        <p><span className="text-gray-400">Perfil ID:</span> {getPerfilId()}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
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