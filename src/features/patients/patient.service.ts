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

export const patientService = {
  createPatient: async (payload: CreatePatientPayload): Promise<CreatePatientResponse> => {
    const response = await api.post<CreatePatientResponse>('/patients', payload);
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
};
