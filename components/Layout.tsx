import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { DEFAULT_THEME, APP_NAME } from '../constants';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/', icon: Icons.Dashboard, label: 'Dashboard' },
    { path: '/reservations', icon: Icons.Reservation, label: 'Reservas' },
    { path: '/packages', icon: Icons.Package, label: 'Paquetes' },
    { path: '/clients', icon: Icons.Users, label: 'Clientes' },
    { path: '/employees', icon: Icons.Employee, label: 'Empleados' },
    { path: '/providers', icon: Icons.Provider, label: 'Proveedores' },
    { path: '/users', icon: Icons.User, label: 'Usuarios Sistema' },
  ].filter(item => {
    if (item.path === '/users' && user?.role !== UserRole.ADMIN) return false;
    return true;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${DEFAULT_THEME.sidebarColor} transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl z-20`}>
        <div className="h-20 flex items-center justify-center border-b border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-2xl font-serif font-bold tracking-wider text-amber-500">
              {APP_NAME.split(' ')[0]} <span className="text-white">{APP_NAME.split(' ')[1]}</span>
            </h1>
          ) : (
            <span className="text-2xl font-serif font-bold text-amber-500">M</span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200
                      ${isActive
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    <item.icon size={20} className="min-w-[20px]" />
                    {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              {user?.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`mt-4 flex items-center w-full p-2 rounded-md text-red-400 hover:bg-red-900/20 transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <Icons.Logout size={18} />
            {sidebarOpen && <span className="ml-2 text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white shadow-sm z-10 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-800">
            <Icons.Menu />
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
          {/* Background decorative element */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none -z-10" />
          {children}
        </main>
      </div>
    </div>
  );
};
