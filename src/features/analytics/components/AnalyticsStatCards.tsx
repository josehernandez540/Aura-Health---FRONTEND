import React from "react";
import type { AnalyticsStats } from "../services/analytics.service";

interface AnalyticsStatCardsProps {
  stats: AnalyticsStats;
}

const AnalyticsStatCards: React.FC<AnalyticsStatCardsProps> = ({ stats }) => {
  return (
    <div className="analytics-stats-grid">
      <div className="analytics-stat-card status-accent">
        <img src="/icons/date.svg" width={22} alt="" className="icon-img-color" />
        <span className="analytics-stat-value">{stats.total}</span>
        <span className="analytics-stat-label">Citas en el período</span>
      </div>

      <div className="analytics-stat-card status-good">
        <img src="/icons/document-search.svg" width={22} alt="" className="icon-img-color" />
        <span className="analytics-stat-value">{stats.completed}</span>
        <span className="analytics-stat-label">Realizadas</span>
      </div>

      <div className="analytics-stat-card status-warning">
        <img src="/icons/warning.svg" width={22} alt="" className="icon-img-color" />
        <span className="analytics-stat-value">{stats.noShow}</span>
        <span className="analytics-stat-label">Inasistencias</span>
      </div>

      <div className="analytics-stat-card status-danger">
        <img src="/icons/danger.svg" width={22} alt="" className="icon-img-color" />
        <span className="analytics-stat-value">{stats.cancelled}</span>
        <span className="analytics-stat-label">Canceladas</span>
      </div>
    </div>
  );
};

export default AnalyticsStatCards;
