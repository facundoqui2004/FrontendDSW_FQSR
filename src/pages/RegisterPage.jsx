import React from 'react';
import { useForm } from 'react-hook-form';
import Footer from '../components/footer';
import Sidebar from '../components/shared/SidebarUser';
import { registerRequest } from '../api/auth';

export default function RegistroForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

const password = watch('contrasena');

  const onSubmit = async (data) => {
    const res = await registerRequest(data);
    console.log('Respuesta del servidor:', res.data);
    // Aquí iría la lógica para enviar los datos al servidor
    alert('Registro exitoso!');
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar fijo */}
      <div className="fixed left-0 top-0 h-full z-20">
        <Sidebar />
      </div>
      
      {/* Contenido principal con offset para el sidebar */}
      <main className=" bg-[#4d4963] from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Registro</h1>
            <p className="text-gray-600">Crea tu cuenta para continuar</p>
          </div>

          <div className="space-y-6">
            {/* Campo Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu nombre completo"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu contraseña"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Campo Confirmar Contraseña */}
            <div>
              <label htmlFor="passconf" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="passconf"
                type="password"
                {...register('passconf', {
                  required: 'La confirmación de contraseña es requerida',
                  validate: (value) => value === password || 'Las contraseñas no coinciden'
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.passconf ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirma tu contraseña"
              />
              {errors.passconf && (
                <p className="mt-1 text-sm text-red-600">{errors.passconf.message}</p>
              )}
            </div>

            {/* Campo Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                id="role"
                {...register('rol', {
                  required: 'Debes seleccionar un rol'
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona un rol</option>
                <option value="BUROCRATA">BURÓCRATA</option>
                <option value="METAHUMANO">METAHUMANO</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
            >
              Registrarse
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Iniciar sesión
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