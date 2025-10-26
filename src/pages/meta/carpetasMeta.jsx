import React, { useState, useCallback, useEffect } from "react";
// Estructura de la aplicación
import Sidebar from "../../components/shared/SidebarMetaHum";
import Footer from "../../components/footer";
import { useAuth } from "../../context/AuthContext";
import { getMetaId}  from "../../utils/cookies";
// Iconos
import { CgMenuRound } from "react-icons/cg";
import { FaRegUserCircle, FaPlus, FaWindowClose, FaFolder, FaExclamationCircle } from "react-icons/fa";
import { RiHome6Line, RiCloseFill } from "react-icons/ri";

function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [carpetas, setCarpetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCarpetas, setExpandedCarpetas] = useState({});
  const [expandedMultas, setExpandedMultas] = useState({});
 
    const {
      getPerfilId 
    } = useAuth();
  
    // Función para obtener carpetas del backend
    const fetchCarpetas = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            
            // Obtener todas las carpetas del metahumano específico
            const response = await fetch(`http://localhost:3000/api/carpetas/idMetahumano/${getMetaId()}`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener las carpetas');
            }
            
            const data = await response.json();
            const carpetasData = data.data || [];
            setCarpetas(carpetasData);
            
        } catch (error) {
            console.error('Error fetching carpetas:', error);
            setError(error.message || 'Error al cargar las carpetas');
            setCarpetas([]);
        } finally {
            setLoading(false);
        }
    }, [getPerfilId]);

    // Cargar carpetas al montar el componente
    useEffect(() => {
        if (getPerfilId()) {
            fetchCarpetas();
        }
    }, [fetchCarpetas, getPerfilId]);

    const toggleMenu = () => setShowMenu(!showMenu);
    const toggleUser = () => setShowUser(!showUser);
    const closeUser = () => setShowUser(false);
    
    // Función para alternar la visibilidad de las multas de una carpeta específica
    const toggleMultas = (carpetaId) => {
        setExpandedCarpetas(prev => ({
            ...prev,
            [carpetaId]: !prev[carpetaId]
        }));
    };

    // Función para alternar los detalles de una multa específica
    const toggleDetallesMulta = (multaId) => {
        setExpandedMultas(prev => ({
            ...prev,
            [multaId]: !prev[multaId]
        }));
    };
    
    // Función para obtener todas las multas de una carpeta
    const obtenerMultasDeCarpeta = (carpeta) => {
        const todasLasMultas = [];
        if (carpeta.evidencias) {
            carpeta.evidencias.forEach(evidencia => {
                if (evidencia.multas) {
                    todasLasMultas.push(...evidencia.multas);
                }
            });
        }
        return todasLasMultas;
    };

    // Función para obtener la evidencia correspondiente a una multa
    const obtenerEvidenciaDeMulta = (carpeta, multaId) => {
        if (carpeta.evidencias) {
            for (const evidencia of carpeta.evidencias) {
                if (evidencia.multas && evidencia.multas.some(multa => multa.id === multaId)) {
                    return evidencia;
                }
            }
        }
        return null;
    };

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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Mis Carpetas</h1>
                <p className="text-gray-300">Gestiona tus carpetas y documentación de metahumano.</p>
              </div>
              <button 
                onClick={fetchCarpetas}
                disabled={loading}
                className="px-4 py-2 bg-[#ec7c6a] hover:bg-[#d66b59] disabled:bg-gray-600 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
            </div>
            
            {/* Estado de carga */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-gray-300">Cargando carpetas...</p>
              </div>
            )}

            {/* Estado de error */}
            {error && !loading && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <FaExclamationCircle className="text-red-400 mr-2" />
                  <p className="text-red-200">Error: {error}</p>
                </div>
                <button 
                  onClick={fetchCarpetas}
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Contenido de carpetas */}
            {!loading && !error && (
              <>
                {carpetas.length === 0 ? (
                  <div className="text-center py-12">
                    <FaFolder className="text-6xl text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No tienes carpetas</h3>
                    <p className="text-gray-400 mb-6">Aún no se han creado carpetas para tu perfil de metahumano.</p>
                    <button className="px-6 py-3 bg-[#ec7c6a] hover:bg-[#d66b59] rounded-lg text-white font-medium transition-colors">
                      Solicitar Nueva Carpeta
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {carpetas.map((carpeta) => {
                      const multas = obtenerMultasDeCarpeta(carpeta);
                      const multasPendientes = multas.filter(m => m.estado !== 'PAGADA').length;
                      
                      return (
                        <>
                        <div 
                          key={carpeta.id} 
                          className="bg-[#1F1D2B] rounded-lg p-6 hover:bg-[#2A2738] transition-colors border border-gray-700 hover:border-gray-600"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <FaFolder className="text-2xl text-[#ec7c6a]" />
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              carpeta.estado === 'activa' ? 'bg-green-500/20 text-green-400' :
                              carpeta.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {carpeta.estado || 'Sin estado'}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            Carpeta #{carpeta.id}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3">
                            {carpeta.descripcion || 'Sin descripción disponible'}
                          </p>
                          
                          {/* Información de multas */}
                          <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-300">Total de multas:</span>
                              <span className="text-white font-medium">{multas.length}</span>
                            </div>
                            {multasPendientes > 0 && (
                              <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-red-300">Pendientes:</span>
                                <span className="text-red-400 font-medium">{multasPendientes}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-3">
                            <p>Creada: {carpeta.fecha_creacion ? new Date(carpeta.fecha_creacion).toLocaleDateString() : 'Fecha no disponible'}</p>
                            {carpeta.burocrata && <p>Asignada a: Burócrata #{carpeta.burocrata}</p>}
                          </div>
                          
                          {/* Botón Ver/Ocultar Multas */}
                          <button
                            onClick={() => toggleMultas(carpeta.id)}
                            disabled={multas.length === 0}
                            className="w-full px-4 py-2 bg-[#ec7c6a] hover:bg-[#d66b59] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors text-sm"
                          >
                            {multas.length === 0 
                              ? 'Sin Multas' 
                              : expandedCarpetas[carpeta.id] 
                                ? `Ocultar ${multas.length} Multa${multas.length !== 1 ? 's' : ''}`
                                : `Ver ${multas.length} Multa${multas.length !== 1 ? 's' : ''}`
                            }
                          </button>
                        </div>
                        
                        {/* Sección de multas expandible */}
                        {expandedCarpetas[carpeta.id] && (
                          <div className="mt-4 space-y-3">
                            <div className="bg-[#1F1D2B] rounded-lg p-4 border-l-4 border-[#ec7c6a]">
                              <h4 className="text-lg font-semibold text-white mb-3">
                                Multas de la Carpeta #{carpeta.id}
                              </h4>
                              
                              {multas.length === 0 ? (
                                <div className="text-center py-4">
                                  <FaExclamationCircle className="text-2xl text-gray-400 mx-auto mb-2" />
                                  <p className="text-gray-400">No hay multas en esta carpeta</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {multas.map((multa) => (
                                    <div 
                                      key={multa.id} 
                                      className="bg-[#2A2738] rounded-lg p-4 border border-gray-600"
                                    >
                                      <div className="flex justify-between items-start mb-3">
                                        <h5 className="text-base font-semibold text-white">
                                          Multa #{multa.id}
                                        </h5>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                          multa.estado === 'PAGADA' ? 'bg-green-500/20 text-green-400' :
                                          multa.estado === 'APROBADA' ? 'bg-yellow-500/20 text-yellow-400' :
                                          multa.estado === 'PENDIENTE' ? 'bg-orange-500/20 text-orange-400' :
                                          'bg-red-500/20 text-red-400'
                                        }`}>
                                          {multa.estado}
                                        </span>
                                      </div>
                                      
                                      {/* Vista simplificada - siempre visible */}
                                      <div className="text-sm mb-3">
                                        <p className="text-gray-300">
                                          Monto: <span className="text-white font-medium">${multa.montoMulta.toLocaleString()}</span>
                                        </p>
                                      </div>

                                      {/* Detalles expandibles */}
                                      {expandedMultas[multa.id] && (() => {
                                        const evidencia = obtenerEvidenciaDeMulta(carpeta, multa.id);
                                        return (
                                          <div className="bg-[#1F1D2B] rounded-lg p-3 mb-3 border border-gray-600">
                                            <h6 className="text-white font-medium mb-3">Detalles de la multa:</h6>
                                            
                                            {/* Información de la multa */}
                                            <div className="mb-4">
                                              <h7 className="text-gray-300 font-medium mb-2 block">📋 Información de la multa:</h7>
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pl-4">
                                                <div>
                                                  <p className="text-gray-400">Motivo:</p>
                                                  <p className="text-white font-medium">{multa.motivoMulta}</p>
                                                </div>
                                                <div>
                                                  <p className="text-gray-400">Lugar de Pago:</p>
                                                  <p className="text-white">{multa.lugarDePago}</p>
                                                </div>
                                                <div>
                                                  <p className="text-gray-400">Fecha de Emisión:</p>
                                                  <p className="text-white">{new Date(multa.fechaEmision).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                  <p className="text-gray-400">Fecha de Vencimiento:</p>
                                                  <p className={`font-medium ${
                                                    new Date(multa.fechaVencimiento) < new Date() 
                                                      ? 'text-red-400' 
                                                      : 'text-white'
                                                  }`}>
                                                    {new Date(multa.fechaVencimiento).toLocaleDateString()}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Información de la evidencia */}
                                            {evidencia && (
                                              <div>
                                                <h7 className="text-gray-300 font-medium mb-2 block">🔍 Evidencia asociada:</h7>
                                                <div className="bg-[#2A2738] rounded-lg p-3 text-sm">
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                      <p className="text-gray-400">ID de Evidencia:</p>
                                                      <p className="text-white font-medium">#{evidencia.id}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-gray-400">Fecha de Recolección:</p>
                                                      <p className="text-white">{new Date(evidencia.fechaRecoleccion).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                      <p className="text-gray-400">Descripción de la evidencia:</p>
                                                      <p className="text-white font-medium mt-1">{evidencia.descripcion}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                      
                                      {/* Botones de acción para cada multa */}
                                      <div className="mt-3 flex gap-2 flex-wrap">
                                        <button 
                                          onClick={() => toggleDetallesMulta(multa.id)}
                                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                                        >
                                          {expandedMultas[multa.id] ? 'Ocultar Detalles' : 'Ver Detalles'}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        </>
                      );
                    })}
                  </div>
                )}
              </>
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
