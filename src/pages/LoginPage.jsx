import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/shared/SidebarUser";
import Footer from "../components/footer";

const LoginPage = ({ isOpen = true, onClose = () => {}, isModal = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isAuthenticated, getHomeRouteByRole, login, signup, error } = useAuth();
  const navigate = useNavigate();
  
  // Formularios separados para login y registro
  const loginForm = useForm({
    defaultValues: {
      nomUsuario: '', // Cambiado de email a nomUsuario para consistencia con backend
      password: ''
    }
  });

  const registerForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    }
  });

  // Seleccionar el formulario activo
  const activeForm = isLogin ? loginForm : registerForm;
  const { register, handleSubmit, formState: { errors } } = activeForm;

  // Redirigir si ya está autenticado
  useEffect(() => {
    console.log('🔄 useEffect - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('✅e Usuario autenticado, obteniendo ruta...');
      const homeRoute = getHomeRouteByRole();
      console.log('🏠 Navegando a:', homeRoute);
      navigate(homeRoute);
      if (isModal && onClose) {
        onClose(); // Cerrar el modal solo si es modal
      }
    }
  }, [isAuthenticated, navigate, getHomeRouteByRole, onClose, isModal]);

  const onSubmitLogin = async (data) => {
    console.log('🚀 Intentando login con:', data);
    const result = await login({
      nomUsuario: data.nomUsuario,
      contrasena: data.password
    });
    
    console.log('📊 Resultado del login:', result);
    
    if (result.success) {
      console.log('✅ Login exitoso:', result.data);
    } else {
      console.error('❌ Error en login:', result.error);
    }
  };

  const onSubmitRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError('confirmPassword', {
        type: 'manual',
        message: 'Las contraseñas no coinciden'
      });
      return;
    }
    
    const result = await signup({
      nomUsuario: data.name,
      mail: data.email,
      contrasena: data.password,
      rol: data.role
    });
    
    if (result.success) {
      console.log('Registro exitoso:', result.data);
    } else {
      console.error('Error en registro:', result.error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset ambos formularios
    loginForm.reset();
    registerForm.reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };
  

  if (!isOpen && isModal) return null;

  const containerClasses = isModal 
    ? "fixed inset-0 bg-transparent flex items-center justify-center z-50 transition-opacity duration-300"
    : "min-h-screen bg-[#262837] flex items-center justify-center p-4";

  const cardClasses = isModal
    ? "bg-[#1F1D2B] rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100"
    : "bg-[#1F1D2B] rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100";

  return (
    <div>
      {!isModal && <Sidebar showMenu={false} toggleUser={() => {}} />}
      
      <div className={containerClasses}>
        <div className={cardClasses}>
                {/* Header */}
                <div className="relative p-6 border-b border-gray-700">
                {isModal && (
                  <button
                      onClick={onClose}
                      className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                      <RiCloseFill size={24} />
                  </button>
                )}
                <div className="text-center">
                    <div className="w-16 h-16 bg-[#ec7c6a] rounded-full flex items-center justify-center mx-auto mb-4">
                        {isLogin ? (
                            <img
                                src="/Images/metahumano.png"
                                alt="Login"
                                className="w-10 h-10 object-contain"
                            />
                        ) : (
                            <img
                                src="/Images/super-heroe.png"
                                alt="Register"
                                className="w-10 h-10 object-contain"
                            />
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
                <form onSubmit={handleSubmit(isLogin ? onSubmitLogin : onSubmitRegister)} className="p-6 space-y-4">
                
                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                
                {/* Name field - solo para register */}
                {!isLogin && (
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            {...register('name', {
                                required: !isLogin ? 'El nombre es requerido' : false,
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

                {/* Email/Username field */}
                <div className="relative">
                    {isLogin ? 
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} /> :
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    }
                    <input
                        type="text"
                        {...register(isLogin ? 'nomUsuario' : 'email', {
                            required: isLogin ? 'El nombre de usuario es requerido' : 'El correo electrónico es requerido',
                            ...(isLogin ? {} : {
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Formato de correo electrónico inválido'
                                }
                            })
                        })}
                        placeholder={isLogin ? "Nombre de usuario" : "Correo electrónico"}
                        className="w-full pl-10 pr-4 py-3 bg-[#262837] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ec7c6a] focus:ring-2 focus:ring-[#ec7c6a] focus:ring-opacity-50 transition-all duration-200"
                    />
                    {(errors.nomUsuario || errors.email) && (
                        <p className="mt-1 text-sm text-red-400">{errors.nomUsuario?.message || errors.email?.message}</p>
                    )}
                </div>

                {/* Password field */}
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

                {/* Confirm Password field - solo para register */}
                {!isLogin && (
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register('confirmPassword', {
                                required: !isLogin ? 'Confirma tu contraseña' : false,
                                validate: (value) => {
                                    if (!isLogin) {
                                        const password = registerForm.getValues('password');
                                        return value === password || 'Las contraseñas no coinciden';
                                    }
                                    return true;
                                }
                            })}
                            placeholder="Confirmar contraseña"
                            className="w-full pl-10 pr-12 py-3 bg-[#262837] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ec7c6a] focus:ring-2 focus:ring-[#ec7c6a] focus:ring-opacity-50 transition-all duration-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                )}

                {/* Role select - solo para register */}
                {!isLogin && (
                    <div className="relative">
                        <select
                            {...register('role', {
                                required: !isLogin ? 'Selecciona un tipo de usuario' : false
                            })}
                            className="w-full pl-4 pr-4 py-3 bg-[#262837] border border-gray-600 rounded-lg text-white appearance-none placeholder-gray-400 focus:outline-none focus:border-[#ec7c6a] focus:ring-2 focus:ring-[#ec7c6a] focus:ring-opacity-50 transition-all duration-200"
                        >
                            <option value="" disabled>Selecciona tu tipo</option>
                            <option value="BUROCRATA">BUROCRAT</option>
                            <option value="METAHUMANO">METAHUMANO</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                            ▼
                        </div>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
                        )}
                    </div>
                )}

                {/* Forgot password - solo para login */}
                {isLogin && (
                    <div className="text-right">
                        <a href="#" className="text-[#ec7c6a] text-sm hover:underline transition-all duration-200">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-[#ec7c6a] text-white py-3 rounded-lg font-medium hover:bg-[#d66b59] focus:outline-none focus:ring-2 focus:ring-[#ec7c6a] focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </button>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 text-center">
                <p className="text-gray-400 text-sm">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button
                    onClick={toggleMode}
                    className="text-[#ec7c6a] ml-2 hover:underline transition-all duration-200"
                    >
                    {isLogin ? 'Crear una cuenta' : 'Iniciar sesión'}
                    </button>
                </p>
                </div>

                {/* Social login */}
                <div className="p-6 pt-0">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#1F1D2B] text-gray-400">O continúa con</span>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg bg-[#262837] text-white hover:bg-[#2d3748] transition-colors duration-200">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-2 text-sm">Google</span>
                    </button>
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg bg-[#262837] text-white hover:bg-[#2d3748] transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="ml-2 text-sm">Facebook</span>
                    </button>
                </div>
                </div>
            </div>
            </div>
            
      {!isModal && (
        <footer className="mt-8">
          <Footer />
        </footer>
      )}
    </div>
  );
};

export default LoginPage;