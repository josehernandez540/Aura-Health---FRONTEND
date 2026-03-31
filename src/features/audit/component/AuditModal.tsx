import React from "react";
import "./AuditDetailModal.css";
import Modal from "../../../components/ui/Modal/Modal";
import Button from "../../../components/ui/Button/Button";
import { type AuditLog } from "../service/audit.service";

interface AuditDetailLog extends AuditLog {
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  entityType: string;
  entityId?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface AuditDetailModalProps {
  log: AuditDetailLog | AuditLog | null;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  log,
  isModalOpen,
  setIsModalOpen,
}) => {
  if (!log) return null;

  const detailedLog = log as AuditDetailLog;
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
          <span
            className={`badge badge-${detailedLog.severity?.toLowerCase() || "info"}`}
          >
            {detailedLog.severity || "INFO"}
          </span>
        </div>

        <div className="detail-group">
          <label>Entidad Afectada</label>
          <span>
            {detailedLog.entityType || "SYSTEM"}{" "}
            <span className="id-code">{detailedLog.entityId || "N/A"}</span>
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
            <strong>Email:</strong> {log.user?.email || "N/A"}
          </p>
          <p>
            <strong>Rol:</strong> {detailedLog.user?.role || "N/A"}
          </p>
          <p className="user-id">ID: {detailedLog.user?.id || "N/A"}</p>
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
