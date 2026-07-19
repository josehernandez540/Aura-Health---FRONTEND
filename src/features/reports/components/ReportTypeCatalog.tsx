import React from "react";

interface ReportTypeDef {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
}

const REPORT_TYPES: ReportTypeDef[] = [
  {
    icon: "document-chart.svg",
    title: "Resumen de Citas",
    description: "Total de citas, pacientes y tratamientos por período, médico y/o paciente.",
    enabled: true,
  },
  {
    icon: "warning.svg",
    title: "Pacientes por Nivel de Riesgo",
    description: "Distribución de pacientes según clasificación automática de riesgo.",
    enabled: false,
  },
  {
    icon: "user-group.svg",
    title: "Rendimiento por Médico",
    description: "Número de citas, inasistencias y tratamientos activos por médico.",
    enabled: false,
  },
  {
    icon: "tratment.svg",
    title: "Reporte de Tratamientos",
    description: "Tratamientos activos, finalizados y pendientes de aprobación.",
    enabled: false,
  },
];

interface ReportTypeCatalogProps {
  onSelect: () => void;
}

const ReportTypeCatalog: React.FC<ReportTypeCatalogProps> = ({ onSelect }) => {
  return (
    <div className="report-type-catalog">
      {REPORT_TYPES.map((type) => (
        <button
          key={type.title}
          type="button"
          className={`report-type-card ${!type.enabled ? "is-disabled" : ""}`}
          onClick={type.enabled ? onSelect : undefined}
          disabled={!type.enabled}
        >
          <img src={`/icons/${type.icon}`} width={20} alt="" className="icon-img-color" />
          <div className="report-type-text">
            <div className="report-type-title">
              {type.title}
              {!type.enabled && <span className="report-type-badge">Próximamente</span>}
            </div>
            <p className="report-type-description">{type.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ReportTypeCatalog;
