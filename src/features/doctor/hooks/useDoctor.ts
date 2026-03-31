import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDoctorSchema, type DoctorFormInput } from "../schemas/doctor.schema";
import { createDoctor } from "../services/doctor.service";
import { useUIStore } from "../../../store/ui.store";

export const useDoctor = (onSuccess?: () => void) => {
  const showToast = useUIStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormInput>({
    resolver: zodResolver(createDoctorSchema),
  });

  const onSubmit = async (data: DoctorFormInput) => {
    try {
      const res = await createDoctor(data);
      
      showToast(res.message || "Médico creado exitosamente", "success");
      
      if (onSuccess) onSuccess();
      reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al crear el médico";
      showToast(errorMessage, "error");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting
  };
};