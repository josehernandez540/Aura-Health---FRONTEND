import type { Role } from "../../../utils/hasRole";
import DoctorPage from "../../../pages/Doctors.tsx";
import Patients from "../../../pages/Patients.tsx";
import AuditPage from "../../../pages/AuditPage.tsx";
import Dashboard from "../../../pages/Dashboard.tsx";
import AdminUsersPage from "../../../pages/AdminUsers.tsx";
import AppointmentsPage from "../../../pages/Appointments.tsx";
import RecordsPage from "../../../pages/Records.tsx";
import TreatmentsPage from "../../../pages/Treatments.tsx";
import NotificationsPage from "../../../pages/Notifications.tsx";
import ReportsPage from "../../../pages/Reports.tsx";
import AnalyticsPage from "../../../pages/Analytics.tsx";
import ProfilePage from "../../../pages/Profile.tsx";

interface SidebarItem {
  label: string;
  path: string;
  icon: string;
  component?: React.ComponentType;
}

interface SidebarSection {
  label: string;
  roles: Role[];
  items: SidebarItem[];
}

export const SIDEBAR_CONFIG: SidebarSection[] = [
  {
    label: 'Principal',
    roles: ['ADMIN', 'DOCTOR'],
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'chart-bar.svg',
        component: Dashboard
      }
    ],
  },
  {
    label: 'Administración',
    roles: ['ADMIN'],
    items: [
      {
        label: 'Médicos',
        path: '/doctors',
        icon: 'user-group.svg',
        component: DoctorPage
      },
      {
        label: 'Usuarios',
        path: '/users',
        icon: 'user.svg',
        component: AdminUsersPage
      },
    ],
  },
  {
    label: 'Clínica',
    roles: ['ADMIN', 'DOCTOR'],
    items: [
      {
        label: 'Citas',
        path: '/appointments',
        icon: 'date.svg',
        component: AppointmentsPage
      },
      {
        label: 'Historial Clínico',
        path: '/records',
        icon: 'documents.svg',
        component: RecordsPage
      },
      {
        label: 'Pacientes',
        path: '/patients',
        icon: 'identification.svg',
        component: Patients
      },
      {
        label: 'Tratamientos',
        path: '/treatments',
        icon: 'tratment.svg',
        component: TreatmentsPage
      },
    ],
  },
  {
    label: 'Sistema',
    roles: ['ADMIN'],
    items: [
      {
        label: 'Auditoría',
        path: '/audit',
        icon: 'document-search.svg',
        component: AuditPage
      },
      {
        label: 'Reportes',
        path: '/reports',
        icon: 'document-plus.svg',
        component: ReportsPage
      },
      {
        label: 'Analiticas',
        path: '/analiticas',
        icon: 'chart-pie.svg',
        component: AnalyticsPage
      },
    ],
  },
  {
    label: 'Usuario',
    roles: ['ADMIN', 'DOCTOR'],
    items: [
      {
        label: 'Notificaciones',
        path: '/notifications',
        icon: 'bell.svg',
        component: NotificationsPage
      },
      {
        label: 'Mi perfil',
        path: '/profile',
        icon: 'setting.svg',
        component: ProfilePage
      },
    ]
  },
];