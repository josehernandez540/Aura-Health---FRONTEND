import React from 'react';
import './AuditDetailModal.css';

const AuditDetailModal = ({ log, onClose }) => {
  if (!log) return null;

  const date = new Date(log.createdAt);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalle del Evento</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-group">
              <label>ID del Log</label>
              <span>{log.id}</span>
            </div>
            <div className="detail-group">
              <label>Severidad</label>
              <span className={`severity-tag ${log.severity.toLowerCase()}`}>
                {log.severity}
              </span>
            </div>
            <div className="detail-group">
              <label>Entidad Afectada</label>
              <span>{log.entityType} ({log.entityId || 'N/A'})</span>
            </div>
            <div className="detail-group">
              <label>Fecha Completa</label>
              <span>{date.toLocaleString()}</span>
            </div>
          </div>

          <div className="detail-section">
            <label>Usuario Responsable</label>
            <div className="user-card">
              <p><strong>Email:</strong> {log.user?.email}</p>
              <p><strong>Rol:</strong> {log.user?.role}</p>
              <p className="user-id">ID: {log.user?.id}</p>
            </div>
          </div>

          <div className="detail-section">
            <label>Metadata / Datos Extra</label>
            <pre className="metadata-json">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        </div>

        <div className="modal-footer">
          <button className="footer-close-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailModal;