import { useMemo } from 'react';
import type { Appointment } from '../features/appointments/appointments.service';

interface UseAvailabilityParams {
  appointments: Appointment[];
  doctorId: string;
  selectedDate: string | null;
}

interface UseAvailabilityReturn {
  occupiedDates: Set<string>;
  occupiedSlots: Set<string>;
  isSlotAvailable: (slot: string) => boolean;
}

const useAvailability = ({
  appointments,
  doctorId,
  selectedDate,
}: UseAvailabilityParams): UseAvailabilityReturn => {
  const occupiedDates = useMemo(
    () =>
      new Set(
        appointments
          .filter((a) => a.doctorId === doctorId && a.status === 'SCHEDULED')
          .map((a) => a.date.split('T')[0]),
      ),
    [appointments, doctorId],
  );

  const occupiedSlots = useMemo(
    () =>
      new Set(
        appointments
          .filter(
            (a) =>
              a.doctorId === doctorId &&
              a.status === 'SCHEDULED' &&
              a.date.split('T')[0] === selectedDate,
          )
          .map((a) => a.startTime),
      ),
    [appointments, doctorId, selectedDate],
  );

  const isSlotAvailable = useMemo(
    () => (slot: string) => !occupiedSlots.has(slot),
    [occupiedSlots],
  );

  return { occupiedDates, occupiedSlots, isSlotAvailable };
};

export default useAvailability;
