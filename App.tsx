import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import { ReservationWizard } from './pages/Reservations/ReservationWizard';
import { EntityManager } from './pages/EntityManager';
import { ReservationList } from './pages/Reservations/ReservationList';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === UserRole.ADMIN ? <>{children}</> : <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Reservations */}
          <Route path="/reservations" element={<ProtectedRoute><ReservationList /></ProtectedRoute>} />
          <Route path="/reservations/new" element={<ProtectedRoute><ReservationWizard /></ProtectedRoute>} />

          {/* CRUD Pages */}
          <Route path="/packages" element={<ProtectedRoute><EntityManager type="packages" title="Paquetes Turísticos" /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><EntityManager type="clients" title="Cartera de Clientes" /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EntityManager type="employees" title="Gestión de Personal" /></ProtectedRoute>} />
          <Route path="/providers" element={<ProtectedRoute><EntityManager type="providers" title="Proveedores" /></ProtectedRoute>} />
          <Route path="/users" element={
            <ProtectedRoute>
              <AdminRoute>
                <EntityManager type="users" title="Usuarios del Sistema" />
              </AdminRoute>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
