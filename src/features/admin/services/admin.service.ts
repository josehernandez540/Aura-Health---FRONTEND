import api from "../../../services/api";
import type { AdminUserFormData } from "../schemas/admin.schema";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  role: 'ADMIN';
  created_at?: string;
}

export const getAdminUsers = async (params?: { search?: string; page?: number; limit?: number }) => {
  const response = await api.get("/admin", { params });
  return response.data;
};

export const createAdminUser = async (data: AdminUserFormData) => {
  const response = await api.post("/admin", data);
  return response.data;
};

export const updateAdminUser = async (id: string, data: AdminUserFormData) => {
  const response = await api.put(`/admin/${id}`, data);
  return response.data;
};

export const updateAdminStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
  const response = await api.patch(`/admin/${id}/status`, { status });
  return response.data;
};