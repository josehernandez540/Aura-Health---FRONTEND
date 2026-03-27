import { useState } from "react";
import { getDoctorById, updateDoctor } from "../services/doctor.service";
import { useUIStore } from "../../../store/ui.store";

export const useDoctorDetail = () => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(false);

    const showToast = useUIStore((state) => state.showToast);

    const fetchDoctor = async (id) => {
        try {
            setLoading(true);
            const data = await getDoctorById(id);
            setDoctor(data);
        } catch (err) {
            showToast("Error cargando información del médico", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDoctor = async (id, payload, onSuccess) => {
        try {
            const res = await updateDoctor(id, payload);
            console.log(res)
            showToast( res.message, "success");
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