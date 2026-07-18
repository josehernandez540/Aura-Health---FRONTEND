import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTreatmentSchema,
  updateTreatmentSchema,
  type CreateTreatmentFormInput,
  type UpdateTreatmentFormInput,
} from "../schemas/treatment.schema";
import {
  getTreatments,
  getTreatmentById,
  createTreatment,
  approveTreatment,
  updateTreatment,
  updateTreatmentStatus,
  getTreatmentHistory,
  type Treatment,
  type GetTreatmentsParams,
  type TreatmentHistoryEntry,
  type TreatmentStatus,
} from "../services/treatment.service";
import { useUIStore } from "../../../store/ui.store";

export const useTreatmentsList = (filters: GetTreatmentsParams = {}) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useUIStore((state) => state.showToast);

  const fetchTreatments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTreatments(filters);
      setTreatments(data.items);
    } catch (error) {
      showToast("Error al cargar los tratamientos", "error");
    } finally {
      setLoading(false);
    }
  }, [filters.patientId, filters.doctorId, filters.status, showToast]);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  return { treatments, loading, fetchTreatments };
};

export const useTreatmentDetail = (id: string | null) => {
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(false);
  const showToast = useUIStore((state) => state.showToast);

  const fetchTreatment = useCallback(() => {
    if (!id) {
      setTreatment(null);
      return;
    }

    setLoading(true);
    getTreatmentById(id)
      .then(setTreatment)
      .catch(() => showToast("Error al cargar el detalle del tratamiento", "error"))
      .finally(() => setLoading(false));
  }, [id, showToast]);

  useEffect(() => {
    fetchTreatment();
  }, [fetchTreatment]);

  return { treatment, loading, refetch: fetchTreatment };
};

const emptyMedication = { name: "", dose: "", frequency: "", duration: "", instructions: "" };

export const useCreateTreatment = (onSuccess?: () => void) => {
  const showToast = useUIStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTreatmentFormInput>({
    resolver: zodResolver(createTreatmentSchema),
    defaultValues: {
      patientId: "",
      description: "",
      medications: [emptyMedication],
      requiresApproval: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "medications" });

  const onSubmit = async (data: CreateTreatmentFormInput) => {
    try {
      await createTreatment(data);
      showToast("Tratamiento creado correctamente", "success");

      if (onSuccess) onSuccess();

      reset();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al crear el tratamiento";
      showToast(message, "error");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    reset,
    watch,
    medicationFields: fields,
    addMedication: () => append(emptyMedication),
    removeMedication: remove,
  };
};

export const useTreatmentHistory = (treatmentId: string | null) => {
  const [history, setHistory] = useState<TreatmentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const showToast = useUIStore((state) => state.showToast);

  useEffect(() => {
    if (!treatmentId) {
      setHistory([]);
      return;
    }

    setLoading(true);
    getTreatmentHistory(treatmentId)
      .then(setHistory)
      .catch(() => showToast("Error al cargar el historial de cambios", "error"))
      .finally(() => setLoading(false));
  }, [treatmentId, showToast]);

  return { history, loading };
};

export const useUpdateTreatment = (
  treatment: Treatment | null,
  onSuccess?: () => void
) => {
  const showToast = useUIStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTreatmentFormInput>({
    resolver: zodResolver(updateTreatmentSchema),
    defaultValues: {
      description: "",
      medications: [emptyMedication],
      reason: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "medications" });

  useEffect(() => {
    if (treatment) {
      reset({
        description: treatment.description,
        medications:
          treatment.medications.length > 0 ? treatment.medications : [emptyMedication],
        reason: "",
      });
    }
  }, [treatment, reset]);

  const onSubmit = async (data: UpdateTreatmentFormInput) => {
    if (!treatment) return;

    try {
      await updateTreatment(treatment.id, data);
      showToast("Tratamiento actualizado correctamente", "success");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al actualizar el tratamiento";
      showToast(message, "error");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    medicationFields: fields,
    addMedication: () => append(emptyMedication),
    removeMedication: remove,
  };
};

export const useUpdateTreatmentStatus = (onSuccess?: () => void) => {
  const showToast = useUIStore((state) => state.showToast);
  const [changingStatus, setChangingStatus] = useState(false);

  const changeStatus = async (id: string, status: TreatmentStatus) => {
    try {
      setChangingStatus(true);
      await updateTreatmentStatus(id, status);
      showToast("Estado del tratamiento actualizado correctamente", "success");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al actualizar el estado del tratamiento";
      showToast(message, "error");
    } finally {
      setChangingStatus(false);
    }
  };

  return { changeStatus, changingStatus };
};

export const useApproveTreatment = (onSuccess?: () => void) => {
  const showToast = useUIStore((state) => state.showToast);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const approve = async (id: string) => {
    try {
      setApprovingId(id);
      await approveTreatment(id);
      showToast("Tratamiento aprobado correctamente", "success");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al aprobar el tratamiento";
      showToast(message, "error");
    } finally {
      setApprovingId(null);
    }
  };

  return { approve, approvingId };
};
