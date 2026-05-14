import api from '../../services/api';

export interface CreateDoctorPayload {
  name: string;
  documentNumber: string;
  specialization: string;
  email: string;
  password: string;
}

export interface CreateDoctorResponse {
  success: boolean;
  message: string;
  data: {
    user: { id: string; email: string; role: string };
    doctor: { id: string; name: string; specialization: string };
  };
  timestamp: string;
}

export const doctorsService = {
  createDoctor: async (payload: CreateDoctorPayload): Promise<CreateDoctorResponse> => {
    const response = await api.post<CreateDoctorResponse>('/doctors', payload);
    return response.data;
  },
};
