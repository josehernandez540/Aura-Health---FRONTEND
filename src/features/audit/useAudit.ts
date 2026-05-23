import { useState, useEffect, useCallback } from 'react';
import { auditService } from './audit.service';
import type { AuditLog } from './audit.service';

export const useAudit = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPagesState, setTotalPagesState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const limit = 10;

  const fetchLogs = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await auditService.getLogs(currentPage, limit);
      if (response.success) {
        setLogs(response.data.items);
        setTotal(response.data.total);
        setTotalPagesState(response.data.totalPages);
      }
    } catch {
      setErrorMessage('No se pudieron cargar los registros de auditoría.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  const totalPages = totalPagesState;

  return { logs, total, page, setPage, totalPages, isLoading, errorMessage };
};