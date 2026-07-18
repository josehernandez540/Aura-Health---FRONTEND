import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAppointmentSchema,
  type AppointmentFormInput,
  cancelAppointmentSchema,
  type CancelAppointmentFormInput,
} from "../schemas/appointment.schema";
import {
  getAppointments,
  createAppointment,
  cancelAppointment,
  type Appointment,
} from "../services/appointment.service";
import { useUIStore } from "../../../store/ui.store";

export const SLOT_DURATION_MINUTES = 30;

export const DAILY_SLOTS = [
  "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30",
];

const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const useAppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useUIStore((state) => state.showToast);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data.items);
    } catch (error) {
      showToast("Error al cargar las citas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return { appointments, loading, fetchAppointments };
};

interface SlotState {
  time: string;
  endTime: string;
  status: "available" | "occupied";
}

export const useAvailableSlots = (doctorId: string, date: string) => {
  const [occupied, setOccupied] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId || !date) {
      setOccupied(new Set());
      return;
    }

    let cancelled = false;

    const fetchOccupied = async () => {
      try {
        setLoading(true);
        const data = await getAppointments({ doctorId, date, status: "SCHEDULED" });
        if (cancelled) return;

        const busy = new Set<string>();
        DAILY_SLOTS.forEach((slot) => {
          const slotEnd = addMinutes(slot, SLOT_DURATION_MINUTES);
          const overlaps = data.items.some(
            (apt) => slot < apt.endTime && slotEnd > apt.startTime
          );
          if (overlaps) busy.add(slot);
        });
        setOccupied(busy);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOccupied();

    return () => {
      cancelled = true;
    };
  }, [doctorId, date]);

  const slots: SlotState[] = useMemo(
    () =>
      DAILY_SLOTS.map((time) => ({
        time,
        endTime: addMinutes(time, SLOT_DURATION_MINUTES),
        status: occupied.has(time) ? "occupied" : "available",
      })),
    [occupied]
  );

  return { slots, loading };
};

export const useCreateAppointment = (onSuccess?: () => void) => {
  const showToast = useUIStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormInput>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      doctorId: "",
      patientId: "",
      date: "",
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  const onSubmit = async (data: AppointmentFormInput) => {
    try {
      await createAppointment(data);
      showToast("Cita creada correctamente", "success");

      if (onSuccess) onSuccess();

      reset();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al crear la cita";
      showToast(message, "error");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    setValue,
    watch,
    reset,
  };
};

export const useCancelAppointment = (
  appointmentId: string | null,
  onSuccess?: () => void
) => {
  const showToast = useUIStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CancelAppointmentFormInput>({
    resolver: zodResolver(cancelAppointmentSchema),
    defaultValues: { reason: "" },
  });

  const onSubmit = async (data: CancelAppointmentFormInput) => {
    if (!appointmentId) return;

    try {
      await cancelAppointment(appointmentId, data.reason);
      showToast("Cita cancelada correctamente", "success");

      if (onSuccess) onSuccess();

      reset();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al cancelar la cita";
      showToast(message, "error");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    reset,
  };
};
