import api from '../../services/api';

export interface Medication {
  name: string;
  presentation: string;
  dose: string;
  frequency: string;
  duration: string;
}

export interface CreateTreatmentPayload {
  patientId: string;
  medications: Medication[];
  notes?: string;
}

export interface TreatmentsResponse {
  success: boolean;
  message: string;
  data: {
    items: Treatment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  doctorId: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING_APPROVAL';
  createdAt: string;
  patient?: {
    id: string;
    name: string;
    documentNumber: string;
  };
}

export const treatmentService = {
  create: async (payload: CreateTreatmentPayload): Promise<{ success: boolean; data: Treatment }> => {
    const response = await api.post('/treatments', payload);
    return response.data;
  },

  getAll: async (): Promise<TreatmentsResponse> => {
    const response = await api.get<TreatmentsResponse>('/treatments');
    return response.data;
  },
};