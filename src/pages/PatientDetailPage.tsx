import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById } from "../features/patients/services/patient.services";
import Button from "../components/ui/Button/Button";
import { getInitials, avatarColors } from "../utils/tableUtils";
import "./PatientDetail.css";

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    if (id) {
      getPatientById(id).then(setPatient);
    }
  }, [id]);

  if (!patient) return <div className="loading-state">Cargando expediente...</div>;

  return (
    <div className="patient-detail-page animate-fadeIn">
      {/* Barra de Navegación Superior Limpia */}
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
        {/* SIDEBAR FIJO: Información crítica */}
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
          
          <div className="sidebar-footer-actions">
             <Button variant="primary" style={{width: '100%'}}>Nueva Cita</Button>
          </div>
        </aside>

        {/* CONTENIDO SCROLLABLE: Historial Clínico */}
        <main className="patient-history-area">
          <header className="history-header">
            <h1 className="section-title">Expediente Clínico</h1>
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
          </section>
        </main>
      </div>
    </div>
  );
};

export default PatientDetailPage;