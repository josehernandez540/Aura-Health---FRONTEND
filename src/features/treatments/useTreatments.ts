import { useState, useCallback } from 'react';
import { treatmentService } from './treatment.service';
import type { CreateTreatmentPayload } from './treatment.service';

export const useTreatments = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createTreatment = useCallback(
    async (payload: CreateTreatmentPayload): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      try {
        await treatmentService.create(payload);
        setSuccess('Tratamiento guardado exitosamente.');
        return true;
      } catch (err: unknown) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(
          axiosError?.response?.data?.message ||
            'No se pudo guardar el tratamiento. Intente nuevamente.'
        );
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  return { isSaving, error, success, setError, setSuccess, createTreatment };
};