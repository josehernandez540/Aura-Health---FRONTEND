import { useCallback, useEffect, useState } from "react";
import { fetchAnalyticsOverview, type AnalyticsOverview } from "../services/analytics.service";
import { useUIStore } from "../../../store/ui.store";

export const DATE_RANGE_OPTIONS = [
  { value: 7, label: "Últimos 7 días" },
  { value: 30, label: "Últimos 30 días" },
  { value: 90, label: "Últimos 90 días" },
];

export const useAnalytics = () => {
  const showToast = useUIStore((state) => state.showToast);
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const overview = await fetchAnalyticsOverview(days);
      setData(overview);
    } catch {
      showToast("No se pudieron cargar las analíticas", "error");
    } finally {
      setLoading(false);
    }
  }, [days, showToast]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { days, setDays, data, loading, refetch };
};
