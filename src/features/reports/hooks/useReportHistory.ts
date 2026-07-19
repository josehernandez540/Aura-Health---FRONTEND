import { useCallback, useEffect, useState } from "react";
import {
  fetchReportHistory,
  downloadHistoricalReport,
  resolveReportDownloadError,
  type ReportHistoryItem,
  type ReportHistoryStats,
} from "../services/report.service";
import { useUIStore } from "../../../store/ui.store";
import { downloadBlob, extractFilename } from "../../../utils/downloadBlob";

export const useReportHistory = () => {
  const showToast = useUIStore((state) => state.showToast);

  const [items, setItems] = useState<ReportHistoryItem[]>([]);
  const [stats, setStats] = useState<ReportHistoryStats>({ total: 0, thisMonth: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const history = await fetchReportHistory(5);
      setItems(history.items);
      setStats(history.stats);
    } catch {
      showToast("No se pudo cargar el historial de reportes", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const downloadItem = async (item: ReportHistoryItem) => {
    try {
      setDownloadingId(item.id);
      const { blob, contentDisposition } = await downloadHistoricalReport(item.id);
      const filename = extractFilename(contentDisposition, `${item.title}.pdf`);
      downloadBlob(blob, filename);
      showToast("Reporte descargado correctamente", "success");
    } catch (error) {
      const message = await resolveReportDownloadError(error, "No se pudo descargar el reporte");
      showToast(message, "error");
    } finally {
      setDownloadingId(null);
    }
  };

  return { items, stats, loading, downloadingId, downloadItem, refetch };
};
