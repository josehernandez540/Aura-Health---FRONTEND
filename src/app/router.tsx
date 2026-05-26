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
import ScheduleAppointmentPage from '../features/appointments/ScheduleAppointmentPage';
import PatientsPage from '../features/patients/PatientsPage';
import CreatePatientPage from '../features/patients/CreatePatientPage';
import EditPatientPage from '../features/patients/EditPatientPage';
import CreateDoctorPage from '../features/users/CreateDoctorPage';
import AdminUsersPage from '../features/admin-users/AdminUsersPage';
import CreateAdminUserPage from '../features/admin-users/CreateAdminUserPage';
import EditAdminUserPage from '../features/admin-users/EditAdminUserPage';
import MedicalHistorialPage from '../features/patients/MedicalHistorialPage';
import HistorialListPage from '../features/patients/HistorialListPage';
import { useAuthStore } from '../features/auth/authStore';
import TreatmentForm from '../features/treatments/TreatmentForm';


const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const DashboardRedirect = () => {
  const { role } = useAuthStore();
  if (role === 'ADMIN') return <Navigate to="/users" replace />;
  return <Navigate to="/mi-agenda" replace />;
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
          { path: 'users/create', element: <CreateDoctorPage /> },
          { path: 'medicos', element: <UsersPage /> },
          { path: 'medicos/create', element: <CreateDoctorPage /> },
          { path: 'appointments', element: <AppointmentsPage /> },
          { path: 'programar-cita', element: <ScheduleAppointmentPage /> },
          { path: 'appointments/create', element: <ScheduleAppointmentPage /> },
          { path: 'mi-agenda', element: <DoctorAgendaPage /> },
          { path: 'pacientes', element: <PatientsPage /> },
          { path: 'pacientes/create', element: <CreatePatientPage /> },
          { path: 'pacientes/:id/edit', element: <EditPatientPage /> },
          { path: 'admin-users', element: <AdminUsersPage /> },
          { path: 'admin-users/create', element: <CreateAdminUserPage /> },
          { path: 'admin-users/:id/edit', element: <EditAdminUserPage /> },
          { path: 'historial', element: <HistorialListPage /> },
          { path: 'historial/:patientId', element: <MedicalHistorialPage /> },
          { path: 'treatments', element: <div>Lista de Tratamientos (Próximamente)</div> },
          { path: 'treatments/create', element: <TreatmentForm /> },

        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);

export default router;