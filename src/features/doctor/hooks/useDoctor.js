import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDoctorSchema } from "../schemas/doctor.schema";
import { createDoctor } from "../services/doctor.service";

export const useDoctor = (onSuccess) => {
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
      if (onSuccess) onSuccess();
      reset();
      alert("Médico creado correctamente");
    } catch (error) {
      const message = error.response?.status === 409 
        ? "El email ya está registrado" 
        : "Error creando médico";
      alert(message);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting
  };
};