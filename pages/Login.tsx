import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { db } from '../services/backend-db';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        const user = await db.register(name, email, password, adminPassword);
        if (user) {
          // Register sets the token automatically
          await login(email, password); // Optional: ensure context is updated if register doesn't trigger context update
          // Actually, db.register sets token in localStorage, but AuthContext might need to be notified or reload.
          // Let's look at AuthContext. It reads from localStorage on mount.
          // But login() updates the state.
          // We should probably just use the login function from context if we want to update state, 
          // OR update AuthContext to expose a register function.
          // For now, let's just call login() after register to be safe and update context state.
          navigate('/');
        } else {
          setError('Error al registrar usuario.');
        }
      } else {
        const success = await login(email, password);
        if (success) {
          navigate('/');
        } else {
          setError('Credenciales inválidas.');
        }
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}>

      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/95 rounded-2xl shadow-2xl border border-white/20 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-800 mb-2">Muhu Travel</h1>
          <p className="text-slate-500">Gestión Turística de Excelencia</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center">
            <span className="mr-2">⚠</span> {error}
          </div>
        )}

        {!isRegistering && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
            <p className="font-bold mb-2 text-center border-b border-blue-200 pb-1">Credenciales de Prueba</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-bold text-indigo-700">Admin:</p>
                <p>admin@muhu.com</p>
                <p className="font-mono text-gray-600">admin123</p>
              </div>
              <div>
                <p className="font-bold text-indigo-700">Agente:</p>
                <p>agente@muhu.com</p>
                <p className="font-mono text-gray-600">agent123</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <Icons.User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Tu nombre"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Icons.Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <Icons.Logout className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña de Administrador</label>
              <div className="relative">
                <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Autorización Admin"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Se requiere autorización de un administrador para crear cuentas.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-medium rounded-lg shadow-lg transform transition-all active:scale-95 flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              {isRegistering ? 'Inicia Sesión' : 'Regístrate aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
