import React from "react";
import SearchInput from "../../../components/ui/Inputs/SearchInput";
import SelectInput from "../../../components/ui/Inputs/SelectInput";

export interface PatientFilters {
  search: string;
  status: string;
}

interface PatientFilterBarProps {
  filters: PatientFilters;
  onChange: (key: keyof PatientFilters, value: string) => void;
}

const PatientFilterBar: React.FC<PatientFilterBarProps> = ({ filters, onChange }) => {
  const statusOptions = [
    { value: "", label: "Todos los estados" },
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" },
  ];

  return (
    <div className="audit-filters-bar">
      <SearchInput
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
        placeholder="Buscar por nombre, documento o email..."
      />

      <SelectInput
        value={filters.status}
        onChange={(e) => onChange("status", e.target.value)}
        options={statusOptions}
      />
    </div>
  );
};

export default PatientFilterBar;