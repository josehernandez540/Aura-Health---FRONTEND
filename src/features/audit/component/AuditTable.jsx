import { useEffect, useState } from "react";
import { useAuditLogs } from "../hook/useAuditLogs";
import AuditDetailModal from "./AuditModal";
import "./auditTable.css";
import AuditFilterBar from "./AuditFilterBar";

const AuditTable = () => {
  const { logs, loading, page, totalPages, filters, setFilters, setPage } =
    useAuditLogs();

  const [selectedLog, setSelectedLog] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredLogs = logs.filter((log) => {
    const search = filters.search.toLowerCase();

    return (
      log.action.toLowerCase().includes(search) ||
      (log.user?.email || "").toLowerCase().includes(search) ||
      (log.metadata?.name || "").toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <div className="audit-loading">Cargando auditoría...</div>;
  }

  const getBadgeConfig = (action) => {
    const config = { label: "INFO", class: "badge-login" };

    if (action.includes("CREATED")) {
      return { label: "CREATE", class: "badge-create" };
    }

    if (
      action.includes("UPDATED") ||
      action.includes("CHANGED") ||
      action.includes("APPROVED")
    ) {
      return { label: "UPDATE", class: "badge-update" };
    }

    if (action === "USER_LOGIN_FAILED") {
      return { label: "FAILED", class: "badge-delete" };
    }

    if (action.includes("CANCELLED") || action.includes("FAILED")) {
      return { label: "DELETE", class: "badge-delete" };
    }

    if (action === "USER_LOGIN") {
      return { label: "LOGIN", class: "badge-login" };
    }

    return config;
  };

  return (
    <>
      <AuditFilterBar
        filters={filters}
        onChange={(name, value) =>
          setFilters((prev) => ({
            ...prev,
            [name]: value,
          }))
        }
      />

      <div className="audit-container">
        <div className="audit-header">
          <h2>Log de Auditoría</h2>
          <span className="audit-subtitle">Últimas 24 horas</span>
        </div>

        <div className="audit-list">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const badge = getBadgeConfig(log.action);
              const date = new Date(log.createdAt);

              return (
                <div
                  key={log.id}
                  className="audit-item"
                  onClick={() => setSelectedLog(log)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="audit-col-action">
                    <span className={`badge ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="audit-col-info">
                    <div className="audit-main-text">
                      <span className="entity-type">
                        {log.action.replace(/_/g, " ")}
                      </span>
                      {log.metadata?.name ? ` — ${log.metadata.name}` : ""}
                    </div>
                    <div className="audit-sub-text">
                      <span className="user-email">
                        [{log.user?.email || "email protected"}]
                      </span>
                      {log.metadata?.details && (
                        <span className="details">
                          {" "}
                          • {log.metadata.details}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="audit-col-time">
                    {date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="audit-empty">
              No se encontraron resultados locales.
            </div>
          )}
        </div>

        <div className="audit-pagination">
          <button
            className="pag-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            <img src="icons/back.svg" alt="" className="icon-img" />
          </button>

          <span className="pag-info">
            Página <strong>{page}</strong> de {totalPages}
          </span>

          <button
            className="pag-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            <img src="icons/next.svg" alt="" className="icon-img" />
          </button>
        </div>
        {selectedLog && (
          <AuditDetailModal
            log={selectedLog}
            onClose={() => setSelectedLog(null)}
          />
        )}
      </div>
    </>
  );
};

export default AuditTable;
