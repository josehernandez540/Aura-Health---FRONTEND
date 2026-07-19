import api from "../../../services/api";

export interface AdminDashboardStats {
  totalPatients: number;
  totalDoctors: number;
  appointmentsToday: number;
  appointmentsThisMonth: number;
  completedThisMonth: number;
  cancelledThisMonth: number;
}

export interface DoctorDashboardStats {
  appointmentsToday: number;
  appointmentsThisWeek: number;
  completedThisMonth: number;
  noShowThisMonth: number;
  attendanceRate: number;
}

export interface TodayAppointment {
  id: string;
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  patient: { id: string; name: string } | null;
}

export interface AuditActivityEntry {
  id: string;
  action: string;
  entityType: string | null;
  createdAt: string;
  user: { email: string; role: string } | null;
}

export interface NotificationActivityEntry {
  id: string;
  type: string;
  message: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminDashboardOverview {
  role: "ADMIN";
  stats: AdminDashboardStats;
  todayAppointments: TodayAppointment[];
  recentActivity: AuditActivityEntry[];
}

export interface DoctorDashboardOverview {
  role: "DOCTOR";
  stats: DoctorDashboardStats | null;
  todayAppointments: TodayAppointment[];
  recentActivity: NotificationActivityEntry[];
}

export type DashboardOverview = AdminDashboardOverview | DoctorDashboardOverview;

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const { data } = await api.get<{ data: DashboardOverview }>("/dashboard/overview");
  return data.data;
};
