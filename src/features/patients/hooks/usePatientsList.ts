import { useState, useEffect } from "react";
import { getPatients, togglePatientStatus, type Patient } from "../services/patient.services";
import { useUIStore } from "../../../store/ui.store";

export const usePatientsList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useUIStore((state) => state.showToast);
  

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data.items);
    } catch (error) {
      showToast("Error al cargar pacientes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await togglePatientStatus(id);
      showToast("Estado actualizado correctamente", "success");
      fetchPatients();
    } catch (error) {
      showToast("Error al cambiar el estado", "error");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return { patients, loading, handleToggleStatus, fetchPatients };
};