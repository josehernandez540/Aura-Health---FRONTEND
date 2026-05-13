import { useState, useCallback } from 'react';
import { appointmentsService } from '../features/appointments/appointments.service';
import type { Doctor, Patient, Appointment, CreateAppointmentPayload } from '../features/appointments/appointments.service';

export const useAppointments = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [docRes, patRes, aptRes] = await Promise.all([
        appointmentsService.getDoctors(),
        appointmentsService.getPatients(),
        appointmentsService.getAll(),
      ]);
      setDoctors(docRes.data.items.filter((d) => d.is_active));
      setPatients(patRes.data.items.filter((p) => p.is_active));
      setAppointments(aptRes.data.items);
    } catch {
      setError('No se pudieron cargar los datos. Verifique su conexión.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAppointments = useCallback(async () => {
    try {
      const aptRes = await appointmentsService.getAll();
      setAppointments(aptRes.data.items);
    } catch {
      // silent — calendar dots may be stale but non-blocking
    }
  }, []);

  const createAppointment = useCallback(async (payload: CreateAppointmentPayload): Promise<boolean> => {
    setIsSaving(true);
    try {
      await appointmentsService.createAppointment(payload);
      return true;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    doctors,
    patients,
    appointments,
    isLoading,
    isSaving,
    error,
    success,
    setError,
    setSuccess,
    loadData,
    createAppointment,
    refreshAppointments,
  };
};
