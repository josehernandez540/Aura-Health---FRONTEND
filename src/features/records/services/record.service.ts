import api from "../../../services/api";

export type DocumentType = "HISTORIA_CLINICA" | "EXAMEN" | "DIAGNOSTICO";

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string | null;
  fileUrl: string;
  fileName: string | null;
  documentType: DocumentType | null;
  uploadedBy: { id: string; name: string } | null;
  isValidated: boolean;
  validatedAt: string | null;
  validatedBy: { id: string; email: string } | null;
  createdAt: string;
}

export interface MedicalRecordsResponse {
  items: MedicalRecord[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetRecordsParams {
  search?: string;
  documentType?: DocumentType | "";
  patientId?: string;
}

export const getMedicalRecords = async (
  params?: GetRecordsParams
): Promise<MedicalRecordsResponse> => {
  const { data } = await api.get("/medical-records", { params });
  return data.data;
};

export const uploadMedicalRecord = async (payload: {
  patientId: string;
  documentType: DocumentType;
  file: File;
}) => {
  const formData = new FormData();
  formData.append("patientId", payload.patientId);
  formData.append("documentType", payload.documentType);
  formData.append("file", payload.file);

  const { data } = await api.post<{ message: string }>(
    "/medical-records",
    formData
  );
  return data;
};

export const validateMedicalRecord = async (id: string) => {
  const { data } = await api.patch<{ message: string }>(
    `/medical-records/${id}/validate`
  );
  return data;
};

export const downloadMedicalRecordFile = async (
  id: string
): Promise<Blob> => {
  const { data } = await api.get(`/medical-records/${id}/download`, {
    responseType: "blob",
  });
  return data;
};
