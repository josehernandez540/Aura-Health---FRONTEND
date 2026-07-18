import React from "react";
import SearchInput from "../../../components/ui/Inputs/SearchInput";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import { type DocumentType } from "../services/record.service";

export interface RecordFilters {
  search: string;
  documentType: DocumentType | "";
}

interface RecordFilterBarProps {
  filters: RecordFilters;
  onChange: (key: keyof RecordFilters, value: string) => void;
}

const DOCUMENT_TYPE_OPTIONS = [
  { value: "", label: "Todos los tipos" },
  { value: "HISTORIA_CLINICA", label: "Historia clínica" },
  { value: "EXAMEN", label: "Examen" },
  { value: "DIAGNOSTICO", label: "Diagnóstico" },
];

const RecordFilterBar: React.FC<RecordFilterBarProps> = ({ filters, onChange }) => {
  return (
    <div className="audit-filters-bar">
      <SearchInput
        value={filters.search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("search", e.target.value)}
        placeholder="Buscar por paciente o médico..."
      />

      <SelectInput
        value={filters.documentType}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange("documentType", e.target.value)}
        options={DOCUMENT_TYPE_OPTIONS}
      />
    </div>
  );
};

export default RecordFilterBar;
