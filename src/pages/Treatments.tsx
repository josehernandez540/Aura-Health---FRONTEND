import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import TreatmentTable from "../features/treatments/components/TreatmentTable";
import PendingApprovalsTable from "../features/treatments/components/PendingApprovalsTable";
import CreateTreatmentModal from "../features/treatments/components/CreateTreatmentModal";
import { useTreatmentsList } from "../features/treatments/hooks/useTreatments";
import type { Treatment } from "../features/treatments/services/treatment.service";
import { hasRole } from "../utils/hasRole";
import "./Treatments.css";

const TreatmentsPage: React.FC = () => {
  const isAdmin = hasRole(["ADMIN"]);
  const isDoctor = hasRole(["DOCTOR"]);
  const navigate = useNavigate();

  const [tab, setTab] = useState<"all" | "pending">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { treatments, loading, fetchTreatments } = useTreatmentsList();
  const pendingTreatments = treatments.filter((t) => t.status === "PENDING_APPROVAL");

  const goToDetail = (treatment: Treatment) => navigate(`/treatments/${treatment.id}`);

  return (
    <>
      <PageHeader
        title="Gestión de Tratamientos"
        subtitle="Consulta y prescribe tratamientos médicos para tus pacientes"
        onClick={isDoctor ? () => setIsCreateOpen(true) : undefined}
        textButton="Nuevo Tratamiento"
      />

      {isAdmin && (
        <div className="treatments-tabs">
          <button
            className={`treatments-tab ${tab === "all" ? "active" : ""}`}
            onClick={() => setTab("all")}
          >
            Todos
          </button>
          <button
            className={`treatments-tab ${tab === "pending" ? "active" : ""}`}
            onClick={() => setTab("pending")}
          >
            Aprobaciones pendientes ({pendingTreatments.length})
          </button>
        </div>
      )}

      {tab === "all" || !isAdmin ? (
        <TreatmentTable
          treatments={treatments}
          loading={loading}
          onViewDetail={goToDetail}
        />
      ) : (
        <PendingApprovalsTable
          treatments={pendingTreatments}
          loading={loading}
          onApproved={fetchTreatments}
          onViewDetail={goToDetail}
        />
      )}

      {isDoctor && (
        <CreateTreatmentModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={fetchTreatments}
        />
      )}
    </>
  );
};

export default TreatmentsPage;
