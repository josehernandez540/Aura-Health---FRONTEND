import api from "../../../services/api";

export const createPatient = async (payload) => {
  const { data } = await api.post("/v1/patients", payload);
  return data;
};