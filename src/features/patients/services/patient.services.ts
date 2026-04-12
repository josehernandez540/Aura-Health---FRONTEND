import api from "../../../services/api";

export interface Patient {
  id: string;
  name: string;
  documentNumber: string;
  birthDate: string;
  email: string;
  phone: string;
  is_active?: boolean;
  createdAt?: string;
}

export interface PatientsResponse {
  items: Patient[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Appointment {
  id: string;
  date: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes: string;
  doctors: { name: string; specialization: string };
}

export interface Treatment {
  id: string;
  description: string;
  status: string;
  created_at: string;
  doctors: { name: string };
}

export interface PatientDetail extends Patient {
  appointments: Appointment[];
  treatments: Treatment[];
  medical_records: any[];
}

export type CreatePatientPayload = Omit<Patient, 'id' | 'is_active' | 'createdAt'>;

export const createPatient = async (payload: CreatePatientPayload) => {
  const { data } = await api.post<{ message: string }>("/v1/patients", payload);
  return data;
};

export const getPatients = async (): Promise<PatientsResponse> => {
  const { data } = await api.get("/v1/patients");
  return data.data;
};

export const updatePatient = async (id: string, patientData: Partial<Patient>) => {
  const { data } = await api.patch(`/v1/patients/${id}`, patientData);
  return data;
};

export const togglePatientStatus = async (id: string) => {
  const { data } = await api.patch(`/v1/patients/${id}/status`);
  return data;
};

export const getPatientById = async (id: string): Promise<Patient> => {
  const { data } = await api.get(`/v1/patients/${id}`);
  return data.data;
};