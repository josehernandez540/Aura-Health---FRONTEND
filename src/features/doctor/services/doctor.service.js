import api from "../../../services/api";

export const createDoctor = async (payload) => {
  const { data } = await api.post("v1/doctors", payload);
  return data;
};

export const getMedicos = async () => {
  const { data } = await api.get("v1/doctors");
  return data.data.items;
};

export const toggleMedicoStatus = async (id) => {
  const { data } = await api.patch(`/v1/doctors/${id}/status`);
  return data;
};

export const getDoctorById = async (id) => {
  const { data } = await api.get(`/v1/doctors/${id}`);
  return data.data;
};

export const updateDoctor = async (id, payload) => {
  const { data } = await api.put(`/v1/doctors/${id}`, payload);
  return data;
};