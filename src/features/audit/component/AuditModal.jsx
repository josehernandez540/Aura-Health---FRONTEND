import React from "react";
import "./AuditDetailModal.css";
import Modal from "../../../components/ui/Modal/Modal";
import Button from "../../../components/ui/Button/Button";

const AuditDetailModal = ({ log, isModalOpen, setIsModalOpen }) => {
  if (!log) return null;

  const date = new Date(log.createdAt);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Detalle del Evento"
      titleClassName="modal-title-accent"
      size="lg"
      footer={
        <Button onClick={() => setIsModalOpen(false)} variant="ghost">
          Cerrar
        </Button>
      }
    >
      <div className="detail-grid">
        <div className="detail-group">
          <label>ID del Log</label>
          <span>{log.id}</span>
        </div>

        <div className="detail-group">
          <label>Severidad</label>
          <span className={`badge badge-${log.severity.toLowerCase()}`}>
            {log.severity}
          </span>
        </div>

        <div className="detail-group">
          <label>Entidad Afectada</label>
          <span>
            {log.entityType}{" "}
            <span className="id-code">{log.entityId || "N/A"}</span>
          </span>
        </div>

        <div className="detail-group">
          <label>Fecha Completa</label>
          <span>{date.toLocaleString()}</span>
        </div>
      </div>

      <div className="detail-section">
        <label>Usuario Responsable</label>
        <div className="audit-user-card">
          <p>
            <strong>Email:</strong> {log.user?.email}
          </p>
          <p>
            <strong>Rol:</strong> {log.user?.role}
          </p>
          <p className="user-id">ID: {log.user?.id}</p>
        </div>
      </div>

      <div className="detail-section">
        <label>Metadata / Datos Extra</label>
        <pre className="metadata-json">
          {JSON.stringify(log.metadata, null, 2)}
        </pre>
      </div>
    </Modal>
  );
};

export default AuditDetailModal;
