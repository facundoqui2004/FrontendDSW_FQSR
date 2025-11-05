import React, { useState, useCallback, useEffect } from "react";
import { getMetaId, getUserFromCookie}  from "../../utils/cookies";
import { getBurocrataByIdRequest } from "../../api/burocratas";
import MetahumanoLayout from "../../components/layouts/MetahumanoLayout";


function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [carpetas, setCarpetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCarpetas, setExpandedCarpetas] = useState({});
  const [expandedMultas, setExpandedMultas] = useState({});
  const [burocrataNombre, setBurocrataNombre] = useState(null)
 

  
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
    }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        if (getMetaId()) {
          await fetchCarpetas();
        }
        const user = getUserFromCookie();
        const burocrataId = user?.perfilId;

        if (burocrataId) {
          const res = await getBurocrataByIdRequest(burocrataId);
          setBurocrataNombre(res.data.data.nombre);
          console.log("nombre del burócrata:", res.data.data.nombre);
        } else {
          console.warn("No se encontró perfilId en la cookie");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    }

    fetchData();
  }, [fetchCarpetas]);



    const toggleMenu = () => setShowMenu(!showMenu);
    const toggleUser = () => setShowUser(!showUser);
    const closeUser = () => setShowUser(false);
    
    // alternar la visibilidad de las multas de una carpeta
    const toggleMultas = (carpetaId) => {
        setExpandedCarpetas(prev => ({
            ...prev,
            [carpetaId]: !prev[carpetaId]
        }));
    };

    // alternar detalles de una multa
    const toggleDetallesMulta = (multaId) => {
        setExpandedMultas(prev => ({
            ...prev,
            [multaId]: !prev[multaId]
        }));
    };
    
    // todas las multas de una carpeta
  const obtenerMultasDeCarpeta = (carpeta) => {
    const totalMultas = [];
    console.log("CARPETA:", carpeta)
    if (carpeta.evidencias && Array.isArray(carpeta.evidencias)) {
      console.log("EVIDENCIAS: ", carpeta.evidencias)
      for (const evidencia of carpeta.evidencias) {
        if (evidencia.multas && Array.isArray(evidencia.multas)) {
          totalMultas.push(...evidencia.multas);
        }
      }
    }

    return totalMultas;
  };

    // obtener la evidencia correspondiente a una multa
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
    <MetahumanoLayout>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {carpetas.map((carpeta) => {
                      const multas = obtenerMultasDeCarpeta(carpeta);
                      const multasPendientes = multas.filter(m => m.estado === 'PENDIENTE').length;
                      const isExpanded = expandedCarpetas[carpeta.id];

                      return (
                        <div
                          key={carpeta.id}
                          className={`bg-[#1F1D2B] rounded-lg p-6 border border-gray-700 hover:border-gray-600 hover:bg-[#2A2738] transition-all duration-300 
                            ${isExpanded ? 'col-span-2' : ''}`}
                        >
                          {/* Cabecera de la carpeta */}
                          <div className="flex items-start justify-between mb-4">
                            <FaFolder className="text-2xl text-[#ec7c6a]" />
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                carpeta.estado === 'activa'
                                  ? 'bg-green-500/20 text-green-400'
                                  : carpeta.estado === 'pendiente'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {carpeta.estado || 'Sin estado'}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-white mb-2">
                            Carpeta #{carpeta.id}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3">
                            {carpeta.descripcion || 'Sin descripción disponible'}
                          </p>

                          {/* Resumen de multas */}
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
                            <p>
                              Creada:{' '}
                              {carpeta.fecha_creacion
                                ? new Date(carpeta.fecha_creacion).toLocaleDateString()
                                : 'Fecha no disponible'}
                            </p>
                            {carpeta.burocrata && (
                              <p>Asignada al Burócrata: {burocrataNombre}</p>
                            )}
                          </div>

                          {/* Botón para expandir multas */}
                          <button
                            onClick={() => toggleMultas(carpeta.id)}
                            disabled={multas.length === 0}
                            className="w-full px-4 py-2 bg-[#ec7c6a] hover:bg-[#d66b59] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors text-sm mb-2"
                          >
                            {multas.length === 0
                              ? 'Sin Multas'
                              : isExpanded
                              ? `Ocultar ${multas.length} Multa${multas.length !== 1 ? 's' : ''}`
                              : `Ver ${multas.length} Multa${multas.length !== 1 ? 's' : ''}`}
                          </button>

                          {/* Sección expandible de multas */}
                          {isExpanded && (
                            <div className="mt-4 border-t border-gray-700 pt-4">
                              <h4 className="text-lg font-semibold text-white mb-3">
                                Multas de la Carpeta #{carpeta.id}
                              </h4>

                              {multas.length === 0 ? (
                                <p className="text-gray-400 text-sm">
                                  No hay multas en esta carpeta.
                                </p>
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
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium ${
                                            multa.estado === 'PAGADA'
                                              ? 'bg-green-500/20 text-green-400'
                                              : multa.estado === 'APROBADA'
                                              ? 'bg-yellow-500/20 text-yellow-400'
                                              : multa.estado === 'PENDIENTE'
                                              ? 'bg-orange-500/20 text-orange-400'
                                              : 'bg-red-500/20 text-red-400'
                                          }`}
                                        >
                                          {multa.estado}
                                        </span>
                                      </div>
                                      <p className="text-gray-300 text-sm">
                                        Monto: ${multa.montoMulta.toLocaleString()}
                                      </p>
                                      <h7 className="text-gray-300 font-medium mb-2 block">📋 Información de la multa:</h7>
                                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm pl-4">
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
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                )}
              </>
            )}
          </div>
        </div>
    </MetahumanoLayout>
  );
}

export default Home;
