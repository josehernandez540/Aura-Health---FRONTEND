import api from "../../../services/api";

export interface Doctor {
  id: string;
  name: string;
  license_number: string;
  specialization: string;
  is_active: boolean;
  user_id: string;
  users: {
    email: string;
  };
  status_changed_at: string | null;
  status_changed_by: string | null;
}

export interface DoctorDetail extends Doctor {
  isActive: boolean;
  licenseNumber: string; 
  user?: { email: string };
  stats: {
    totalAppointments: number;
    uniquePatients: number;
    activeTreatments: number;
  };
  appointments: Array<{
    id: string;
    date: string;
    notes: string;
    status: string;
    patient: { name: string };
  }>;
  treatments: Array<{
    id: string;
    description: string;
    status: string;
    patient: { name: string };
  }>;
}

interface ApiResponse<T> {
  data: {
    items: T[];
    total?: number;
  };
  message?: string;
}

export const getMedicos = async (): Promise<Doctor[]> => {
  const { data } = await api.get<ApiResponse<Doctor>>("v1/doctors");
  return data.data.items;
};

export const createDoctor = async (payload: Omit<Doctor, 'id' | 'is_active'>) => {
  const { data } = await api.post("v1/doctors", payload);
  return data;
};

export const toggleMedicoStatus = async (id: string) => {
  const { data } = await api.patch<{ message: string }>(`/v1/doctors/${id}/status`);
  return data;
};

export const getDoctorById = async (id: string): Promise<Doctor> => {
  const { data } = await api.get<{ data: Doctor }>(`/v1/doctors/${id}`);
  return data.data;
};

export const updateDoctor = async (id: string, payload: Partial<Doctor>) => {
  const { data } = await api.put(`/v1/doctors/${id}`, payload);
  return data;
};