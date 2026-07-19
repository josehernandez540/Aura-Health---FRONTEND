import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById } from "../features/patients/services/patient.services";
import Button from "../components/ui/Button/Button";
import { getInitials, avatarColors } from "../utils/tableUtils";
import "./PatientDetail.css";
import { getRiskInfo } from "../utils/risk";
import { useRecordsList } from "../features/records/hooks/useRecords";
import { downloadMedicalRecordFile } from "../features/records/services/record.service";
import { useUIStore } from "../store/ui.store";
import { hasRole } from "../utils/hasRole";
import CreateAppointmentModal from "../features/appointments/components/CreateAppointmentModal";
import { useDownloadPatientReport } from "../features/reports/hooks/useReports";

const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  HISTORIA_CLINICA: "Historia clínica",
  EXAMEN: "Examen",
  DIAGNOSTICO: "Diagnóstico",
};

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("appointments");
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const showToast = useUIStore((state) => state.showToast);
  const isAdmin = hasRole(["ADMIN"]);
  const canGenerateReport = hasRole(["ADMIN", "DOCTOR"]);
  const { downloadReport, downloadingId } = useDownloadPatientReport();

  const { records, loading: loadingRecords } = useRecordsList({ patientId: id ?? "" });

  const fetchPatient = () => {
    if (id) {
      getPatientById(id).then(setPatient);
    }
  };

  useEffect(fetchPatient, [id]);

  const openRecordFile = async (recordId: string, fileName: string | null, mode: "view" | "download") => {
    try {
      const blob = await downloadMedicalRecordFile(recordId);
      const url = URL.createObjectURL(blob);

      if (mode === "view") {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName ?? "documento.pdf";
        link.click();
      }

      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      showToast("Error al abrir el archivo", "error");
    }
  };

  if (!patient) return <div className="loading-state">Cargando expediente...</div>;

  const risk = getRiskInfo(patient.diseaseCount);
  return (
    <div className="patient-detail-page animate-fadeIn">
      <nav className="detail-top-nav">
        <button onClick={() => navigate("/patients")} className="back-link">
          <img src="/icons/back.svg" alt="" className="icon-img-sm" />
          Volver al listado
        </button>
        <div className="detail-breadcrumb">
          Pacientes / <span className="current">{patient.name}</span>
        </div>
      </nav>

      <div className="detail-main-layout">
        <aside className="patient-sidebar-sticky">
          <div className="profile-header-card">
            <div className="avatar-circle" style={{ background: avatarColors[0] }}>
              {getInitials(patient.name)}
            </div>
            <h2 className="patient-name-display">{patient.name}</h2>
            <span className={`status-pill ${patient.is_active ? 'status-active' : 'status-inactive'}`}>
              {patient.is_active ? 'Paciente Activo' : 'Paciente Inactivo'}
            </span>
          </div>

          <div className="info-grid-sidebar">
            <div className="info-slot">
              <label>Identificación</label>
              <p>{patient.document_number}</p>
            </div>
            <div className="info-slot">
              <label>Correo Electrónico</label>
              <p className="truncate-text">{patient.email}</p>
            </div>
            <div className="info-slot">
              <label>Teléfono</label>
              <p>{patient.phone || "No registrado"}</p>
            </div>
            <div className="info-slot">
              <label>Edad / Nacimiento</label>
              <p>{patient.birth_date ? new Date(patient.birth_date).toLocaleDateString() : "---"}</p>
            </div>
          </div>
          
          {(isAdmin || canGenerateReport) && (
            <div className="sidebar-footer-actions">
              {isAdmin && (
                <Button
                  variant="primary"
                  style={{ width: '100%' }}
                  onClick={() => setIsCreateAppointmentOpen(true)}
                >
                  Nueva Cita
                </Button>
              )}

              {canGenerateReport && (
                <Button
                  variant="ghost"
                  style={{ width: '100%' }}
                  isLoading={downloadingId === id}
                  onClick={() => id && downloadReport(id, patient.name)}
                >
                  Generar Reporte
                </Button>
              )}
            </div>
          )}
        </aside>

        <main className="patient-history-area">
          <header className="history-header">
            <div className="history-title-row">
              <h1 className="section-title">Expediente Clínico</h1>

              <div className="risk-info-group">
                <span className="disease-count-pill" title="Cantidad de enfermedades registradas">
                  {patient.diseaseCount ?? 0} {patient.diseaseCount === 1 ? "enfermedad" : "enfermedades"}
                </span>
                <span className={`risk-badge ${risk.className}`}>
                  Riesgo {risk.label}
                </span>
              </div>
            </div>
            <div className="tabs-container">
              <button 
                className={`tab-item ${activeTab === "appointments" ? "active" : ""}`} 
                onClick={() => setActiveTab("appointments")}
              >
                Citas Médicas <span className="count-pill">{patient.appointments?.length || 0}</span>
              </button>
              <button
                className={`tab-item ${activeTab === "treatments" ? "active" : ""}`}
                onClick={() => setActiveTab("treatments")}
              >
                Tratamientos <span className="count-pill">{patient.treatments?.length || 0}</span>
              </button>
              <button
                className={`tab-item ${activeTab === "records" ? "active" : ""}`}
                onClick={() => setActiveTab("records")}
              >
                Historial PDF <span className="count-pill">{records.length}</span>
              </button>
            </div>
          </header>

          <section className="scrollable-panel">
            {activeTab === "appointments" && (
              <div className="cards-feed">
                {patient.appointments?.length > 0 ? (
                  patient.appointments.map((app: any) => (
                    <div key={app.id} className="appointment-card-v2">
                      <div className="card-indicator" data-status={app.status} />
                      <div className="card-content">
                        <div className="card-row-top">
                          <span className="app-date">
                            {new Date(app.date).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className={`status-pill status-${app.status.toLowerCase()}`}>
                            {app.status}
                          </span>
                        </div>
                        <h4 className="app-doctor">Dr. {app.doctors?.name}</h4>
                        <span className="app-specialty">{app.doctors?.specialization}</span>
                        <p className="app-notes">{app.notes || "Sin observaciones en esta cita."}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-v2">No hay registros de citas.</div>
                )}
              </div>
            )}

            {activeTab === "treatments" && (
              <div className="cards-feed">
                 {patient.treatments?.length > 0 ? (
                  patient.treatments.map((tr: any) => (
                    <div key={tr.id} className="treatment-card-v2">
                      <div className="card-content">
                        <div className="card-row-top">
                          <span className="badge-blue">{tr.status}</span>
                          <span className="card-date">Iniciado: {new Date(tr.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="treatment-text">{tr.description}</p>
                        <div className="treatment-footer">
                          <img src="/icons/doctor.svg" className="icon-img-sm" alt=""/>
                          <span>Prescrito por {tr.doctors?.name}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-v2">No hay tratamientos registrados.</div>
                )}
              </div>
            )}

            {activeTab === "records" && (
              <div className="cards-feed">
                {loadingRecords ? (
                  <div className="empty-state-v2">Cargando historial...</div>
                ) : records.length > 0 ? (
                  records.map((record) => (
                    <div key={record.id} className="record-card-v2">
                      <div className="card-content">
                        <div className="card-row-top">
                          <span className="badge badge-gray">
                            {record.documentType ? DOCUMENT_TYPE_LABEL[record.documentType] : "-"}
                          </span>
                          {record.isValidated ? (
                            <span className="badge status-completed">✓ Válido</span>
                          ) : (
                            <span className="badge status-pending">⚠ Pendiente validar</span>
                          )}
                        </div>
                        <h4 className="app-doctor">
                          <img src="/icons/documents.svg" className="icon-img-sm" alt="" />
                          {" "}{record.fileName ?? "Documento sin nombre"}
                        </h4>
                        <span className="app-specialty">
                          Subido por {record.uploadedBy?.name ?? "-"} · {record.createdAt.slice(0, 10)}
                        </span>
                        <div className="treatment-footer" style={{ marginTop: 12, gap: 12 }}>
                          <button className="back-link" onClick={() => openRecordFile(record.id, record.fileName, "view")}>
                            Ver
                          </button>
                          <button className="back-link" onClick={() => openRecordFile(record.id, record.fileName, "download")}>
                            Descargar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-v2">No hay historiales PDF registrados.</div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {isAdmin && (
        <CreateAppointmentModal
          isOpen={isCreateAppointmentOpen}
          initialPatientId={id}
          onClose={() => setIsCreateAppointmentOpen(false)}
          onSuccess={fetchPatient}
        />
      )}
    </div>
  );
};

export default PatientDetailPage;