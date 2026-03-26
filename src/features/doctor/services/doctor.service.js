import api from "../../../services/api";

export const createDoctor = async (payload) => {
  const { data } = await api.post("v1/doctors", payload);
  return data;
};