import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { obtenerTodosLosUsuarios, obtenerTodosLosUsuariosCombinados, eliminarUsuario, cambiarEstadoUsuario } from '../../api/usuarios';

export default function GestionarBurocratas() {
  const [burocratas, setBurocratas] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar burócratas del backend
  const cargarBurocratas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Cargando burócratas desde endpoints disponibles...');
      
      // Usar la función combinada y filtrar solo burócratas
      const response = await obtenerTodosLosUsuariosCombinados();
      console.log('✅ Usuarios obtenidos:', response.data);
      
      const usuariosData = response.data || [];
      
      // Filtrar solo burócratas
      const burocratazData = usuariosData.filter(usuario => usuario.rol === 'BUROCRATA');
      
      if (burocratazData.length === 0) {
        setError('No se encontraron burócratas en el sistema.');
      } else {
        setBurocratas(burocratazData);
        console.log(`🎉 Se cargaron ${burocratazData.length} burócratas exitosamente`);
      }
      
    } catch (error) {
      console.error('❌ Error al cargar burócratas:', error);
      
      let mensajeError = 'Error al cargar los burócratas.';
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
    cargarBurocratas();
  }, []);

  // Manejar eliminación de burócrata
  const handleEliminar = async (id, tipo) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este burócrata?')) {
      return;
    }

    try {
      await eliminarUsuario(id, tipo);
      await cargarBurocratas(); // Recargar la lista
      alert('Burócrata eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar burócrata:', error);
      alert('Error al eliminar el burócrata');
    }
  };

  // Manejar cambio de estado
  const handleCambiarEstado = async (id, tipo, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
      await cambiarEstadoUsuario(id, tipo, nuevoEstado);
      await cargarBurocratas(); // Recargar la lista
      alert(`Estado cambiado a ${nuevoEstado} exitosamente`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado del burócrata');
    }
  };

  // Filtrar burócratas según búsqueda y filtro
  const burocratazFiltrados = burocratas.filter(burocrata => {
    const coincideBusqueda = !busqueda || 
      burocrata.nomUsuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
      burocrata.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      burocrata.nomBurocrata?.toLowerCase().includes(busqueda.toLowerCase()) ||
      burocrata.departamento?.toLowerCase().includes(busqueda.toLowerCase()) ||
      burocrata.cargo?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideFiltro = filtro === 'todos' || 
      (filtro === 'activos' && burocrata.estado === 'ACTIVO') ||
      (filtro === 'inactivos' && burocrata.estado === 'INACTIVO') ||
      (filtro === 'supervisores' && burocrata.cargo?.toLowerCase().includes('supervisor')) ||
      (filtro === 'empleados' && !burocrata.cargo?.toLowerCase().includes('supervisor'));

    return coincideBusqueda && coincideFiltro;
  });

  const obtenerNombreCompleto = (burocrata) => {
    return burocrata.nomBurocrata || burocrata.nomUsuario || 'Sin nombre';
  };

  const obtenerDepartamento = (burocrata) => {
    return burocrata.departamento || 'Sin departamento';
  };

  const obtenerCargo = (burocrata) => {
    return burocrata.cargo || 'Sin cargo';
  };

  const obtenerIconoDepartamento = (departamento) => {
    const dept = departamento?.toLowerCase();
    if (dept?.includes('admin')) return '👨‍💼';
    if (dept?.includes('legal')) return '⚖️';
    if (dept?.includes('registro')) return '📋';
    if (dept?.includes('licencia')) return '📄';
    if (dept?.includes('tramite')) return '📝';
    return '🏢';
  };

  const obtenerColorCargo = (cargo) => {
    if (cargo?.toLowerCase().includes('supervisor') || cargo?.toLowerCase().includes('jefe')) {
      return 'text-yellow-400';
    }
    if (cargo?.toLowerCase().includes('coordinador')) {
      return 'text-green-400';
    }
    return 'text-blue-400';
  };

  if (loading) {
    return (
      <AdminLayout title="Gestionar Burócratas">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-white">Cargando burócratas...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestionar Burócratas">
      <div className="space-y-6">
        {/* Header con estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1e293b] rounded-lg p-4 border border-slate-600">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🏢</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Total Burócratas</p>
                <p className="text-2xl font-bold text-white">{burocratas.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg p-4 border border-slate-600">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">👨‍💼</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Supervisores</p>
                <p className="text-2xl font-bold text-white">
                  {burocratas.filter(b => obtenerCargo(b).toLowerCase().includes('supervisor')).length}
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
                  {burocratas.filter(b => b.estado === 'ACTIVO').length}
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
                  placeholder="Buscar burócratas..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="bg-[#334155] text-white px-4 py-2 rounded-lg pl-10 w-full md:w-80 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>

              {/* Filtros */}
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="bg-[#334155] text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
                <option value="supervisores">Supervisores</option>
                <option value="empleados">Empleados</option>
              </select>
            </div>

            {/* Botón de recarga */}
            <button
              onClick={cargarBurocratas}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <span className="mr-2">🔄</span>
              Actualizar
            </button>
          </div>
        </div>

        {/* Tabla de burócratas */}
        <div className="bg-[#1e293b] rounded-lg border border-slate-600 overflow-hidden">
          <div className="p-6 border-b border-slate-600">
            <h3 className="text-lg font-semibold text-white">
              Lista de Burócratas ({burocratazFiltrados.length})
            </h3>
          </div>

          {error ? (
            <div className="p-6">
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-400 mr-3">⚠️</span>
                  <div>
                    <h4 className="font-medium text-red-400">Error al cargar burócratas</h4>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : burocratazFiltrados.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">
                {busqueda || filtro !== 'todos' 
                  ? 'No se encontraron burócratas que coincidan con los filtros.' 
                  : 'No hay burócratas registrados en el sistema.'
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
                    <th className="text-left p-4 text-gray-300 font-medium">Departamento</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Cargo</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Email</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Estado</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {burocratazFiltrados.map((burocrata, index) => {
                    const departamento = obtenerDepartamento(burocrata);
                    const cargo = obtenerCargo(burocrata);
                    return (
                      <tr key={burocrata.id || index} className="border-t border-slate-600 hover:bg-[#334155] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {obtenerIconoDepartamento(departamento)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-white font-medium">{burocrata.nomUsuario}</p>
                              <p className="text-gray-400 text-sm">ID: {burocrata.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-white">{obtenerNombreCompleto(burocrata)}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-300">{departamento}</p>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium ${obtenerColorCargo(cargo)}`}>
                            {cargo}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-300">{burocrata.email}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            burocrata.estado === 'ACTIVO' 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {burocrata.estado || 'ACTIVO'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCambiarEstado(burocrata.id, 'burocrata', burocrata.estado)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                burocrata.estado === 'ACTIVO'
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {burocrata.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => handleEliminar(burocrata.id, 'burocrata')}
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
