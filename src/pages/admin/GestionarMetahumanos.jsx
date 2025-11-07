import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { obtenerTodosLosUsuarios, obtenerTodosLosUsuariosCombinados, eliminarUsuario, cambiarEstadoUsuario } from '../../api/usuarios';

export default function GestionarMetahumanos() {
  const [metahumanos, setMetahumanos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar metahumanos del backend
  const cargarMetahumanos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Cargando metahumanos desde endpoints disponibles...');
      
      // Usar la función combinada y filtrar solo metahumanos
      const response = await obtenerTodosLosUsuariosCombinados();
      console.log('✅ Usuarios obtenidos:', response.data);
      
      const usuariosData = response.data || [];
      
      // Filtrar solo metahumanos
      const metahumanosData = usuariosData.filter(usuario => usuario.rol === 'METAHUMANO');
      
      if (metahumanosData.length === 0) {
        setError('No se encontraron metahumanos en el sistema.');
      } else {
        setMetahumanos(metahumanosData);
        console.log(`🎉 Se cargaron ${metahumanosData.length} metahumanos exitosamente`);
      }
      
    } catch (error) {
      console.error('❌ Error al cargar metahumanos:', error);
      
      let mensajeError = 'Error al cargar los metahumanos.';
      if (error.code === 'ECONNREFUSED') {
        mensajeError += ' El backend no está disponible en http://localhost:3000';
      } else if (error.response?.status === 401) {
        mensajeError += ' No autorizado. Inicia sesión nuevamente.';
      } else if (error.response?.status === 500) {
        mensajeError += ' Error del servidor.';
      } else {
        mensajeError += ` ${error.message || 'Error desconocido'}`;
      }
      
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMetahumanos();
  }, []);

  // Manejar eliminación de metahumano
  const handleEliminar = async (id, tipo) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este metahumano?')) {
      return;
    }

    try {
      await eliminarUsuario(id, tipo);
      await cargarMetahumanos(); // Recargar la lista
      alert('Metahumano eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar metahumano:', error);
      alert('Error al eliminar el metahumano');
    }
  };

  // Manejar cambio de estado
  const handleCambiarEstado = async (id, tipo, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
      await cambiarEstadoUsuario(id, tipo, nuevoEstado);
      await cargarMetahumanos(); // Recargar la lista
      alert(`Estado cambiado a ${nuevoEstado} exitosamente`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado del metahumano');
    }
  };

  // Funciones auxiliares
  const obtenerNombreCompleto = (metahumano) => {
    return metahumano.alias ||
           metahumano._original?.alias ||
           metahumano._original?.nombre ||
           metahumano.nomMetahumano || 
           metahumano.nomPersonaje || 
           metahumano.nomHeroe || 
           metahumano.nomVillano || 
           metahumano.nomUsuario ||
           'Sin nombre';
  };

  // Filtrar metahumanos según búsqueda y filtro
  const metahumanosFiltrados = metahumanos.filter(metahumano => {
    const nombreCompleto = obtenerNombreCompleto(metahumano);
    
    const coincideBusqueda = !busqueda || 
      metahumano.nomUsuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
      nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideFiltro = filtro === 'todos' || 
      (filtro === 'activos' && metahumano.estado === 'ACTIVO') ||
      (filtro === 'inactivos' && metahumano.estado === 'INACTIVO');

    return coincideBusqueda && coincideFiltro;
  });

  if (loading) {
    return (
      <AdminLayout title="Gestionar Metahumanos">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-white">Cargando metahumanos...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestionar Metahumanos">
      <div className="space-y-6">
        {/* Header con estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1e293b] rounded-lg p-4 border border-slate-600">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">⚡</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Total Metahumanos</p>
                <p className="text-2xl font-bold text-white">{metahumanos.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg p-4 border border-slate-600">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">📱</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Inactivos</p>
                <p className="text-2xl font-bold text-white">
                  {metahumanos.filter(m => m.estado === 'INACTIVO').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg p-4 border border-slate-600">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Activos</p>
                <p className="text-2xl font-bold text-white">
                  {metahumanos.filter(m => m.estado === 'ACTIVO').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de filtrado */}
        <div className="bg-[#1e293b] rounded-lg p-6 border border-slate-600">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Buscador */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar metahumanos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="bg-[#334155] text-white px-4 py-2 rounded-lg pl-10 w-full md:w-80 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>

              {/* Filtros */}
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="bg-[#334155] text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              >
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
            </div>

            {/* Botón de recarga */}
            <button
              onClick={cargarMetahumanos}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <span className="mr-2">🔄</span>
              Actualizar
            </button>
          </div>
        </div>

        {/* Tabla de metahumanos */}
        <div className="bg-[#1e293b] rounded-lg border border-slate-600 overflow-hidden">
          <div className="p-6 border-b border-slate-600">
            <h3 className="text-lg font-semibold text-white">
              Lista de Metahumanos ({metahumanosFiltrados.length})
            </h3>
          </div>

          {error ? (
            <div className="p-6">
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-400 mr-3">⚠️</span>
                  <div>
                    <h4 className="font-medium text-red-400">Error al cargar metahumanos</h4>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : metahumanosFiltrados.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">
                {busqueda || filtro !== 'todos' 
                  ? 'No se encontraron metahumanos que coincidan con los filtros.' 
                  : 'No hay metahumanos registrados en el sistema.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#334155]">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-medium">Usuario</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Nombre Completo</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Estado</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {metahumanosFiltrados.map((metahumano, index) => {
                    const nombreCompleto = obtenerNombreCompleto(metahumano);
                    
                    return (
                      <tr key={metahumano.id || index} className="border-t border-slate-600 hover:bg-[#334155] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">⚡</span>
                            </div>
                            <div className="ml-3">
                              <p className="text-white font-medium">{metahumano.nomUsuario}</p>
                              <p className="text-gray-400 text-sm">ID: {metahumano.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-white">{nombreCompleto}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            metahumano.estado === 'ACTIVO' 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {metahumano.estado || 'ACTIVO'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCambiarEstado(metahumano.id, 'metahumano', metahumano.estado)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                metahumano.estado === 'ACTIVO'
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {metahumano.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => handleEliminar(metahumano.id, 'metahumano')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
