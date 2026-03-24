import { useEffect, useState } from "react";
import { getAuditLogs } from "../service/audit.service";

export const useAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    action: "",
    date: "",
  });

  const fetchLogs = async () => {
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
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchLogs();
  }, [filters.action, filters.date]);

  return {
    logs,
    loading,
    page,
    totalPages,
    filters,
    setFilters,
    setPage,
  };
};