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

export const adminUserService = {
  getAdminUsers: async (): Promise<AdminUsersResponse> => {
    const response = await api.get<AdminUsersResponse>('/admin/');
    return response.data;
  },

  toggleAdminStatus: async (id: string, isActive: boolean): Promise<void> => {
    await api.patch(`/admin/${id}/status`, { isActive });
  },
};
