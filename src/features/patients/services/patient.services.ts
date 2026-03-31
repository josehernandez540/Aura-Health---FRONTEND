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

export type CreatePatientPayload = Omit<Patient, 'id' | 'is_active' | 'createdAt'>;

export const createPatient = async (payload: CreatePatientPayload) => {
  const { data } = await api.post<{ message: string }>("/v1/patients", payload);
  return data;
};

export const getPatients = async (): Promise<Patient[]> => {
  const { data } = await api.get<{ data: { items: Patient[] } }>("/v1/patients");
  return data.data.items;
};