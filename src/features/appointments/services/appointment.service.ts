import api from "../../../services/api";

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  notes?: string | null;
  doctor?: { id: string; name: string; specialization: string };
  patient?: { id: string; name: string; documentNumber: string; email?: string };
}

export interface AppointmentsResponse {
  items: Appointment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetAppointmentsParams {
  doctorId?: string;
  patientId?: string;
  date?: string;
  status?: string;
}

export type CreateAppointmentPayload = {
  doctorId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export const getAppointments = async (
  params?: GetAppointmentsParams
): Promise<AppointmentsResponse> => {
  const { data } = await api.get("/appointments", { params });
  return data.data;
};

export const createAppointment = async (payload: CreateAppointmentPayload) => {
  const { data } = await api.post<{ message: string }>("/appointments", payload);
  return data;
};
