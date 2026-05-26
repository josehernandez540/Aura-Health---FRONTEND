import api from '../../services/api';

export interface MedicalRecord {
  id: string;
  source: string;
  fileUrl: string;
  createdAt: string;
}

export interface PatientHistorial {
  patient: {
    id: string;
    name: string;
    documentNumber: string;
    riskLevel?: string;
  };
  medicalRecords: MedicalRecord[];
}

export const medicalRecordService = {
  getHistorial: async (patientId: string): Promise<PatientHistorial> => {
    const response = await api.get(`/historial/${patientId}`);
    return response.data.data;
  },

  uploadRecord: async (patientId: string, file: File): Promise<MedicalRecord> => {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('file', file);
    const response = await api.post('/integracion/historial', formData, {
      headers: {
        'x-api-key': 'aura_external_secure_key',
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  downloadRecord: async (recordId: string): Promise<void> => {
    const response = await api.get(`/medical-records/${recordId}/download`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(url), 10000);
  },
};
