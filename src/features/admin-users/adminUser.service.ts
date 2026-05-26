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

  getAdminUser: async (id: string): Promise<{ success: boolean; data: AdminUser }> => {
    const response = await api.get(`/admin/${id}`);
    return response.data;
  },

  updateAdminUser: async (id: string, payload: { name: string; email: string }): Promise<void> => {
    await api.put(`/admin/${id}`, payload);
  },

  toggleAdminStatus: async (id: string, isActive: boolean): Promise<void> => {
    await api.patch(`/admin/${id}/status`, { status: isActive ? 'ACTIVE' : 'INACTIVE' });
  },
};
