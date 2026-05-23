import { useState } from 'react';
import { useAudit } from './useAudit';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AuditTable = () => {
  const { logs, page, setPage, totalPages, isLoading, errorMessage } = useAudit();
  const [filter, setFilter] = useState('');

  const filteredLogs = logs.filter((log) => {
    const search = filter.toLowerCase();
    return (
      log.action?.toLowerCase().includes(search) ||
      log.user?.email?.toLowerCase().includes(search) ||
      log.userId?.toLowerCase().includes(search)
    );
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1a1a6e' }}>
        Registro de auditoría
      </h2>

      {/* Filtro */}
      <input
        type="text"
        placeholder="Buscar por usuario o acción..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '8px 16px',
          borderRadius: '999px',
          border: '1px solid #d1d5db',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {/* Error */}
      {errorMessage && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#dc2626',
          fontSize: '0.875rem',
          marginBottom: '1rem',
        }}>
          {errorMessage}
        </div>
      )}

      {/* Tabla */}
      {isLoading ? (
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Cargando registros...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#1a1a6e', color: '#ffffff' }}>
                <th style={thStyle}>Usuario</th>
                <th style={thStyle}>Rol</th>
                <th style={thStyle}>Acción</th>
                <th style={thStyle}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No hay registros disponibles
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} style={{ background: index % 2 === 0 ? '#f9fafb' : '#ffffff' }}>
                    <td style={tdStyle}>{log.user?.email || log.userId}</td>
                    <td style={tdStyle}>{log.user?.role || '—'}</td>
                    <td style={tdStyle}>{log.action}</td>
                    <td style={tdStyle}>{formatDate(log.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1.5rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={paginationBtnStyle(page === 1)}
          >
            ← Anterior
          </button>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={paginationBtnStyle(page === totalPages)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '0.8rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  color: '#374151',
};

const paginationBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '8px 20px',
  borderRadius: '999px',
  border: '1px solid #d1d5db',
  background: disabled ? '#f3f4f6' : '#1a1a6e',
  color: disabled ? '#9ca3af' : '#ffffff',
  fontSize: '0.875rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: '500',
});

export default AuditTable;