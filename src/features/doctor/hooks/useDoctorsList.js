import { useState, useEffect } from "react";
import { getMedicos, toggleMedicoStatus } from "../services/doctor.service";
import { useUIStore } from "../../../store/ui.store";

export const useMedicos = () => {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const showToast = useUIStore((state) => state.showToast);
    

  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const data = await getMedicos();
      setMedicos(data);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const originalMedicos = [...medicos];
    setMedicos(prev => prev.map(m => m.id === id ? { ...m, is_active: !m.is_active } : m));

    try {
      await toggleMedicoStatus(id);
      showToast("Estado de Medico Cambiado");
    } catch (error) {
      setMedicos(originalMedicos);
      showToast("No se pudo cambiar el estado del Medico", "error");
    }
  };

  useEffect(() => { fetchMedicos(); }, []);

  return { medicos, loading, handleToggleStatus, fetchMedicos };
};