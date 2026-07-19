import api from "../../../services/api";
import type { ReportFiltersInput } from "../schemas/report.schema";

export interface DownloadedFile {
  blob: Blob;
  contentDisposition?: string;
}

export const downloadPatientReport = async (patientId: string): Promise<DownloadedFile> => {
  const response = await api.get(`/reportes/${patientId}`, {
    responseType: "blob",
  });
  return { blob: response.data, contentDisposition: response.headers["content-disposition"] };
};

export interface ReportSummary {
  doctorLabel: string;
  patientLabel: string;
  dateRangeLabel: string;
  metrics: {
    totalAppointments: number;
    totalPatients: number;
    totalTreatments: number;
  };
}

const buildFilterParams = (filters: ReportFiltersInput) => {
  const params: Record<string, string> = {};
  if (filters.doctorId) params.doctorId = filters.doctorId;
  if (filters.patientId) params.patientId = filters.patientId;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  return params;
};

export const fetchReportSummary = async (filters: ReportFiltersInput): Promise<ReportSummary> => {
  const { data } = await api.get<{ data: ReportSummary }>("/reportes/consolidado/resumen", {
    params: buildFilterParams(filters),
  });
  return data.data;
};

export const generateConsolidatedReport = async (filters: ReportFiltersInput): Promise<DownloadedFile> => {
  const response = await api.get("/reportes/consolidado", {
    params: buildFilterParams(filters),
    responseType: "blob",
  });
  return { blob: response.data, contentDisposition: response.headers["content-disposition"] };
};

export interface ReportHistoryItem {
  id: string;
  type: string;
  title: string;
  createdAt: string;
  generatedBy: { email: string; doctorName: string | null } | null;
  fileSizeBytes: number | null;
  downloadable: boolean;
}

export interface ReportHistoryStats {
  total: number;
  thisMonth: number;
  today: number;
}

export interface ReportHistory {
  items: ReportHistoryItem[];
  total: number;
  page: number;
  totalPages: number;
  stats: ReportHistoryStats;
}

export const fetchReportHistory = async (limit = 5): Promise<ReportHistory> => {
  const { data } = await api.get<{ data: ReportHistory }>("/reportes/historial", {
    params: { limit },
  });
  return data.data;
};

export const downloadHistoricalReport = async (reportId: string): Promise<DownloadedFile> => {
  const response = await api.get(`/reportes/historial/${reportId}/pdf`, {
    responseType: "blob",
  });
  return { blob: response.data, contentDisposition: response.headers["content-disposition"] };
};

// axios still delivers a JSON error body as a Blob when responseType is "blob",
// so a failed download needs its own parsing path instead of error.response.data.message.
const readBlobErrorMessage = async (data: unknown): Promise<string | undefined> => {
  if (!(data instanceof Blob)) return undefined;
  try {
    const parsed = JSON.parse(await data.text());
    return parsed?.message;
  } catch {
    return undefined;
  }
};

export const resolveReportDownloadError = async (error: any, fallback: string): Promise<string> => {
  const blobMessage = await readBlobErrorMessage(error?.response?.data);
  return blobMessage || error?.response?.data?.message || fallback;
};
