import api from "../../../services/api";

export type TreatmentStatus = "ACTIVE" | "COMPLETED" | "PENDING_APPROVAL";

export interface Medication {
  name: string;
  dose: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  doctorId: string;
  description: string;
  medications: Medication[];
  status: TreatmentStatus;
  createdAt: string;
  requiresApproval: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  doctor?: { id: string; name: string; specialization: string };
  patient?: { id: string; name: string; documentNumber: string };
}

export interface TreatmentsResponse {
  items: Treatment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetTreatmentsParams {
  patientId?: string;
  doctorId?: string;
  status?: TreatmentStatus;
}

export const getTreatments = async (
  params?: GetTreatmentsParams
): Promise<TreatmentsResponse> => {
  const { data } = await api.get("/treatments", { params });
  return data.data;
};

export const getTreatmentById = async (id: string): Promise<Treatment> => {
  const { data } = await api.get(`/treatments/${id}`);
  return data.data;
};

export interface CreateTreatmentPayload {
  patientId: string;
  description: string;
  medications: Medication[];
  requiresApproval: boolean;
}

export const createTreatment = async (payload: CreateTreatmentPayload) => {
  const { data } = await api.post<{ message: string }>("/treatments", payload);
  return data;
};

export const approveTreatment = async (id: string, notes?: string) => {
  const { data } = await api.patch<{ message: string }>(
    `/treatments/${id}/approve`,
    { notes }
  );
  return data;
};

export interface UpdateTreatmentPayload {
  description?: string;
  medications?: Medication[];
  reason: string;
}

export const updateTreatment = async (id: string, payload: UpdateTreatmentPayload) => {
  const { data } = await api.patch<{ message: string }>(`/treatments/${id}`, payload);
  return data;
};

export interface TreatmentHistoryEntry {
  id: string;
  treatmentId: string;
  version: number;
  previousDescription: string | null;
  newDescription: string;
  previousMedications: Medication[];
  newMedications: Medication[];
  changedBy: string;
  changedByName: string | null;
  changeReason: string | null;
  createdAt: string;
}

export const getTreatmentHistory = async (id: string): Promise<TreatmentHistoryEntry[]> => {
  const { data } = await api.get(`/treatments/${id}/history`);
  return data.data;
};

export const updateTreatmentStatus = async (id: string, status: TreatmentStatus) => {
  const { data } = await api.patch<{ message: string }>(`/treatments/${id}/status`, { status });
  return data;
};
