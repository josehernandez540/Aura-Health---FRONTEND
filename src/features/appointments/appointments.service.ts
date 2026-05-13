import api from '../../services/api';

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes: string;
  createdBy: string;
  createdAt: string;
  doctor: {
    id: string;
    name: string;
    specialization: string;
  };
  patient: {
    id: string;
    name: string;
    documentNumber: string;
  };
}

export interface AppointmentsResponse {
  success: boolean;
  message: string;
  data: {
    items: Appointment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  is_active: boolean;
}

export interface Patient {
  id: string;
  name: string;
  document_number: string;
  is_active: boolean;
}

interface DoctorsResponse {
  success: boolean;
  data: { items: Doctor[] };
}

interface PatientsResponse {
  success: boolean;
  data: { items: Patient[] };
}

export interface CreateAppointmentPayload {
  doctorId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export const appointmentsService = {
  getAll: async (): Promise<AppointmentsResponse> => {
    const response = await api.get<AppointmentsResponse>('/appointments');
    return response.data;
  },

  getDoctors: async (): Promise<DoctorsResponse> => {
    const response = await api.get<DoctorsResponse>('/doctors');
    return response.data;
  },

  getPatients: async (): Promise<PatientsResponse> => {
    const response = await api.get<PatientsResponse>('/patients');
    return response.data;
  },

  createAppointment: async (payload: CreateAppointmentPayload): Promise<void> => {
    await api.post('/appointments', payload);
  },

  cancelAppointment: async (id: string, reason: string): Promise<void> => {
    await api.patch(`/appointments/${id}/status`, { status: 'CANCELLED', notes: reason });
  },

  markNoShow: async (id: string): Promise<void> => {
    await api.patch(`/appointments/${id}/status`, { status: 'NO_SHOW' });
  },
};
