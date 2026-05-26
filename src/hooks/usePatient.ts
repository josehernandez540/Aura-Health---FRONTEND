import { useState, useEffect } from 'react';
import { patientService } from '../features/patients/patient.service';
import type { Patient } from '../features/patients/patient.service';

export const usePatient = (id: string | undefined) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await patientService.getPatient(id);
        if (response.success) {
          const raw = response.data as unknown as Record<string, unknown>;
          setPatient({
            id: raw.id as string,
            name: raw.name as string,
            documentNumber: raw.document_number as string,
            birthDate: raw.birth_date as string,
            phone: raw.phone as string,
            email: raw.email as string,
            isActive: raw.is_active as boolean,
            createdAt: raw.created_at as string,
            updatedAt: raw.updated_at as string,
          });
        }
      } catch {
        setError('No se pudo cargar la información del paciente.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  return { patient, isLoading, error };
};
