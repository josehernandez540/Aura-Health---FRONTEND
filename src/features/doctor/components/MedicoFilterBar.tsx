import React from "react";
import SearchInput from "../../../components/ui/Inputs/SearchInput";
import SelectInput from "../../../components/ui/Inputs/SelectInput";

export interface MedicoFilters {
  search: string;
  specialization: string;
  status: string;
}

interface MedicoFilterBarProps {
  filters: MedicoFilters;
  onChange: (key: keyof MedicoFilters, value: string) => void;
}

const MedicoFilterBar: React.FC<MedicoFilterBarProps> = ({ filters, onChange }) => {
  const specs = [
    { value: "", label: "Todas las especialidades" },
    { value: "Cardiología", label: "Cardiología" },
    { value: "Medicina General", label: "Medicina General" },
    { value: "Pediatría", label: "Pediatría" },
  ];

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
          placeholder="Buscar por nombre, email o licencia..."
        />

        <SelectInput
          value={filters.specialization}
          onChange={(e) => onChange("specialization", e.target.value)}
          options={specs}
        />
        
        <SelectInput
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          options={statusOptions}
        />
    </div>
  );
};

export default MedicoFilterBar;