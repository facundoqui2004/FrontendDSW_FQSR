import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import Sidebar from '../components/shared/SidebarUser';
import { useAuth } from '../context/AuthContext';

export default function LoginPageStandalone() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const { login, error, isAuthenticated, getHomeRouteByRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const homeRoute = getHomeRouteByRole();
      navigate(homeRoute);
    }
  }, [isAuthenticated, navigate, getHomeRouteByRole]);

  const onSubmit = async (data) => {
    const result = await login({
      nomUsuario: data.nomUsuario, // Cambiar para usar nomUsuario
      contrasena: data.password // Cambiar para usar contrasena
    });
    if (result.success) {
      console.log('¡Inicio de sesión exitoso!');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar fijo */}
      <div className="fixed left-0 top-0 h-full z-20">
        <Sidebar showMenu={false} toggleUser={() => {}} />
      </div>
      
      {/* Contenido principal con offset para el sidebar */}
      <main className="bg-[#262837] min-h-screen flex items-center justify-center p-4 ml-28">
        <div className="bg-[#1F1D2B] rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#ec7c6a] rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src="/Images/metahumano.png"
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
            <p className="text-gray-400">Ingresa a tu cuenta de El Súper Gestor</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Username */}
            <div>
              <label htmlFor="nomUsuario" className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de usuario
              </label>
              <input
                id="nomUsuario"
                type="text"
                {...register('nomUsuario', {
                  required: 'El nombre de usuario es requerido',
                  minLength: {
                    value: 3,
                    message: 'El nombre de usuario debe tener al menos 3 caracteres'
                  }
                })}
                className={`w-full px-3 py-3 bg-[#262837] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] ${
                  errors.nomUsuario ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Ingresa tu nombre de usuario"
              />
              {errors.nomUsuario && (
                <p className="mt-1 text-sm text-red-400">{errors.nomUsuario.message}</p>
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
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
                className={`w-full px-3 py-3 bg-[#262837] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Ingresa tu contraseña"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-[#ec7c6a] text-white py-3 px-4 rounded-lg hover:bg-[#d66b59] focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] focus:ring-offset-2 transition duration-200 font-medium transform hover:scale-105 active:scale-95"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              ¿Olvidaste tu contraseña?{' '}
              <a href="#" className="text-[#ec7c6a] hover:text-[#d66b59] font-medium">
                Recuperar contraseña
              </a>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              ¿No tienes una cuenta?{' '}
              <a href="#" className="text-[#ec7c6a] hover:text-[#d66b59] font-medium">
                Registrarse
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
