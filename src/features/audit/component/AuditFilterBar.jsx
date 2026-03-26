import SearchInput from "../../../components/ui/Inputs/SearchInput";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import DateInput from "../../../components/ui/Inputs/DateInput";

const AuditFilterBar = ({ filters, onChange }) => {
  const handleChange = (name) => (e) => {
    onChange(name, e.target.value);
  };

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
        onChange={handleChange("search")}
        placeholder="Buscar acción, usuario o entidad..."
      />

      <SelectInput
        value={filters.action}
        onChange={handleChange("action")}
        options={actionOptions}
      />

      <DateInput
        value={filters.date}
        onChange={handleChange("date")}
      />
    </div>
  );
};

export default AuditFilterBar;