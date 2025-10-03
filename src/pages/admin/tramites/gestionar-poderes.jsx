import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { getPoderes, createPoder, updatePoder, deletePoder } from '../../../api/poderes';

const GestionarPoderes = () => {
  const navigate = useNavigate();
  const [poderes, setPoderes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [selectedPoder, setSelectedPoder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPoderes, setLoadingPoderes] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [formData, setFormData] = useState({
    nomPoder: '',
    descPoder: '',
    categoria: '',
    debilidad: '',
    descDebilidad: '',
    costoMulta: 0
  });

  const categorias = [
    { value: 'Físico', label: 'Físico', icon: '💪', color: 'from-green-500 to-emerald-600' },
    { value: 'Mental', label: 'Mental', icon: '🧠', color: 'from-blue-500 to-cyan-600' },
    { value: 'Elemental', label: 'Elemental', icon: '🔥', color: 'from-orange-500 to-red-600' },
    { value: 'Tecnológico', label: 'Tecnológico', icon: '🤖', color: 'from-gray-500 to-slate-600' },
    { value: 'Mágico', label: 'Mágico', icon: '✨', color: 'from-purple-500 to-pink-600' },
    { value: 'Psíquico', label: 'Psíquico', icon: '🔮', color: 'from-violet-500 to-purple-600' },
    { value: 'Temporal', label: 'Temporal', icon: '⏰', color: 'from-indigo-500 to-blue-600' },
    { value: 'Espacial', label: 'Espacial', icon: '🌌', color: 'from-pink-500 to-rose-600' },
    { value: 'Otro', label: 'Otro', icon: '⚡', color: 'from-yellow-500 to-amber-600' }
  ];

  // Cargar poderes
  useEffect(() => {
    cargarPoderes();
  }, []);

  const cargarPoderes = async () => {
    try {
      setLoadingPoderes(true);
      const response = await getPoderes();
      setPoderes(response.data || response || []);
      console.log('✅ Poderes cargados:', response.data || response);
    } catch (error) {
      console.error('❌ Error al cargar poderes:', error);
      alert('Error al cargar los poderes. Verifica que el backend esté disponible.');
    } finally {
      setLoadingPoderes(false);
    }
  };

  const getCategoriaInfo = (categoriaValue) => {
    return categorias.find(c => c.value === categoriaValue) || categorias[categorias.length - 1];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'costoMulta' ? parseFloat(value) || 0 : value
    }));
  };

  const handleOpenModal = (mode, poder = null) => {
    setModalMode(mode);
    if (mode === 'edit' && poder) {
      setSelectedPoder(poder);
      setFormData({
        nomPoder: poder.nomPoder || '',
        descPoder: poder.descPoder || '',
        categoria: poder.categoria || '',
        debilidad: poder.debilidad || '',
        descDebilidad: poder.descDebilidad || '',
        costoMulta: poder.costoMulta || 0
      });
    } else {
      setSelectedPoder(null);
      setFormData({
        nomPoder: '',
        descPoder: '',
        categoria: '',
        debilidad: '',
        descDebilidad: '',
        costoMulta: 0
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPoder(null);
    setFormData({
      nomPoder: '',
      descPoder: '',
      categoria: '',
      debilidad: '',
      descDebilidad: '',
      costoMulta: 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const poderData = {
        nomPoder: formData.nomPoder.trim(),
        descPoder: formData.descPoder.trim(),
        categoria: formData.categoria,
        debilidad: formData.debilidad.trim(),
        descDebilidad: formData.descDebilidad.trim(),
        costoMulta: parseFloat(formData.costoMulta) || 0
      };

      if (modalMode === 'create') {
        const response = await createPoder(poderData);
        setPoderes(prev => [...prev, response.data || response]);
        alert('✅ Poder creado exitosamente');
      } else {
        const response = await updatePoder(selectedPoder.id, poderData);
        setPoderes(prev => prev.map(p => p.id === selectedPoder.id ? (response.data || response) : p));
        alert('✅ Poder actualizado exitosamente');
      }

      handleCloseModal();
      await cargarPoderes();
    } catch (error) {
      console.error('❌ Error al guardar poder:', error);
      alert(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} el poder: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (poder) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el poder "${poder.nomPoder}"?`)) {
      try {
        await deletePoder(poder.id);
        setPoderes(prev => prev.filter(p => p.id !== poder.id));
        alert('✅ Poder eliminado exitosamente');
      } catch (error) {
        console.error('❌ Error al eliminar poder:', error);
        alert('Error al eliminar el poder: ' + error.message);
      }
    }
  };

  // Filtrar poderes
  const poderesFiltrados = poderes.filter(poder => {
    const coincideBusqueda = !busqueda || 
      poder.nomPoder?.toLowerCase().includes(busqueda.toLowerCase()) ||
      poder.descPoder?.toLowerCase().includes(busqueda.toLowerCase()) ||
      poder.debilidad?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria = filtroCategoria === 'todos' || poder.categoria === filtroCategoria;

    return coincideBusqueda && coincideCategoria;
  });

  // Estadísticas
  const totalPoderes = poderes.length;
  const poderesPorCategoria = categorias.map(cat => ({
    ...cat,
    count: poderes.filter(p => p.categoria === cat.value).length
  }));

  return (
    <AdminLayout title="Gestionar Poderes">
      <div className="space-y-6">
        {/* Header con botones de acción */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Gestión de Poderes Metahumanos</h2>
            <p className="text-gray-400">Crea, edita y administra todos los poderes del sistema</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/tramites')}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>←</span>
              Volver
            </button>
            <button
              onClick={cargarPoderes}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🔄</span>
              Refrescar
            </button>
            <button
              onClick={() => handleOpenModal('create')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg"
            >
              <span className="text-xl">⚡</span>
              Crear Poder
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Poderes</p>
                <p className="text-3xl font-bold text-white mt-1">{totalPoderes}</p>
              </div>
              <div className="text-4xl opacity-80">⚡</div>
            </div>
          </div>

          {poderesPorCategoria.slice(0, 4).map((cat) => (
            <div 
              key={cat.value} 
              className={`bg-gradient-to-br ${cat.color} rounded-xl p-4 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm font-medium">{cat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{cat.count}</p>
                </div>
                <div className="text-4xl opacity-80">{cat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-600">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Buscar por nombre, descripción o debilidad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#334155] border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <span className="absolute left-3 top-3.5 text-gray-400 text-xl">🔍</span>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="flex-1 md:flex-none px-4 py-3 bg-[#334155] border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="todos">Todas las Categorías</option>
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 px-4 py-3 bg-[#334155] border border-slate-600 rounded-lg">
                <span className="text-gray-400 text-sm">Resultados:</span>
                <span className="text-white font-bold">{poderesFiltrados.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Poderes */}
        <div className="bg-[#1e293b] rounded-xl border border-slate-600 overflow-hidden">
          <div className="p-6 border-b border-slate-600 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span>📋</span>
              Lista de Poderes ({poderesFiltrados.length})
            </h3>
          </div>

          {loadingPoderes ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Cargando poderes...</p>
            </div>
          ) : poderesFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl block mb-4">⚡</span>
              <h3 className="text-xl font-medium text-white mb-2">
                {busqueda || filtroCategoria !== 'todos' 
                  ? 'No se encontraron poderes' 
                  : 'No hay poderes registrados'}
              </h3>
              <p className="text-gray-400 mb-6">
                {busqueda || filtroCategoria !== 'todos'
                  ? 'Intenta con otros filtros de búsqueda'
                  : 'Comienza creando tu primer poder'}
              </p>
              {!busqueda && filtroCategoria === 'todos' && (
                <button
                  onClick={() => handleOpenModal('create')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all transform hover:scale-105 inline-flex items-center gap-2 font-medium"
                >
                  <span className="text-xl">⚡</span>
                  Crear Primer Poder
                </button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {poderesFiltrados.map((poder) => {
                  const categoriaInfo = getCategoriaInfo(poder.categoria);
                  return (
                    <div 
                      key={poder.id} 
                      className="bg-[#334155] rounded-xl border border-slate-600 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                      {/* Header con gradiente */}
                      <div className={`bg-gradient-to-r ${categoriaInfo.color} p-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{categoriaInfo.icon}</span>
                            <div>
                              <h4 className="font-bold text-white text-lg">{poder.nomPoder}</h4>
                              <span className="text-white/80 text-sm">{poder.categoria}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-1 font-medium">DESCRIPCIÓN</p>
                          <p className="text-gray-300 text-sm line-clamp-3">{poder.descPoder}</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1 font-medium">DEBILIDAD</p>
                          <p className="text-red-400 text-sm font-medium">{poder.debilidad}</p>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{poder.descDebilidad}</p>
                        </div>

                        {poder.costoMulta > 0 && (
                          <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-2">
                            <span className="text-yellow-400">💰</span>
                            <span className="text-yellow-300 text-sm font-medium">
                              Costo Multa: ${poder.costoMulta}
                            </span>
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleOpenModal('edit', poder)}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <span>✏️</span>
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(poder)}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <span>🗑️</span>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Crear/Editar Poder */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-2xl border-2 border-slate-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header del Modal */}
            <div className={`bg-gradient-to-r ${modalMode === 'create' ? 'from-purple-600 to-pink-600' : 'from-blue-600 to-cyan-600'} p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{modalMode === 'create' ? '⚡' : '✏️'}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {modalMode === 'create' ? 'Crear Nuevo Poder' : 'Editar Poder'}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {modalMode === 'create' 
                        ? 'Completa la información del nuevo poder' 
                        : `Modificando: ${selectedPoder?.nomPoder}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white/80 hover:text-white text-3xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Nombre del Poder */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Poder <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="nomPoder"
                  value={formData.nomPoder}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Super Velocidad, Telequinesis, Invisibilidad..."
                  className="w-full px-4 py-3 bg-[#334155] border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción del Poder <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="descPoder"
                  value={formData.descPoder}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe detalladamente las capacidades, alcance y limitaciones del poder..."
                  className="w-full px-4 py-3 bg-[#334155] border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categorias.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, categoria: cat.value }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.categoria === cat.value
                          ? `bg-gradient-to-r ${cat.color} border-white text-white`
                          : 'bg-[#334155] border-slate-600 text-gray-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-medium">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Debilidad */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Debilidad <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="debilidad"
                  value={formData.debilidad}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Kriptonita, Agua, Oscuridad total..."
                  className="w-full px-4 py-3 bg-[#334155] border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Descripción de la Debilidad */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción de la Debilidad <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="descDebilidad"
                  value={formData.descDebilidad}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Explica cómo esta debilidad afecta o neutraliza el poder..."
                  className="w-full px-4 py-3 bg-[#334155] border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Costo de Multa */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Costo de Multa (Opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-yellow-400 font-bold">$</span>
                  <input
                    type="number"
                    name="costoMulta"
                    value={formData.costoMulta}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-[#334155] border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  💡 Costo asociado por uso indebido o descontrolado del poder
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    modalMode === 'create'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Guardando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {modalMode === 'create' ? '⚡ Crear Poder' : '✏️ Actualizar Poder'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GestionarPoderes;
