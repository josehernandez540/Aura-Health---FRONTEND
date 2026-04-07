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

export const appointmentsService = {
  getAll: async (): Promise<AppointmentsResponse> => {
    const response = await api.get<AppointmentsResponse>('/appointments');
    return response.data;
  },
};
