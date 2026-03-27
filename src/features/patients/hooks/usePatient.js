import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPatientSchema } from "../schemas/patient.schema";
import { createPatient } from "../services/patient.services";
import { useUIStore } from "../../../store/ui.store";

export const usePatient = (onSuccess) => {
  const showToast = useUIStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createPatientSchema),
  });

  const onSubmit = async (data) => {
    try {
      await createPatient(data);
      showToast("Paciente creado correctamente", "success");

      if (onSuccess) onSuccess();

      reset();
    } catch (error) {
      showToast(error.response.data.message, "error");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
};