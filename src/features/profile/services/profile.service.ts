import api from "../../../services/api";

export interface DoctorProfileInfo {
  id: string;
  specialization: string | null;
  licenseNumber: string | null;
}

export interface MyProfile {
  id: string;
  email: string;
  role: string;
  name: string | null;
  doctor: DoctorProfileInfo | null;
}

export const getMyProfile = async (): Promise<MyProfile> => {
  const { data } = await api.get<{ data: MyProfile }>("/auth/me");
  return data.data;
};

export interface UpdateMyProfilePayload {
  name?: string;
  email?: string;
}

export const updateMyProfile = async (payload: UpdateMyProfilePayload): Promise<MyProfile> => {
  const { data } = await api.put<{ data: MyProfile }>("/auth/me", payload);
  return data.data;
};
