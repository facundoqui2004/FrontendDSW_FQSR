import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import Sidebar from '../components/shared/SidebarUser';
import { useAuth } from '../context/AuthContext';

export default function RegistroForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();
  const { signup, error, isAuthenticated, getHomeRouteByRole } = useAuth();
  const navigate = useNavigate();

  const password = watch('contrasena');
  
  useEffect(() => { 
    console.log('🔄 useEffect Register - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('✅ Usuario registrado y autenticado, obteniendo ruta...');
      const homeRoute = getHomeRouteByRole();
      console.log('🏠 Navegando a:', homeRoute);
      navigate(homeRoute);
    }
  }, [isAuthenticated, navigate, getHomeRouteByRole]);

  const onSubmit = async (data) => {
    console.log('🚀 Intentando registro con:', data);
    const result = await signup(data);
    console.log('📊 Resultado del registro:', result);
    
    if (result.success) {
      console.log('✅ Registro exitoso:', result.data);
      // El useEffect manejará la redirección automáticamente
    } else {
      console.error('❌ Error en registro:', result.error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar fijo */}
      <div className="fixed left-0 top-0 h-full z-20">
        <Sidebar />
      </div>
      
      {/* Contenido principal con offset para el sidebar */}
      <main className="ml-28 bg-[#262837] min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#1F1D2B] rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#ec7c6a] rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src="/Images/super-heroe.png"
                alt="Register"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Registro</h1>
            <p className="text-gray-400">Únete a El Súper Gestor</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                {...register('nomUsuario', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  }
                })}
                className={`w-full px-3 py-3 bg-[#262837] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] ${
                  errors.nomUsuario ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Ingresa tu nombre completo"
              />
              {errors.nomUsuario && (
                <p className="mt-1 text-sm text-red-400">{errors.nomUsuario.message}</p>
              )}
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register('mail', {
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Formato de correo electrónico inválido'
                  }
                })}
                className={`w-full px-3 py-3 bg-[#262837] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] ${
                  errors.mail ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="ejemplo@correo.com"
              />
              {errors.mail && (
                <p className="mt-1 text-sm text-red-400">{errors.mail.message}</p>
              )}
            </div>
            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register('contrasena', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
                className={`w-full px-3 py-3 bg-[#262837] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] ${
                  errors.contrasena ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Ingresa tu contraseña"
              />
              {errors.contrasena && (
                <p className="mt-1 text-sm text-red-400">{errors.contrasena.message}</p>
              )}
            </div>

            {/* Campo Confirmar Contraseña */}
            <div>
              <label htmlFor="passconf" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="passconf"
                type="password"
                {...register('passconf', {
                  required: 'La confirmación de contraseña es requerida',
                  validate: (value) => value === password || 'Las contraseñas no coinciden'
                })}
                className={`w-full px-3 py-3 bg-[#262837] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] ${
                  errors.passconf ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Confirma tu contraseña"
              />
              {errors.passconf && (
                <p className="mt-1 text-sm text-red-400">{errors.passconf.message}</p>
              )}
            </div>

            {/* Campo Role */}
            <div className="relative">
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de usuario
              </label>
              <select
                id="role"
                {...register('rol', {
                  required: 'Debes seleccionar un tipo de usuario'
                })}
                className={`w-full px-3 py-3 bg-[#262837] border rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] ${
                  errors.rol ? 'border-red-500' : 'border-gray-600'
                }`}
              >
                <option value="" className="bg-[#262837]">Selecciona tu tipo</option>
                <option value="BUROCRATA" className="bg-[#262837]">BURÓCRATA</option>
                <option value="METAHUMANO" className="bg-[#262837]">METAHUMANO</option>
              </select>
              <div className="pointer-events-none absolute bottom-3 right-3 flex items-center text-gray-400">
                ▼
              </div>
              {errors.rol && (
                <p className="mt-1 text-sm text-red-400">{errors.rol.message}</p>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-[#ec7c6a] text-white py-3 px-4 rounded-lg hover:bg-[#d66b59] focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] focus:ring-offset-2 transition duration-200 font-medium transform hover:scale-105 active:scale-95"
            >
              Crear Cuenta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="text-[#ec7c6a] hover:text-[#d66b59] font-medium">
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer normal (no fijo) */}
      <footer className="ml-28">
        <Footer />
      </footer>
    </div>
  );
}