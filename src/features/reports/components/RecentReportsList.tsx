import React from "react";
import type { ReportHistoryItem } from "../services/report.service";

interface RecentReportsListProps {
  items: ReportHistoryItem[];
  loading: boolean;
  downloadingId: string | null;
  onDownload: (item: ReportHistoryItem) => void;
}

const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });

const RecentReportsList: React.FC<RecentReportsListProps> = ({ items, loading, downloadingId, onDownload }) => {
  if (loading) {
    return <p className="report-recent-empty">Cargando historial...</p>;
  }

  if (!items.length) {
    return <p className="report-recent-empty">Aún no se han generado reportes.</p>;
  }

  return (
    <ul className="report-recent-list">
      {items.map((item) => (
        <li key={item.id} className="report-recent-item">
          <div className="report-recent-info">
            <span className="report-recent-title">{item.title}</span>
            <span className="report-recent-meta">
              Generado {formatDate(item.createdAt)}
              {item.generatedBy && ` · ${item.generatedBy.doctorName ?? item.generatedBy.email}`}
              {item.fileSizeBytes && ` · ${formatFileSize(item.fileSizeBytes)}`}
            </span>
          </div>

          <button
            type="button"
            className="report-recent-download"
            disabled={!item.downloadable || downloadingId === item.id}
            onClick={() => onDownload(item)}
            title={item.downloadable ? "Descargar PDF" : "Archivo no disponible"}
          >
            {downloadingId === item.id ? "..." : "↓ PDF"}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default RecentReportsList;
