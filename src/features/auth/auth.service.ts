import api from '../../services/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    mustChangePassword: boolean;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
  timestamp: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
  timestamp: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    const response = await api.patch<ChangePasswordResponse>('/auth/change-password', payload);
    return response.data;
  },
};