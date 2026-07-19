import React from "react";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import DateInput from "../../../components/ui/Inputs/DateInput";

interface Option {
  value: string;
  label: string;
}

interface ReportFiltersFormProps {
  register: any;
  errors: any;
  doctorOptions: Option[];
  patientOptions: Option[];
  loadingOptions: boolean;
}

const ReportFiltersForm: React.FC<ReportFiltersFormProps> = ({
  register,
  errors,
  doctorOptions,
  patientOptions,
  loadingOptions,
}) => {
  return (
    <div className="report-filters">
      <p className="report-filters-hint">
        Todos los filtros son opcionales. Si no seleccionas ninguno, el reporte
        incluirá información general de todo el sistema.
      </p>

      <div className="form-grid">
        <SelectInput
          label="Médico"
          options={doctorOptions}
          disabled={loadingOptions}
          {...register("doctorId")}
          error={errors.doctorId?.message}
        />

        <SelectInput
          label="Paciente"
          options={patientOptions}
          disabled={loadingOptions}
          {...register("patientId")}
          error={errors.patientId?.message}
        />
      </div>

      <div className="form-grid">
        <DateInput
          label="Fecha de inicio"
          {...register("startDate")}
          error={errors.startDate?.message}
        />

        <DateInput
          label="Fecha de fin"
          {...register("endDate")}
          error={errors.endDate?.message}
        />
      </div>
    </div>
  );
};

export default ReportFiltersForm;
