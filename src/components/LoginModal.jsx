import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, user, getHomeRouteByRole, login, signup, error } = useAuth();
  const navigate = useNavigate();
  
  // Formularios separados para login y registro
  const loginForm = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const registerForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'METAHUMANO'
    }
  });

  // Seleccionar el formulario activo
  const activeForm = isLogin ? loginForm : registerForm;
  const { register, handleSubmit, formState: { errors }, reset } = activeForm;

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ Usuario autenticado en LoginModal, redirigiendo...');
      console.log('👤 Datos del usuario:', user);
      console.log('🎭 Rol del usuario:', user.rol);
      const homeRoute = getHomeRouteByRole();
      console.log('🏠 Ruta de destino:', homeRoute);
      navigate(homeRoute);
      onClose(); // Cerrar modal
    }
  }, [isAuthenticated, user, navigate, getHomeRouteByRole, onClose]);

  const onSubmitLogin = async (data) => {
    console.log('🚀 LoginModal - Intentando login con:', data);
    const result = await login({
      email: data.email,
      password: data.password
    });
    
    console.log('📊 LoginModal - Resultado del login:', result);
    
    if (result.success) {
      console.log('✅ LoginModal - Login exitoso:', result.data);
      console.log('🎭 LoginModal - Rol asignado:', result.data?.rol);
    } else {
      console.error('❌ LoginModal - Error en login:', result.error);
    }
  };

  const onSubmitRegister = async (data) => {
    console.log('🚀 LoginModal - Intentando registro con:', data);
    
    // Preparar datos para el backend
    const backendData = {
      email: data.email,
      telefono: "+1-555-0000", // Valor por defecto
      password: data.password,
      nombre: data.name,
      alias: data.name,
      origen: "Registro Web"
    };
    
    const userType = data.role === 'METAHUMANO' ? 'metahumano' : 'burocrata';
    console.log('👤 LoginModal - Tipo de usuario seleccionado:', userType);
    console.log('📦 LoginModal - Datos para backend:', backendData);
    
    const result = await signup(backendData, userType);
    
    console.log('📊 LoginModal - Resultado del registro:', result);
    
    if (result.success) {
      console.log('✅ LoginModal - Registro exitoso, ahora haciendo login...');
      console.log('🎭 LoginModal - Datos del usuario registrado:', result.data);
      // Hacer login automático
      await onSubmitLogin({ email: data.email, password: data.password });
    } else {
      console.error('❌ LoginModal - Error en registro:', result.error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    loginForm.reset();
    registerForm.reset();
    setShowPassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1F1D2B] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700 animate-slideUp">
        
        {/* Header */}
        <div className="relative p-6 border-b border-gray-700">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
          >
            <RiCloseFill />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-[#ec7c6a] rounded-full flex items-center justify-center mx-auto mb-4">
              {isLogin ? (
                <FaSignInAlt className="text-white text-2xl" />
              ) : (
                <FaUserPlus className="text-white text-2xl" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Accede a tu cuenta' : 'Únete a El Súper Gestor'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit(isLogin ? onSubmitLogin : onSubmitRegister)} 
          className="p-6 space-y-4"
        >
          
          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-900 bg-opacity-50 border border-red-500 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Nombre - solo para registro */}
          {!isLogin && (
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                {...register('name', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  }
                })}
                placeholder="Nombre completo"
                className="w-full pl-10 pr-4 py-3 bg-[#262837] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ec7c6a] focus:ring-2 focus:ring-[#ec7c6a] focus:ring-opacity-50 transition-all duration-200"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              {...register('email', {
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Formato de correo electrónico inválido'
                }
              })}
              placeholder="Correo electrónico"
              className="w-full pl-10 pr-4 py-3 bg-[#262837] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ec7c6a] focus:ring-2 focus:ring-[#ec7c6a] focus:ring-opacity-50 transition-all duration-200"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
              placeholder="Contraseña"
              className="w-full pl-10 pr-12 py-3 bg-[#262837] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ec7c6a] focus:ring-2 focus:ring-[#ec7c6a] focus:ring-opacity-50 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Rol - solo para registro */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de usuario
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('role')}
                    value="METAHUMANO"
                    className="sr-only"
                  />
                  <div className="w-full p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-[#ec7c6a] transition-colors duration-200 text-center">
                    <div className="text-2xl mb-1">🦸‍♂️</div>
                    <div className="text-sm text-white">Metahumano</div>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('role')}
                    value="BUROCRATA"
                    className="sr-only"
                  />
                  <div className="w-full p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-[#0891b2] transition-colors duration-200 text-center">
                    <div className="text-2xl mb-1">📋</div>
                    <div className="text-sm text-white">Burócrata</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#ec7c6a] text-white py-3 px-4 rounded-lg hover:bg-[#d66b59] focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] focus:ring-offset-2 transition duration-200 font-medium"
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>

          {/* Toggle Mode */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-gray-400 hover:text-[#ec7c6a] transition-colors duration-200"
            >
              {isLogin 
                ? '¿No tienes cuenta? Crear una nueva' 
                : '¿Ya tienes cuenta? Iniciar sesión'
              }
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
