import React from "react";
import type { ReportHistoryStats } from "../services/report.service";

interface ReportStatsCardsProps {
  stats: ReportHistoryStats;
}

const ReportStatsCards: React.FC<ReportStatsCardsProps> = ({ stats }) => {
  return (
    <div className="report-stats-grid">
      <div className="report-stat-card accent-blue">
        <img src="/icons/chart-bar.svg" width={22} alt="" className="icon-img-color" />
        <span className="report-stat-value">{stats.total}</span>
        <span className="report-stat-label">Reportes generados</span>
      </div>

      <div className="report-stat-card accent-green">
        <img src="/icons/date.svg" width={22} alt="" className="icon-img-color" />
        <span className="report-stat-value">{stats.thisMonth}</span>
        <span className="report-stat-label">Este mes</span>
      </div>

      <div className="report-stat-card accent-amber">
        <img src="/icons/chart-pie.svg" width={22} alt="" className="icon-img-color" />
        <span className="report-stat-value">{stats.today}</span>
        <span className="report-stat-label">Hoy</span>
      </div>
    </div>
  );
};

export default ReportStatsCards;
