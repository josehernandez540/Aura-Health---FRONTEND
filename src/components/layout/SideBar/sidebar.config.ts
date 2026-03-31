import type { Role } from "../../../utils/hasRole";
import DoctorPage from "../../../pages/Doctors.tsx";
import Patients from "../../../pages/Patients.tsx";
import AuditPage from "../../../pages/AuditPage.tsx";
import Dashboard from "../../../pages/Dashboard.tsx";

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
      },
      {
        label: 'Historial Clínico',
        path: '/records',
        icon: 'documents.svg',
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
      },
      {
        label: 'Analiticas',
        path: '/analiticas',
        icon: 'chart-pie.svg',
      },
    ],
  },
  {
    label: 'Usuario',
    roles: ['ADMIN', 'DOCTOR'],
    items: [
      {
        label: 'Notificaciones',
        path: '/notificaciones',
        icon: 'bell.svg',
      },
      {
        label: 'Mi perfil',
        path: '/perfil',
        icon: 'setting.svg',
      },
      {
        label: 'Mis Analiticas',
        path: '/mis-analiticas',
        icon: 'chart-pie.svg',
      },
    ]
  },
];