import api from '../../services/api';

export interface Appointment {
  id: string;
  scheduled_at: string;
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled';
  reason: string;
  patients: {
    id: string;
    name: string;
    risk_level: 'low' | 'medium' | 'high';
  };
}

export interface RecentPatient {
  id: string;
  name: string;
  last_appointment: string;
  risk_level: 'low' | 'medium' | 'high';
}

export interface AppointmentsResponse {
  success: boolean;
  message: string;
  data: {
    items: Appointment[];
    total: number;
  };
  timestamp: string;
}

export interface RecentPatientsResponse {
  success: boolean;
  message: string;
  data: {
    items: RecentPatient[];
    total: number;
  };
  timestamp: string;
}

export const doctorService = {
  getTodayAppointments: async (): Promise<AppointmentsResponse> => {
    const response = await api.get<AppointmentsResponse>('/appointments/today');
    return response.data;
  },

  getRecentPatients: async (): Promise<RecentPatientsResponse> => {
    const response = await api.get<RecentPatientsResponse>('/patients/recent');
    return response.data;
  },
};