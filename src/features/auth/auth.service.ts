import api from '../../services/api';
import LoginForm from './LoginForm';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    userId: string;
    role: string;
    mustChangePassword: boolean;
  };
  timestamp: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/v1/auth/login', credentials);
    return response.data;
  },
};