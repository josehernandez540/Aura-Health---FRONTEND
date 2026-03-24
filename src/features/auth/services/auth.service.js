import api from '../../../services/api';

export const loginRequest = async (data) => {
  const response = await api.post('/v1/auth/login', data);
  return response.data;
};

export default {
  loginRequest,
};