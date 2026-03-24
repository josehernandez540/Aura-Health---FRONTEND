import api from '../../../services/api';

export const getAuditLogs = async (params = {}) => {
  const res = await api.get('/v1/audit', {
    params,
  });

  return res.data.data;
};