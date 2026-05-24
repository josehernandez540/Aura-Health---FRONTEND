import api from '../../services/api';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    items: AdminUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
}

export const adminUserService = {
  getAdminUsers: async (): Promise<AdminUsersResponse> => {
    const response = await api.get<AdminUsersResponse>('/admin/');
    return response.data;
  },

  createAdminUser: async (payload: CreateAdminUserPayload): Promise<void> => {
    await api.post('/admin/', payload);
  },

  toggleAdminStatus: async (id: string, isActive: boolean): Promise<void> => {
    await api.patch(`/admin/${id}/status`, { status: isActive ? 'ACTIVE' : 'INACTIVE' });
  },
};
