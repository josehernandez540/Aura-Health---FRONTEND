import React from "react";
import type { DoctorPerformance } from "../services/analytics.service";

interface DoctorPerformanceTableProps {
  data: DoctorPerformance[];
}

const meterColor = (rate: number): string => {
  if (rate >= 80) return "var(--success)";
  if (rate >= 50) return "var(--warning)";
  return "var(--danger)";
};

const DoctorPerformanceTable: React.FC<DoctorPerformanceTableProps> = ({ data }) => {
  if (!data.length) {
    return <p className="analytics-empty">No hay citas registradas en este período.</p>;
  }

  return (
    <div className="analytics-table-wrap">
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Médico</th>
            <th>Especialidad</th>
            <th>Citas</th>
            <th>Realizadas</th>
            <th>Inasistencias</th>
            <th>Tasa Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {data.map((doctor) => (
            <tr key={doctor.doctorId}>
              <td className="analytics-table-doctor">{doctor.name}</td>
              <td>
                <span className="analytics-specialty-chip">{doctor.specialization}</span>
              </td>
              <td>{doctor.total}</td>
              <td>{doctor.completed}</td>
              <td>{doctor.noShow}</td>
              <td>
                <div className="analytics-meter">
                  <div className="analytics-meter-track">
                    <div
                      className="analytics-meter-fill"
                      style={{ width: `${doctor.attendanceRate}%`, background: meterColor(doctor.attendanceRate) }}
                    />
                  </div>
                  <span className="analytics-meter-value" style={{ color: meterColor(doctor.attendanceRate) }}>
                    {doctor.attendanceRate}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorPerformanceTable;
