import { useEffect, useState, useCallback } from "react";
import { getAuditLogs, type AuditLog } from "../service/audit.service";

export interface AuditFilters {
  search: string;
  action: string;
  date: string;
}

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [filters, setFilters] = useState<AuditFilters>({
    search: "",
    action: "",
    date: "",
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs({
        page,
        limit: 10,
        action: filters.action,
        startDate: filters.date,
      });

      setLogs(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error cargando auditoría", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters.action, filters.date]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const updateFilters = (name: keyof AuditFilters, value: string) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return {
    logs,
    loading,
    page,
    totalPages,
    filters,
    updateFilters,
    setPage,
  };
};