import React, { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button/Button";
import ReportStatsCards from "../features/reports/components/ReportStatsCards";
import ReportTypeCatalog from "../features/reports/components/ReportTypeCatalog";
import RecentReportsList from "../features/reports/components/RecentReportsList";
import GenerateReportModal from "../features/reports/components/GenerateReportModal";
import { useReportHistory } from "../features/reports/hooks/useReportHistory";
import { useReportGenerator } from "../features/reports/hooks/useReportGenerator";
import "./Reports.css";

const ReportsPage: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { items, stats, loading, downloadingId, downloadItem, refetch } = useReportHistory();
  const generator = useReportGenerator(refetch);

  return (
    <>
      <PageHeader
        title="Reportes Clínicos"
        subtitle="Generación de reportes PDF"
        actions={
          <Button type="button" style={{ width: "auto" }} onClick={() => setModalOpen(true)}>
            Generar Reporte
          </Button>
        }
      />

      <ReportStatsCards stats={stats} />

      <div className="reports-dashboard-grid">
        <div className="reports-card">
          <h3 className="reports-section-title">Tipos de Reporte</h3>
          <ReportTypeCatalog onSelect={() => setModalOpen(true)} />
        </div>

        <div className="reports-card">
          <h3 className="reports-section-title">Reportes Recientes</h3>
          <RecentReportsList
            items={items}
            loading={loading}
            downloadingId={downloadingId}
            onDownload={downloadItem}
          />
        </div>
      </div>

      <GenerateReportModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} generator={generator} />
    </>
  );
};

export default ReportsPage;
