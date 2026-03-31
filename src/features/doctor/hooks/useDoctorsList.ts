import { useState, useEffect } from "react";
import { getMedicos, toggleMedicoStatus, type Doctor } from "../services/doctor.service";
import { useUIStore } from "../../../store/ui.store";

export const useMedicos = () => {
  const [medicos, setMedicos] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const showToast = useUIStore((state) => state.showToast);

  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const data = await getMedicos();
      setMedicos(data);
    } catch (error) {
      console.error("Error al obtener médicos:", error);
      showToast("No se pudieron cargar los médicos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const originalMedicos = [...medicos];
    
    setMedicos(prev => 
      prev.map(m => m.id === id ? { ...m, is_active: !m.is_active } : m)
    );

    try {
      const res = await toggleMedicoStatus(id);
      showToast(res.message || "Estado actualizado", "success");
    } catch (error) {
      setMedicos(originalMedicos);
      showToast("No se pudo cambiar el estado del médico", "error");
    }
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  return { 
    medicos, 
    loading, 
    handleToggleStatus, 
    fetchMedicos 
  };
};