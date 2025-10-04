import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';

const Tramites = () => {
  const navigate = useNavigate();

  const tramiteCards = [
    {
      id: 1,
      title: 'Crear Poderes',
      description: 'Crear y gestionar nuevos poderes para metahumanos',
      icon: '⚡',
      route: '/admin/tramites/crear-poderes',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      available: true
    },
    {
      id: 2,
      title: 'Gestionar Poderes',
      description: 'Administrar, editar y eliminar poderes existentes',
      icon: '🎯',
      route: '/admin/tramites/gestionar-poderes',
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-600',
      available: true
    },
    {
      id: 3,
      title: 'Aprobar/Rechazar Trámites',
      description: 'Revisar y gestionar solicitudes pendientes',
      icon: '📋',
      route: '#',
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      available: false
    }
  ];

  const handleCardClick = (card) => {
    if (card.available) {
      navigate(card.route);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Gestión de Trámites
          </h1>
          <p className="text-lg text-gray-300">
            Administra todos los trámites y procesos del sistema
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tramiteCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`
                relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer
                ${card.bgColor} ${card.hoverColor}
                ${!card.available ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {/* Card Content */}
              <div className="p-6 text-white relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{card.icon}</div>
                  {!card.available && (
                    <div className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                      En construcción
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-[#1e293b] rounded-xl shadow-sm p-6 border border-slate-600">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Información del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-300">Funcionalidades Disponibles</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Crear nuevos poderes
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Gestionar poderes existentes (editar/eliminar)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Asignar poderes a metahumanos
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-300">Próximamente</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">⏳</span>
                  Aprobación de trámites
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">⏳</span>
                  Sistema de notificaciones
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Tramites;
