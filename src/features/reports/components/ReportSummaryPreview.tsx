import React from "react";
import type { ReportSummary } from "../services/report.service";

interface ReportSummaryPreviewProps {
  summary: ReportSummary;
}

const ReportSummaryPreview: React.FC<ReportSummaryPreviewProps> = ({ summary }) => {
  const { doctorLabel, patientLabel, dateRangeLabel, metrics } = summary;

  return (
    <div className="report-summary">
      <h3 className="report-summary-title">Resumen del reporte</h3>

      <dl className="report-summary-meta">
        <div>
          <dt>Médico</dt>
          <dd>{doctorLabel}</dd>
        </div>
        <div>
          <dt>Paciente</dt>
          <dd>{patientLabel}</dd>
        </div>
        <div>
          <dt>Rango de fechas</dt>
          <dd>{dateRangeLabel}</dd>
        </div>
      </dl>

      <div className="report-summary-metrics">
        <div className="report-metric-card">
          <span className="report-metric-value">{metrics.totalAppointments}</span>
          <span className="report-metric-label">Citas</span>
        </div>
        <div className="report-metric-card">
          <span className="report-metric-value">{metrics.totalPatients}</span>
          <span className="report-metric-label">Pacientes</span>
        </div>
        <div className="report-metric-card">
          <span className="report-metric-value">{metrics.totalTreatments}</span>
          <span className="report-metric-label">Tratamientos</span>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryPreview;
