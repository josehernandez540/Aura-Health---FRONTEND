import api from '../../../services/api';

export interface AuditLog {
  id: string;
  action: string;
  createdAt: string;
  user_id: string;
  user?: {
    email: string;
    name?: string;
  };
  metadata?: {
    name?: string;
    details?: string;
    ip?: string;
    prev_data?: any;
    new_data?: any;
    [key: string]: any;
  };
}

export interface AuditResponse {
  items: AuditLog[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export const getAuditLogs = async (params: Record<string, any> = {}): Promise<AuditResponse> => {
  const res = await api.get<{ data: AuditResponse }>('/v1/audit', { params });
  return res.data.data;
};