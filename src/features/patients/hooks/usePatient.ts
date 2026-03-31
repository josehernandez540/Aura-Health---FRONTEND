import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPatientSchema, type PatientFormInput } from "../schemas/patient.schema";
import { createPatient } from "../services/patient.services";
import { useUIStore } from "../../../store/ui.store";

export const usePatient = (onSuccess?: () => void) => {
  const showToast = useUIStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormInput>({
    resolver: zodResolver(createPatientSchema),
  });

  const onSubmit = async (data: PatientFormInput) => {
    try {
      await createPatient(data);
      showToast("Paciente creado correctamente", "success");

      if (onSuccess) onSuccess();

      reset();
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al crear el paciente";
      showToast(message, "error");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
};