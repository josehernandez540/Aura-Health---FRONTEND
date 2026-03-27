import { createBrowserRouter, Outlet } from 'react-router-dom';
import RootRedirect from './RootRedirect.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import PublicRoute from './PublicRoute.jsx';
import ForceChangePasswordRoute from './ForceChangePasswordRoute.jsx';
import LoginForm from '../features/auth/components/LoginForm.jsx';
import ChangePasswordForm from '../features/auth/change-password/ChangePasswordForm.jsx';
import RoleGuard from './RoleGuard';
import Unauthorized from '../pages/Unauthorized.jsx';
import AuditPage from '../pages/AuditPage.jsx';
import DoctorPage from '../pages/Doctors.jsx';
import NotFound from '../pages/notFound.jsx';
import MainLayout from '../components/layout/MainLayout/MainLayout.js';
import Patients from '../pages/Patients.jsx';

const Dashboard = () => <div>Dashboard</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: 
    <PublicRoute>
      <LoginForm />
    </PublicRoute>,
  },
  {
    path: '/change-password',
    element:
    <>
      <ForceChangePasswordRoute>
        <ChangePasswordForm />
      </ForceChangePasswordRoute>
    </>
  },
  {
    element: (
      <PrivateRoute>
        <MainLayout>
          <Outlet /> 
        </MainLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: (
          <RoleGuard allowedRoles={['ADMIN','DOCTOR']}>
            <Dashboard />
          </RoleGuard>
        ),
      },
      {
        path: '/citas',
        element: (
          <RoleGuard allowedRoles={['DOCTOR', 'ADMIN']}>
            <Dashboard />
          </RoleGuard>
        ),
      },
      {
        path: '/audit',
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <AuditPage />
          </RoleGuard>
        ),
      },
      {
        path: '/doctors',
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <DoctorPage />
          </RoleGuard>
        ),
      },
      {
        path: '/patients',
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <Patients />
          </RoleGuard>
        ),
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
  path: '*',
    element: <NotFound/>,
  }
]);