import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import UnauthorizedPage from '../features/auth/UnauthorizedPage';
import AuditPage from '../features/audit/AuditPage';
import ChangePasswordForm from '../features/auth/ChangePasswordForm';
import UsersPage from '../features/users/UsersPage';
import AppointmentsPage from '../features/appointments/AppointmentsPage';
import DoctorAgendaPage from '../features/appointments/DoctorAgendaPage';
import { useAuthStore } from '../features/auth/authStore';

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// Dashboard redirige según rol
const DashboardRedirect = () => {
  const { role } = useAuthStore();
  if (role === 'ADMIN') return <Navigate to="/users" replace />;
  return <Navigate to="/agenda" replace />;
};

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { path: 'change-password', element: <ChangePasswordForm /> },
      { path: 'unauthorized', element: <UnauthorizedPage /> },
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardRedirect /> },
          { path: 'audit', element: <AuditPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'agenda', element: <AppointmentsPage /> },
          { path: 'mi-agenda', element: <DoctorAgendaPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);

export default router;