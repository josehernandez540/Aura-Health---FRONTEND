import { createBrowserRouter, Outlet } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import RootRedirect from './RootRedirect';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import RoleGuard from './RoleGuard';
import ForceChangePasswordRoute from './ForceChangePasswordRoute';
import { SIDEBAR_CONFIG } from '../components/layout/SideBar/sidebar.config';

// Auth Features
import LoginForm from '../features/auth/components/LoginForm';
import ChangePasswordForm from '../features/auth/change-password/ChangePasswordForm';

import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/notFound';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import PatientDetailPage from '../pages/PatientDetailPage';

const Dashboard: React.FC = () => <div>Perfil Example</div>;

const generateProtectedRoutes = (): RouteObject[] => {
  const routes: RouteObject[] = [];

  SIDEBAR_CONFIG.forEach(section => {
    section.items.forEach(item => {
      if (item.component) {
        routes.push({
          path: item.path,
          element: (
            <RoleGuard allowedRoles={section.roles}>
              <item.component />
            </RoleGuard>
          )
        });
      }
    });
  });

  return routes;
};

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  {
    path: '/login',
    element: <PublicRoute> <LoginForm /> </PublicRoute>
  },
  {
    path: '/change-password',
    element: <ForceChangePasswordRoute> <ChangePasswordForm/> </ForceChangePasswordRoute>
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
      ...generateProtectedRoutes(),
      { 
        path: '/profile', 
        element: <RoleGuard allowedRoles={['ADMIN', 'DOCTOR']}><Dashboard /></RoleGuard> 
      },
      { 
        path: '/patients/:id', 
        element: <RoleGuard allowedRoles={['ADMIN', 'DOCTOR']}><PatientDetailPage /></RoleGuard> 
      },
    ],
  },
  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '*', element: <NotFound /> }
]);