import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import { useAuthStore } from '../features/auth/authStore';

// Redirige al dashboard si ya hay sesión activa
const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// Placeholder pages — reemplazar con páginas reales cuando estén listas
const DashboardPage = () => <div style={{ padding: '2rem', fontSize: '1.25rem', fontWeight: 600 }}>Dashboard</div>;
const ChangePasswordPage = () => <div style={{ padding: '2rem', fontSize: '1.25rem', fontWeight: 600 }}>Cambio de contraseña</div>;

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'change-password',
        element: <ChangePasswordPage />,
      },
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;