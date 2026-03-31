import React from "react";
import SearchInput from "../../../components/ui/Inputs/SearchInput";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import DateInput from "../../../components/ui/Inputs/DateInput";
import { type AuditFilters } from "../hook/useAuditLogs";

interface AuditFilterBarProps {
  filters: AuditFilters;
  onChange: (name: keyof AuditFilters, value: string) => void;
}

const AuditFilterBar: React.FC<AuditFilterBarProps> = ({ filters, onChange }) => {
  const actionOptions = [
    { value: "", label: "Todas las actividades" },
    { value: "USER_LOGIN", label: "User Login" },
    { value: "USER_CREATED", label: "User Created" },
    { value: "PATIENT_CREATED", label: "Patient Created" },
  ];

  return (
    <div className="audit-filters-bar">
      <SearchInput
        value={filters.search}
        onChange={(e: any) => onChange("search", e.target.value)}
        placeholder="Buscar acción o usuario..."
      />
      <SelectInput
        value={filters.action}
        onChange={(e: any) => onChange("action", e.target.value)}
        options={actionOptions}
      />
      <DateInput
        value={filters.date}
        onChange={(e: any) => onChange("date", e.target.value)}
      />
    </div>
  );
};

export default AuditFilterBar;