import { useEffect, useState } from "react";
import { getDashboardOverview, type DashboardOverview } from "../services/dashboard.service";
import { useUIStore } from "../../../store/ui.store";

export const useDashboard = () => {
  const showToast = useUIStore((state) => state.showToast);
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const overview = await getDashboardOverview();
        setData(overview);
      } catch {
        showToast("No se pudo cargar el panel principal", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
};
