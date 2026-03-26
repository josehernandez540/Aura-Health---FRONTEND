import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDoctorSchema } from "../schemas/doctor.schema";
import { createDoctor } from "../services/doctor.service";
import { useUIStore } from "../../../store/ui.store";

export const useDoctor = (onSuccess) => {
  const showToast = useUIStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createDoctorSchema),
  });

  const onSubmit = async (data) => {
    try {
      await createDoctor(data);
      showToast("Médico creado correctamente");
      if (onSuccess) onSuccess();
      reset();
    } catch (error) {
      const message = error.response?.status === 409 
        ? "El email ya está registrado" 
        : "Error creando médico";
        showToast(message,"error");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting
  };
};