import api from '../../services/api';

export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialization: string;
  license_number: string;
  is_active: boolean;
  users: {
    email: string;
  };
}

export interface DoctorsResponse {
  success: boolean;
  message: string;
  data: {
    items: Doctor[];
    total: number;
    page: number;
    limit: number;
  };
  timestamp: string;
}

export const usersService = {
  getDoctors: async (): Promise<DoctorsResponse> => {
    const response = await api.get<DoctorsResponse>('/doctors');
    return response.data;
  },
};