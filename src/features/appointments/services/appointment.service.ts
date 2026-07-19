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
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  page?: number;
  limit?: number;
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
  console.log("getAppointments data:", data.data);
  return data.data;
};

export const createAppointment = async (payload: CreateAppointmentPayload) => {
  const { data } = await api.post<{ message: string }>("/appointments", payload);
  return data;
};

export const cancelAppointment = async (id: string, reason: string) => {
  const { data } = await api.patch<{ message: string }>(
    `/appointments/${id}/cancel`,
    { reason }
  );
  return data;
};

export type ReschedulePayload = {
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  reason?: string;
};

export const rescheduleAppointment = async (
  id: string,
  payload: ReschedulePayload
) => {
  const { data } = await api.patch<{ message: string }>(
    `/appointments/${id}/reschedule`,
    payload
  );
  return data;
};

export const markNoShow = async (id: string, reason?: string) => {
  const { data } = await api.patch<{ message: string }>(
    `/appointments/${id}/no-show`,
    { reason }
  );
  return data;
};

export const completeAppointment = async (id: string, notes?: string) => {
  const { data } = await api.patch<{ message: string }>(
    `/appointments/${id}/complete`,
    { notes }
  );
  return data;
};
