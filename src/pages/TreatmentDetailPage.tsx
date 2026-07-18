import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useTreatmentDetail,
  useTreatmentHistory,
  useUpdateTreatmentStatus,
} from "../features/treatments/hooks/useTreatments";
import EditTreatmentModal from "../features/treatments/components/EditTreatmentModal";
import { TREATMENT_STATUS_LABEL, TREATMENT_STATUS_BADGE_CLASS } from "../features/treatments/components/treatmentStatus";
import { hasRole } from "../utils/hasRole";
import Button from "../components/ui/Button/Button";
import "../features/treatments/components/treatmentDetail.css";
import "./TreatmentDetailPage.css";

const TreatmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDoctor = hasRole(["DOCTOR"]);

  const [activeTab, setActiveTab] = useState<"meds" | "history">("meds");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { treatment, loading, refetch } = useTreatmentDetail(id ?? null);
  const { history, loading: loadingHistory } = useTreatmentHistory(id ?? null);
  const { changeStatus, changingStatus } = useUpdateTreatmentStatus(refetch);

  if (loading || !treatment) {
    return <div className="loading-state">Cargando tratamiento...</div>;
  }

  return (
    <div className="treatment-detail-page animate-fadeIn">
      <nav className="detail-top-nav">
        <button onClick={() => navigate("/treatments")} className="back-link">
          <img src="/icons/back.svg" alt="" className="icon-img-sm" />
          Volver a Tratamientos
        </button>
        <div className="detail-breadcrumb">
          Tratamientos / <span className="current">{treatment.patient?.name}</span>
        </div>
      </nav>

      <div className="treatment-detail-main-layout">
        <aside className="treatment-sidebar-sticky">
          <div className="treatment-sidebar-status-row">
            <span className={TREATMENT_STATUS_BADGE_CLASS[treatment.status]}>
              {TREATMENT_STATUS_LABEL[treatment.status]}
            </span>
            <span className="treatment-detail-date">
              Creado: {treatment.createdAt?.slice(0, 10)}
            </span>
          </div>

          <div className="info-slot">
            <label>Paciente</label>
            <p>{treatment.patient?.name ?? "-"}</p>
          </div>

          <div className="info-slot">
            <label>Médico responsable</label>
            <p>
              {treatment.doctor ? `Dr. ${treatment.doctor.name}` : "-"}
              {treatment.doctor?.specialization && (
                <span className="app-specialty"> · {treatment.doctor.specialization}</span>
              )}
            </p>
          </div>

          <div className="info-slot">
            <label>Descripción</label>
            <p>{treatment.description}</p>
          </div>

          {isDoctor && (
            <div className="treatment-sidebar-actions">
              <Button variant="primary" onClick={() => setIsEditOpen(true)}>
                Editar tratamiento
              </Button>
              {treatment.status === "ACTIVE" && (
                <Button
                  variant="success"
                  isLoading={changingStatus}
                  onClick={() => changeStatus(treatment.id, "COMPLETED")}
                >
                  Marcar como completado
                </Button>
              )}
            </div>
          )}
        </aside>

        <main className="treatment-content-area">
          <header className="treatment-content-header">
            <h1 className="section-title">Tratamiento</h1>
            <div className="tabs-container">
              <button
                className={`tab-item ${activeTab === "meds" ? "active" : ""}`}
                onClick={() => setActiveTab("meds")}
              >
                Medicamentos <span className="count-pill">{treatment.medications.length}</span>
              </button>
              <button
                className={`tab-item ${activeTab === "history" ? "active" : ""}`}
                onClick={() => setActiveTab("history")}
              >
                Historial de cambios <span className="count-pill">{history.length}</span>
              </button>
            </div>
          </header>

          <section className="scrollable-panel">
            {activeTab === "meds" && (
              treatment.medications.length > 0 ? (
                treatment.medications.map((med, index) => (
                  <div key={index} className="medication-row-view">
                    <div className="treatment-detail-grid">
                      <div className="info-slot">
                        <label>Nombre</label>
                        <p>{med.name}</p>
                      </div>
                      <div className="info-slot">
                        <label>Dosis</label>
                        <p>{med.dose}</p>
                      </div>
                    </div>
                    {(med.frequency || med.duration) && (
                      <div className="treatment-detail-grid">
                        {med.frequency && (
                          <div className="info-slot">
                            <label>Frecuencia</label>
                            <p>{med.frequency}</p>
                          </div>
                        )}
                        {med.duration && (
                          <div className="info-slot">
                            <label>Duración</label>
                            <p>{med.duration}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {med.instructions && (
                      <div className="info-slot">
                        <label>Instrucciones</label>
                        <p>{med.instructions}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state-v2">Sin medicamentos registrados.</div>
              )
            )}

            {activeTab === "history" && (
              loadingHistory ? (
                <div className="empty-state-v2">Cargando historial...</div>
              ) : history.length > 0 ? (
                history.map((entry) => (
                  <div key={entry.id} className="treatment-history-entry">
                    <div className="treatment-history-entry-header">
                      <span className="badge badge-blue">Versión {entry.version}</span>
                      <span className="treatment-detail-date">
                        {entry.createdAt?.slice(0, 10)} · {entry.changedByName ?? "Desconocido"}
                      </span>
                    </div>

                    {entry.changeReason && (
                      <p className="treatment-history-reason">Motivo: {entry.changeReason}</p>
                    )}

                    <div className="treatment-detail-grid">
                      <div className="info-slot">
                        <label>Medicamentos previos</label>
                        {entry.previousMedications.length > 0 ? (
                          entry.previousMedications.map((med, i) => (
                            <p key={i}>{med.name} — {med.dose}</p>
                          ))
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                      <div className="info-slot">
                        <label>Nuevos medicamentos</label>
                        {entry.newMedications.map((med, i) => (
                          <p key={i}>{med.name} — {med.dose}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-v2">Sin cambios registrados aún.</div>
              )
            )}
          </section>
        </main>
      </div>

      <EditTreatmentModal
        treatment={isEditOpen ? treatment : null}
        onClose={() => setIsEditOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default TreatmentDetailPage;
