import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  uploadRecordSchema,
  type UploadRecordFormInput,
  validatePdfFile,
} from "../schemas/record.schema";
import {
  getMedicalRecords,
  uploadMedicalRecord,
  validateMedicalRecord,
  type MedicalRecord,
  type GetRecordsParams,
} from "../services/record.service";
import { useUIStore } from "../../../store/ui.store";

export const useRecordsList = (filters: GetRecordsParams) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useUIStore((state) => state.showToast);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMedicalRecords(filters);
      setRecords(data.items);
    } catch (error) {
      showToast("Error al cargar los registros clínicos", "error");
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.documentType, showToast]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, loading, fetchRecords };
};

export const useUploadRecord = (onSuccess?: () => void) => {
  const showToast = useUIStore((state) => state.showToast);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<UploadRecordFormInput>({
    resolver: zodResolver(uploadRecordSchema),
  });

  const selectFile = useCallback((candidate: File) => {
    const error = validatePdfFile(candidate);
    setFileError(error);
    setFile(error ? null : candidate);
  }, []);

  const reset = useCallback(() => {
    resetForm();
    setFile(null);
    setFileError(null);
  }, [resetForm]);

  const onSubmit = async (data: UploadRecordFormInput) => {
    if (!file) {
      setFileError("El archivo PDF es requerido");
      return;
    }

    try {
      setIsSubmitting(true);
      await uploadMedicalRecord({ ...data, file });
      showToast("Documento subido correctamente", "success");

      if (onSuccess) onSuccess();

      reset();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al subir el documento";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    file,
    fileError,
    selectFile,
    reset,
  };
};

export const useValidateRecord = (onSuccess?: () => void) => {
  const showToast = useUIStore((state) => state.showToast);
  const [validatingId, setValidatingId] = useState<string | null>(null);

  const validate = async (id: string) => {
    try {
      setValidatingId(id);
      await validateMedicalRecord(id);
      showToast("Registro validado correctamente", "success");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al validar el registro";
      showToast(message, "error");
    } finally {
      setValidatingId(null);
    }
  };

  return { validate, validatingId };
};
