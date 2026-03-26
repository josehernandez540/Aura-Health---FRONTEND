import { useState, useEffect } from "react";
import { getMedicos, toggleMedicoStatus } from "../services/doctor.service";

export const useMedicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      setMedicos(originalMedicos);
      alert("No se pudo cambiar el estado");
    }
  };

  useEffect(() => { fetchMedicos(); }, []);

  return { medicos, loading, handleToggleStatus };
};