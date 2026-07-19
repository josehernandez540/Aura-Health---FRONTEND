import { useState } from "react";
import { downloadPatientReport, resolveReportDownloadError } from "../services/report.service";
import { useUIStore } from "../../../store/ui.store";
import { downloadBlob, extractFilename } from "../../../utils/downloadBlob";

export const useDownloadPatientReport = () => {
  const showToast = useUIStore((state) => state.showToast);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const downloadReport = async (patientId: string, patientName?: string) => {
    try {
      setDownloadingId(patientId);
      const { blob, contentDisposition } = await downloadPatientReport(patientId);
      const filename = extractFilename(contentDisposition, `reporte-clinico-${patientName ?? patientId}.pdf`);
      downloadBlob(blob, filename);

      showToast("Reporte generado correctamente", "success");
    } catch (error) {
      const message = await resolveReportDownloadError(error, "Error al generar el reporte");
      showToast(message, "error");
    } finally {
      setDownloadingId(null);
    }
  };

  return { downloadReport, downloadingId };
};
