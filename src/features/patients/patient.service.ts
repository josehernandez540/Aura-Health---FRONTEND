import api from '../../services/api';

export interface CreatePatientPayload {
  name: string;
  documentNumber: string;
  birthDate: string;
  email: string;
  phone: string;
}

export interface CreatePatientResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    documentNumber: string;
    birthDate: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt: string;
  };
  timestamp: string;
}

export interface Patient {
  id: string;
  name: string;
  documentNumber: string;
  birthDate: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawPatient {
  id: string;
  name: string;
  document_number: string;
  birth_date: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export const patientService = {
  createPatient: async (payload: CreatePatientPayload): Promise<CreatePatientResponse> => {
    const response = await api.post<CreatePatientResponse>('/patients', payload);
    return response.data;
  },

  getPatients: async (): Promise<{ success: boolean; data: { items: RawPatient[]; total: number } }> => {
    const response = await api.get('/patients');
    return response.data;
  },

  getPatient: async (id: string): Promise<{ success: boolean; data: Patient; message: string }> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  updatePatient: async (id: string, payload: Partial<CreatePatientPayload>): Promise<CreatePatientResponse> => {
    const response = await api.put(`/patients/${id}`, payload);
    return response.data;
  },

  togglePatientStatus: async (id: string, isActive: boolean): Promise<void> => {
    await api.patch(`/patients/${id}/status`, { isActive });
  },
};
