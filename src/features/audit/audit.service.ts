import api from '../../services/api';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  createdAt: string;
  user?: {
    email: string;
    role: string;
  };
}

export interface AuditLogResponse {
  success: boolean;
  message: string;
  data: {
    logs: AuditLog[];
    total: number;
    page: number;
    limit: number;
  };
  timestamp: string;
}

export const auditService = {
  getLogs: async (page = 1, limit = 10): Promise<AuditLogResponse> => {
    const response = await api.get<AuditLogResponse>('/audit-log', {
      params: { page, limit },
    });
    return response.data;
  },
};