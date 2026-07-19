import api from "../../../services/api";

export interface AnalyticsStats {
  total: number;
  completed: number;
  noShow: number;
  cancelled: number;
}

export interface DayCount {
  date: string;
  count: number;
}

export type AppointmentStatus = "SCHEDULED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

export interface StatusCount {
  status: AppointmentStatus;
  count: number;
}

export interface SpecialtyCount {
  specialty: string;
  count: number;
}

export interface DoctorPerformance {
  doctorId: string;
  name: string;
  specialization: string;
  total: number;
  completed: number;
  noShow: number;
  attendanceRate: number;
}

export interface AnalyticsOverview {
  range: { days: number; startDate: string; endDate: string };
  stats: AnalyticsStats;
  appointmentsByDay: DayCount[];
  statusDistribution: StatusCount[];
  bySpecialty: SpecialtyCount[];
  weeklyHeatmap: DayCount[];
  doctorPerformance: DoctorPerformance[];
}

export const fetchAnalyticsOverview = async (days: number): Promise<AnalyticsOverview> => {
  const { data } = await api.get<{ data: AnalyticsOverview }>("/analytics/overview", {
    params: { days },
  });
  return data.data;
};
