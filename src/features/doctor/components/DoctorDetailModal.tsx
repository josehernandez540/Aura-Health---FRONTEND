import React from "react";
import Modal from "../../../components/ui/Modal/Modal";
import {type DoctorDetail } from "../services/doctor.service";
import "./doctorDetail.css";

interface DoctorDetailProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorDetail | null;
  loading: boolean;
}

const DoctorDetailModal: React.FC<DoctorDetailProps> = ({ isOpen, onClose, doctor, loading }) => {
  if (loading || !doctor) return null;

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const statusConfig: Record<string, { label: string; class: string }> = {
    SCHEDULED: { label: "Programada", class: "status-scheduled" },
    COMPLETED: { label: "Completada", class: "status-completed" },
    CANCELLED: { label: "Cancelada", class: "status-cancelled" },
    PENDING_APPROVAL: { label: "Pendiente", class: "status-pending" },
    ACTIVE: { label: "Activo", class: "status-active" }
  };

  const getStatusLabel = (status: string) => statusConfig[status]?.label || status;
  const getStatusClass = (status: string) => statusConfig[status]?.class || "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle Profesional"
      size="lg"
    >
      <div className="detail-container">
        
        <div className="detail-header-new">
          <div className="header-left">
            <div className="detail-avatar">{getInitials(doctor.name)}</div>
            <div className="identity-text">
              <h2>{doctor.name}</h2>
              <span className="detail-spec">{doctor.specialization}</span>
            </div>
          </div>

          <div className="header-right">
            <div className="info-row">
              <span className={`status-dot ${doctor.isActive ? 'active' : 'inactive'}`}>
                {doctor.isActive ? "Médico Activo" : "Médico Inactivo"}
              </span>
            </div>
            <div className="info-technical">
              <p><span>Licencia:</span> {doctor.licenseNumber}</p>
              <p><span>Email:</span> {doctor.user?.email}</p>
              <p><span>ID:</span> <code className="id-code">{doctor.id.slice(0, 8)}...</code></p>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-val">{doctor.stats.totalAppointments}</span>
            <span className="stat-lbl">Citas Totales</span>
          </div>
          <div className="stat-card">
            <span className="stat-val">{doctor.stats.uniquePatients}</span>
            <span className="stat-lbl">Pacientes Únicos</span>
          </div>
          <div className="stat-card accent">
            <span className="stat-val">{doctor.stats.activeTreatments}</span>
            <span className="stat-lbl">Tratamientos Activos</span>
          </div>
        </div>

        <div className="detail-sections">
          <section className="detail-list-section">
            <h3> <img src="icons/date.svg" className="icon-img"/> Próximas Citas</h3>
            <div className="scroll-list">
              {doctor.appointments.length === 0 ? (
                <p className="empty-text">No hay citas registradas</p>
              ) : (
                doctor.appointments.map((a) => (
                  <div key={a.id} className="list-item">
                    <div className="item-info">
                      <strong>{a.patient.name}</strong>
                      <span>{new Date(a.date).toLocaleDateString()} · {a.notes}</span>
                    </div>
                    <span className={`status-pill ${getStatusClass(a.status)}`}>
                      {getStatusLabel(a.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="detail-list-section">
            <h3> <img src="icons/tratment.svg" className="icon-img"/>  Tratamientos Asignados</h3>
            <div className="scroll-list">
              {doctor.treatments.length === 0 ? (
                <p className="empty-text">No hay tratamientos activos</p>
              ) : (
                doctor.treatments.map((t) => (
                  <div key={t.id} className="list-item">
                    <div className="item-info">
                      <strong>{t.patient.name}</strong>
                      <span className="truncate-text">{t.description}</span>
                    </div>
                    <span className={`status-pill ${getStatusClass(t.status)}`}>
                      {getStatusLabel(t.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
};

export default DoctorDetailModal;