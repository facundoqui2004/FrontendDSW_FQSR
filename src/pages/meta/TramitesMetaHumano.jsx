import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MetahumanoLayout from "../../components/layouts/MetahumanoLayout"
import { Meta } from "react-router-dom";

function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showFormPowers, setShowFormPowers] = useState(false);
  const [tipoSolicitud, setTipoSolicitud] = useState("");
  const [poderes, setPoderes] = useState([]);
  const [misPoderes, setMisPoderes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Obtener datos del usuario
  const { 
    user, 
    isAuthenticated, 
    getUserId, 
    getPerfilId, 
    getUserRole, 
    getUserAlias 
  } = useAuth();

  // obtener poderes del backend
  const fetchPoderes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      // Obtener todos los poderes
      const response = await fetch('http://localhost:3000/api/poderes', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener los poderes');
      }
      
      const data = await response.json();
      let todosLosPoderes = data.data || [];
      
      // Obtener los poderes que ya tiene el usuario
      try {
        const userId = getUserId();
        if (userId) {
          const userResponse = await fetch(`http://localhost:3000/api/metapoderes/usuario/${userId}`, {
            credentials: 'include'
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            const metahumanoId = userData.usuario?.metahumano?.id;
            
            if (metahumanoId) {
              const misPoderesResponse = await fetch(`http://localhost:3000/api/metapoderes/${metahumanoId}`, {
                credentials: 'include'
              });
              if (misPoderesResponse.ok) {
                const misPoderesData = await misPoderesResponse.json();
                const poderesMios = misPoderesData.data || misPoderesData || [];
                
                // Filtrar poderes que ya tiene APROBADOS o SOLICITADOS
                const poderesYaTengo = poderesMios
                  .filter(mp => mp.estado === 'APROBADO' || mp.estado === 'SOLICITADO')
                  .map(mp => mp.poder?.id);
                
                todosLosPoderes = todosLosPoderes.filter(poder => 
                  !poderesYaTengo.includes(poder.id)
                );
              }
            }
          }
        }
      } catch (filterError) {
        console.log('Error filtrando poderes:', filterError);
      }
      
      setPoderes(todosLosPoderes);
    } catch (err) {
      setError('No se pudieron cargar los poderes disponibles');
      console.error('Error fetching poderes:', err);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  // obtener los metapoderes del usuario
  const fetchMisPoderes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      // Obtener userId desde el contexto
      const userId = getUserId();
      if (!userId) {
        setError('No se pudo obtener la información del usuario');
        return;
      }

      console.log('🔍 Obteniendo datos del usuario ID:', userId);

      // Obtener datos completos del usuario para extraer metahumanoId
      const userResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
        credentials: 'include'
      });

      if (!userResponse.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }

      const userData = await userResponse.json();
      console.log('📡 Datos del usuario:', userData);
      
      const metahumanoId = userData.usuario?.metahumano?.id;
      
      if (!metahumanoId) {
        setError('No se encontró el perfil de metahumano. Verifica que tu cuenta esté configurada correctamente.');
        console.error('No se encontró metahumano.id en:', userData);
        return;
      }

      console.log('Obteniendo metapoderes para metahumanoId:', metahumanoId);

      // Obtener los metapoderes del usuario
      const response = await fetch(`http://localhost:3000/api/metapoderes/${metahumanoId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // Si no encuentra metapoderes, establecer array vacío
          console.log('No se encontraron metapoderes para este usuario');
          setMisPoderes([]);
          return;
        }
        throw new Error('Error al obtener tus poderes');
      }
      
      const data = await response.json();
      console.log('Metapoderes obtenidos:', data);
      
      const poderes = data.data || data || [];
      setMisPoderes(Array.isArray(poderes) ? poderes : []);
      
    } catch (err) {
      setError(`No se pudieron cargar tus poderes: ${err.message}`);
      console.error('Error fetching mis poderes:', err);
      setMisPoderes([]); // Establecer array vacío en caso de error
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

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

    // Obtener datos del usuario
    const userId = getUserId();
    const alias = getUserAlias();

    console.log('Datos del usuario para solicitud:', {
      userId,
      userRole,
      alias,
      user
    });

    if (!userId) {
      setError('No se pudo obtener la información del usuario');
      return;
    }

    // Obtener el ID del metahumano
    console.log('Obteniendo datos del usuario...');
    const userResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
      credentials: 'include'
    });

    if (!userResponse.ok) {
      throw new Error('Error al obtener los datos del usuario');
    }

    const userData = await userResponse.json();
    console.log('Datos completos del usuario:', userData);

    const metahumanoId = userData.usuario?.metahumano?.id;
    
    if (!metahumanoId) {
      setError('No se pudo obtener el ID del metahumano. Verifica que tu perfil esté completo.');
      console.error('No se encontró metahumano.id en:', userData);
      return;
    }

    console.log('ID del metahumano obtenido:', metahumanoId);

    // Verificar si el metahumano ya tiene este poder
    console.log('Verificando si ya tienes este poder...');
    const checkResponse = await fetch(`http://localhost:3000/api/metapoderes/${metahumanoId}`, {
      credentials: 'include'
    });

    if (checkResponse.ok) {
      const existingPowers = await checkResponse.json();
      const poderes = existingPowers.data || existingPowers || [];
      
      // Verifica si ya tiene el poder (aprobado o solicitado)
      if (misPoderes.length > 0){
          const yaTienePoder = poderes.some(mp => 
          mp.poder?.id === poder.id && (mp.estado === 'APROBADO' || mp.estado === 'SOLICITADO')
        );

        if (yaTienePoder) {
          setError(`Ya tienes el poder "${poder.nomPoder}" asignado o en proceso de solicitud.`);
          return;
        }
      }
    }

    // Preparar los datos completos para la asignación de metapoder
    const asignacionData = {
      metahumanoId: parseInt(metahumanoId),
      poderId: parseInt(poder.id),
      dominio: "NOVATO", 
      nivelControl: 25, 
      estado: "SOLICITADO", 
      fechaAdquisicion: new Date().toISOString().split('T')[0] 
    };

    console.log('Enviando solicitud de metapoder:', asignacionData);
    console.log('Poder seleccionado:', poder.nomPoder);
    
    const response = await fetch('http://localhost:3000/api/metapoderes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // incluye cookies
      body: JSON.stringify(asignacionData),
    });

    console.log('Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('Error del servidor:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        console.log('No se pudo parsear el error como JSON');
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Metapoder asignado exitosamente:', result);
    
    // Mostrar mensaje de éxito con más detalles
    setSuccessMessage(
      `¡Éxito! Has solicitado el poder "${poder.nomPoder}". Estado: SOLICITADO`
    );
    setError(""); // Limpiar errores previos
    
    // Recargar la lista de poderes disponibles para reflejar los cambios
    await fetchPoderes();
    
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

  // Función para desactivar/eliminar un poder
  const desactivarPoder = async (metapoderId, nombrePoder) => {
    try {
      setLoading(true);
      setError("");
      
      console.log('Desactivando metapoder ID:', metapoderId);
      
      if (!metapoderId) {
        setError('ID del metapoder no válido');
        return;
      }
      
      // Confirmar la acción
      const confirmar = window.confirm(`¿Estás seguro de que quieres desactivar el poder "${nombrePoder}"?`);
      if (!confirmar) {
        return;
      }
      
      // Enviar petición para desactivar el poder (cambiar estado a INACTIVO)
      const response = await fetch(`http://localhost:3000/api/metapoderes/${metapoderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          estado: 'INACTIVO'
        }),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.log('Error del servidor:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          console.log('No se pudo parsear el error como JSON');
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Poder desactivado exitosamente:', result);
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`¡Poder "${nombrePoder}" desactivado exitosamente!`);
      setError(""); // Limpiar errores previos
      
      // Recargar la lista de poderes
      await fetchMisPoderes();
      
      // Si estamos en la vista de solicitar, también recargar poderes disponibles
      if (tipoSolicitud === "solicitar") {
        await fetchPoderes();
      }
      
      // Limpiar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      
    } catch (err) {
      setError(`Error al desactivar el poder: ${err.message}`);
      console.error('Error desactivando poder:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos según el tipo de solicitud
  useEffect(() => {
    if (tipoSolicitud) {
      // Verificar autenticación antes de cargar datos
      if (!isAuthenticated) {
        setError('Debes iniciar sesión para acceder a esta función');
        return;
      }
      
      if (getUserRole() !== 'METAHUMANO') {
        setError('Solo los metahumanos pueden acceder a esta función');
        return;
      }
      
      // Cargar datos según el tipo de solicitud
      if (tipoSolicitud === "solicitar") {
        fetchPoderes(); // Cargar poderes disponibles
      } else if (tipoSolicitud === "eliminar" || tipoSolicitud === "verificar") {
        fetchMisPoderes(); // Cargar mis poderes
      }
    }
  }, [tipoSolicitud, isAuthenticated, getUserRole, fetchPoderes, fetchMisPoderes]);

  const togglePowersForm = () => {
    setShowFormPowers(!showFormPowers);
    // Limpiar errores y mensajes al cerrar/abrir el formulario
    if (!showFormPowers) {
      setError("");
      setSuccessMessage("");
      setTipoSolicitud("");
      setPoderes([]);
      setMisPoderes([]);
    }
  }

  // Función para cambiar tipo de solicitud con limpieza automática
  const cambiarTipoSolicitud = (tipo) => {
    setTipoSolicitud(tipo);
    setError("");
    setSuccessMessage("");
    setPoderes([]);
    setMisPoderes([]);
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showUser) {
      setShowUser(false);
    }
  };
  
  const toggleUser = () => setShowUser(!showUser);
  const closeUser = () => setShowUser(false);

  // Función de debug para consola
  window.debugTramites = {
    fetchPoderes,
    fetchMisPoderes,
    desactivarPoder,
    solicitarPoder,
    cambiarTipoSolicitud,
    getUserId,
    getUserRole,
    user,
    isAuthenticated,
    poderes,
    misPoderes,
    tipoSolicitud,
    loading,
    error,
    successMessage
  };

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
      <MetahumanoLayout>
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
                    onClick={() => cambiarTipoSolicitud("solicitar")}
                    className={`group relative overflow-hidden ${
                      tipoSolicitud === "solicitar" 
                        ? "bg-gradient-to-br from-green-700 to-green-800 border-green-400" 
                        : "bg-gradient-to-br from-green-600 to-green-700 border-green-500/30"
                    } hover:from-green-700 hover:to-green-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-2xl mb-2">✨</div>
                      <h3 className="text-lg font-bold mb-1">Solicitar Poderes</h3>
                      <p className="text-green-100 text-xs">Pide nuevos poderes</p>
                      {tipoSolicitud === "solicitar" && (
                        <div className="mt-2 text-xs bg-green-500/20 rounded px-2 py-1">
                          Sección activa
                        </div>
                      )}
                    </div>
                  </button>
                  
                  {/* Eliminar Poderes */}
                  <button 
                    onClick={() => cambiarTipoSolicitud("eliminar")}
                    className={`group relative overflow-hidden ${
                      tipoSolicitud === "eliminar" 
                        ? "bg-gradient-to-br from-red-700 to-red-800 border-red-400" 
                        : "bg-gradient-to-br from-red-600 to-red-700 border-red-500/30"
                    } hover:from-red-700 hover:to-red-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-2xl mb-2">🗑️</div>
                      <h3 className="text-lg font-bold mb-1">Eliminar Poderes</h3>
                      <p className="text-red-100 text-xs">Desactiva poderes existentes</p>
                      {tipoSolicitud === "eliminar" && (
                        <div className="mt-2 text-xs bg-red-500/20 rounded px-2 py-1">
                          Sección activa
                        </div>
                      )}
                    </div>
                  </button>
                  
                  {/* Verificar Solicitudes */}
                  <button 
                    onClick={() => cambiarTipoSolicitud("verificar")}
                    className={`group relative overflow-hidden ${
                      tipoSolicitud === "verificar" 
                        ? "bg-gradient-to-br from-amber-700 to-amber-800 border-amber-400" 
                        : "bg-gradient-to-br from-amber-600 to-amber-700 border-amber-500/30"
                    } hover:from-amber-700 hover:to-amber-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-2xl mb-2">📋</div>
                      <h3 className="text-lg font-bold mb-1">Verificar Solicitudes</h3>
                      <p className="text-amber-100 text-xs">Revisa el estado de tus poderes</p>
                      {tipoSolicitud === "verificar" && (
                        <div className="mt-2 text-xs bg-amber-500/20 rounded px-2 py-1">
                          Sección activa
                        </div>
                      )}
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
                      <div className="text-center py-8 bg-slate-700 rounded-lg border border-slate-600">
                        <div className="text-6xl mb-4">📭</div>
                        <h5 className="text-xl font-bold text-white mb-2">No hay poderes disponibles</h5>
                        <p className="text-gray-400 mb-4">
                          Puede que ya tengas todos los poderes disponibles o que no haya nuevos poderes en el sistema.
                        </p>
                        <button 
                          onClick={() => cambiarTipoSolicitud("verificar")}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Ver mis poderes actuales
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Lista de Mis Poderes - Para eliminar */}
                {tipoSolicitud === "eliminar" && (
                  <div className="mt-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      🗑️ Mis Poderes - Eliminar
                    </h4>
                    
                    {loading && (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                        <p className="text-gray-400 mt-2">Cargando tus poderes...</p>
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
                    
                    {!loading && !error && misPoderes.length > 0 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {misPoderes.filter(metapoder => metapoder.estado === 'APROBADO').map((metapoder) => (
                          <div key={metapoder.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:border-red-500 transition-all duration-200 hover:shadow-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-bold text-white text-lg">{metapoder.poder?.nomPoder || 'Poder Desconocido'}</h5>
                                <p className="text-sm text-gray-400">Dominio: {metapoder.dominio} | Control: {metapoder.nivelControl}%</p>
                              </div>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-green-100">
                                {metapoder.estado}
                              </span>
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                              {metapoder.poder?.descPoder || 'Sin descripción disponible'}
                            </p>
                            
                            <div className="space-y-3">
                              <div className="bg-orange-900/30 border border-orange-600/50 rounded-lg p-3">
                                <p className="text-orange-200 text-xs font-bold mb-1">
                                  📅 Adquirido: {new Date(metapoder.fechaAdquisicion).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div className="flex justify-between items-center bg-slate-800 rounded-lg p-3">
                                <div className="flex items-center">
                                  <span className="text-red-400 font-bold">
                                    🗑️ Desactivar Poder
                                  </span>
                                </div>
                                <button 
                                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                                  onClick={() => desactivarPoder(metapoder.id, metapoder.poder?.nomPoder)}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Procesando...
                                    </>
                                  ) : (
                                    <>
                                      🗑️ Eliminar
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {!loading && !error && misPoderes.filter(mp => mp.estado === 'APROBADO').length === 0 && (
                      <div className="text-center py-8 bg-slate-700 rounded-lg border border-slate-600">
                        <div className="text-6xl mb-4">🚫</div>
                        <h5 className="text-xl font-bold text-white mb-2">No tienes poderes aprobados</h5>
                        <p className="text-gray-400 mb-4">
                          No tienes poderes aprobados que puedas desactivar en este momento.
                        </p>
                        <button 
                          onClick={() => cambiarTipoSolicitud("solicitar")}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Solicitar nuevos poderes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Lista de Mis Poderes - Para verificar */}
                {tipoSolicitud === "verificar" && (
                  <div className="mt-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      📋 Estado de Mis Poderes
                    </h4>
                    
                    {loading && (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                        <p className="text-gray-400 mt-2">Cargando estado de poderes...</p>
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
                    
                    {!loading && !error && misPoderes.length > 0 && (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {/* Filtros por estado */}
                        <div className="flex gap-2 mb-4">
                          <span className="px-3 py-1 bg-green-600 text-green-100 rounded-full text-xs">
                            ✅ APROBADO ({misPoderes.filter(mp => mp.estado === 'APROBADO').length})
                          </span>
                          <span className="px-3 py-1 bg-yellow-600 text-yellow-100 rounded-full text-xs">
                            ⏳ SOLICITADO ({misPoderes.filter(mp => mp.estado === 'SOLICITADO').length})
                          </span>
                          <span className="px-3 py-1 bg-red-600 text-red-100 rounded-full text-xs">
                            ❌ RECHAZADO ({misPoderes.filter(mp => mp.estado === 'RECHAZADO').length})
                          </span>
                        </div>

                        {misPoderes.map((metapoder) => (
                          <div key={metapoder.id} className={`border rounded-lg p-4 transition-all duration-200 ${
                            metapoder.estado === 'APROBADO' ? 'bg-green-900/20 border-green-600' :
                            metapoder.estado === 'SOLICITADO' ? 'bg-yellow-900/20 border-yellow-600' :
                            metapoder.estado === 'RECHAZADO' ? 'bg-red-900/20 border-red-600' :
                            'bg-gray-900/20 border-gray-600'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h5 className="font-bold text-white text-lg mb-1">
                                  {metapoder.poder?.nomPoder || 'Poder Desconocido'}
                                </h5>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                  <span>Dominio: <strong>{metapoder.dominio}</strong></span>
                                  <span>Control: <strong>{metapoder.nivelControl}%</strong></span>
                                  <span>Fecha: <strong>{new Date(metapoder.fechaAdquisicion).toLocaleDateString()}</strong></span>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                metapoder.estado === 'APROBADO' ? 'bg-green-600 text-green-100' :
                                metapoder.estado === 'SOLICITADO' ? 'bg-yellow-600 text-yellow-100' :
                                metapoder.estado === 'RECHAZADO' ? 'bg-red-600 text-red-100' :
                                'bg-gray-600 text-gray-100'
                              }`}>
                                {metapoder.estado === 'APROBADO' ? '✅ APROBADO' :
                                 metapoder.estado === 'SOLICITADO' ? '⏳ SOLICITADO' :
                                 metapoder.estado === 'RECHAZADO' ? '❌ RECHAZADO' :
                                 metapoder.estado}
                              </span>
                            </div>
                            
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {metapoder.poder?.descPoder || 'Sin descripción disponible'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {!loading && !error && misPoderes.length === 0 && (
                      <div className="text-center py-8 bg-slate-700 rounded-lg border border-slate-600">
                        <div className="text-6xl mb-4">�</div>
                        <h5 className="text-xl font-bold text-white mb-2">Aún no tienes poderes</h5>
                        <p className="text-gray-400 mb-4">
                          No has solicitado ningún poder todavía. ¡Comienza tu aventura como metahumano!
                        </p>
                        <button 
                          onClick={() => cambiarTipoSolicitud("solicitar")}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Solicitar mi primer poder
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
    </MetahumanoLayout>
  );
}

export default Home;