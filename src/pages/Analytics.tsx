import React from "react";
import PageHeader from "../components/common/PageHeader";
import AnalyticsStatCards from "../features/analytics/components/AnalyticsStatCards";
import DateRangeSelect from "../features/analytics/components/DateRangeSelect";
import AppointmentsByDayChart from "../features/analytics/components/AppointmentsByDayChart";
import StatusDistributionChart from "../features/analytics/components/StatusDistributionChart";
import SpecialtyBarChart from "../features/analytics/components/SpecialtyBarChart";
import AttendanceHeatmap from "../features/analytics/components/AttendanceHeatmap";
import DoctorPerformanceTable from "../features/analytics/components/DoctorPerformanceTable";
import { useAnalytics } from "../features/analytics/hooks/useAnalytics";
import "./Analytics.css";

const AnalyticsPage: React.FC = () => {
  const { days, setDays, data, loading } = useAnalytics();

  return (
    <div className="analytics-page">
      <PageHeader
        title="Analíticas"
        subtitle="Visualizaciones en tiempo real del sistema"
        actions={<DateRangeSelect value={days} onChange={setDays} />}
      />

      {!data ? (
        <p className="analytics-empty">Cargando analíticas...</p>
      ) : (
        <div className={`analytics-body ${loading ? "is-refetching" : ""}`}>
          <AnalyticsStatCards stats={data.stats} />

          <div className="analytics-grid-2">
            <div className="analytics-card">
              <h3 className="analytics-card-title">Citas por día</h3>
              <AppointmentsByDayChart data={data.appointmentsByDay} />
            </div>

            <div className="analytics-card">
              <h3 className="analytics-card-title">Distribución por estado</h3>
              <StatusDistributionChart data={data.statusDistribution} />
            </div>
          </div>

          <div className="analytics-grid-2">
            <div className="analytics-card">
              <h3 className="analytics-card-title">Citas por especialidad</h3>
              <SpecialtyBarChart data={data.bySpecialty} />
            </div>

            <div className="analytics-card">
              <h3 className="analytics-card-title">
                Mapa de calor — Asistencia semanal
                <span className="analytics-card-hint">Últimas 12 semanas</span>
              </h3>
              <AttendanceHeatmap data={data.weeklyHeatmap} />
            </div>
          </div>

          <div className="analytics-card">
            <h3 className="analytics-card-title">Rendimiento por médico</h3>
            <DoctorPerformanceTable data={data.doctorPerformance} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
