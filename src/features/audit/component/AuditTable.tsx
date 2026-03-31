import React, { useState } from "react";
import { useAuditLogs } from "../hook/useAuditLogs";
import { type AuditLog } from "../service/audit.service";
import AuditDetailModal from "./AuditModal.js";
import AuditFilterBar from "./AuditFilterBar.tsx";
import "./auditTable.css";

const AuditTable: React.FC = () => {
  const { logs, loading, page, totalPages, filters, updateFilters, setPage } = useAuditLogs();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const search = filters.search.toLowerCase();
    return (
      log.action.toLowerCase().includes(search) ||
      (log.user?.email || "").toLowerCase().includes(search) ||
      (log.metadata?.name || "").toLowerCase().includes(search)
    );
  });

  const getBadgeConfig = (action: string) => {
    if (action.includes("CREATED")) return { label: "CREATE", class: "badge-create" };
    if (action.includes("UPDATED") || action.includes("CHANGED")) return { label: "UPDATE", class: "badge-update" };
    if (action.includes("FAILED") || action.includes("CANCELLED")) return { label: "ALERT", class: "badge-delete" };
    if (action.includes("LOGIN")) return { label: "AUTH", class: "badge-login" };
    return { label: "INFO", class: "badge-login" };
  };

  if (loading) return <div className="audit-loading">Cargando auditoría...</div>;

  return (
    <>
      <AuditFilterBar filters={filters} onChange={updateFilters} />

      <div className="audit-container">
        <div className="audit-header">
          <h2>Log de Auditoría</h2>
          <span className="audit-subtitle">Actividad del sistema</span>
        </div>

        <div className="audit-list">
          {filteredLogs.map((log) => {
            const badge = getBadgeConfig(log.action);
            return (
              <div 
                key={log.id} 
                className="audit-item" 
                onClick={() => { setSelectedLog(log); setIsModalOpen(true); }}
              >
                <div className="audit-col-action">
                  <span className={`badge ${badge.class}`}>{badge.label}</span>
                </div>

                <div className="audit-col-info">
                  <div className="audit-main-text">
                    <span className="entity-type">{log.action.replace(/_/g, " ")}</span>
                    {log.metadata?.name && ` — ${log.metadata.name}`}
                  </div>
                  <div className="audit-sub-text">
                    <span className="user-email">[{log.user?.email || "System"}]</span>
                  </div>
                </div>

                <div className="audit-col-time">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="audit-pagination">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="pag-btn">
            <img src="icons/back.svg" alt="Atrás" />
          </button>
          <span className="pag-info">Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="pag-btn">
            <img src="icons/next.svg" alt="Siguiente" />
          </button>
        </div>

        <AuditDetailModal 
          log={selectedLog} 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
        />
      </div>
    </>
  );
};

export default AuditTable;