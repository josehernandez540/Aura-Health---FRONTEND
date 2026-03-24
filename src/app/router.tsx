import { createBrowserRouter } from 'react-router-dom';
import RootRedirect from './RootRedirect.jsx';
import PrivateRoute from './PrivateRoute.jsx';

import LoginForm from '../features/auth/components/LoginForm.jsx';

const Dashboard = () => <div>Dashboard</div>;
const ChangePassword = () => <div>Cambiar contraseña</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/change-password',
    element: <ChangePassword />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);