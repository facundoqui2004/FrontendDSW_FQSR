import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import Footer from '../components/footer';
import Sidebar from '../components/shared/SidebarUser';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log('Datos del formulario:', data);
    // Aquí iría la lógica para enviar los datos al servidor
    alert('Login exitoso!');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar fijo */}
      <div className="fixed left-0 top-0 h-full z-20">
        <Sidebar />
      </div>
      
      {/* Contenido principal con offset para el sidebar */}
      <main className="bg-[#4d4963] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h1>
            <p className="text-gray-600">Ingresa a tu cuenta para continuar</p>
          </div>

          <div className="space-y-6">
            {/* Campo Usuario */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                {...register('usuario', {
                  required: 'El usuario es requerido',
                  minLength: {
                    value: 3,
                    message: 'El usuario debe tener al menos 3 caracteres'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.usuario ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu usuario"
              />
              {errors.usuario && (
                <p className="mt-1 text-sm text-red-600">{errors.usuario.message}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Enlace "¿Olvidaste tu contraseña?" */}
            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
            >
              Iniciar Sesión
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Registrarse
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer normal (no fijo) */}
      <footer className="">
        <Footer />
      </footer>
    </div>
  );
}


  "nomUsuario": "admin123",
  "contrasena": "supersegura",
  "rol": "admin",
  "idMeta": null,
  "idBurocrata": null
