import React from "react";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import DateInput from "../../../components/ui/Inputs/DateInput";
import { PAGE_SIZE_OPTIONS, type AppointmentListFilters } from "../hooks/useAppointments";

interface AppointmentFilterBarProps {
  filters: AppointmentListFilters;
  onChange: (name: keyof AppointmentListFilters, value: string) => void;
  limit: number;
  onLimitChange: (value: number) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "SCHEDULED", label: "Programada" },
  { value: "COMPLETED", label: "Completada" },
  { value: "CANCELLED", label: "Cancelada" },
  { value: "NO_SHOW", label: "No asistió" },
];

const AppointmentFilterBar: React.FC<AppointmentFilterBarProps> = ({
  filters,
  onChange,
  limit,
  onLimitChange,
}) => {
  const limitOptions = PAGE_SIZE_OPTIONS.map((n) => ({ value: String(n), label: `${n} por página` }));

  return (
    <div className="audit-filters-bar" data-tour="appointments-filters">
      <SelectInput
        value={filters.status}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange("status", e.target.value)}
        options={STATUS_OPTIONS}
      />

      <DateInput
        value={filters.date}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("date", e.target.value)}
      />

      <SelectInput
        value={String(limit)}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onLimitChange(Number(e.target.value))}
        options={limitOptions}
      />
    </div>
  );
};

export default AppointmentFilterBar;
