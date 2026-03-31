import { useState } from "react";
import { getDoctorById, updateDoctor, type DoctorDetail } from "../services/doctor.service";
import { useUIStore } from "../../../store/ui.store";

export const useDoctorDetail = () => {
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const showToast = useUIStore((state) => state.showToast);

  const fetchDoctor = async (id: string) => {
    try {
      setLoading(true);
      const data = await getDoctorById(id);
      setDoctor(data as DoctorDetail);
    } catch (err) {
      showToast("Error cargando información del médico", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDoctor = async (
    id: string, 
    payload: any,
    onSuccess?: () => void
  ) => {
    try {
      const res = await updateDoctor(id, payload);
      showToast(res.message || "Médico actualizado", "success");
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast("Error actualizando médico", "error");
    }
  };

  return {
    doctor,
    loading,
    fetchDoctor,
    handleUpdateDoctor,
  };
};