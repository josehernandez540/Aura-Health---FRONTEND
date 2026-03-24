import api from '../../../services/api';

export const loginRequest = async (data) => {
  const response = await api.post('/v1/auth/login', data);
  return response.data;
};

export const changePassword = async (payload) => {
  const { data } = await api.patch("/v1/auth/change-password", payload);
  return data;
};

export default {
  loginRequest,
  changePassword,
};