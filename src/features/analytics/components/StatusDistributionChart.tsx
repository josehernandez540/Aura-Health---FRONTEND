import React, { useState } from "react";
import type { AppointmentStatus, StatusCount } from "../services/analytics.service";

interface StatusDistributionChartProps {
  data: StatusCount[];
}

const STATUS_META: Record<AppointmentStatus, { label: string; colorVar: string }> = {
  COMPLETED: { label: "Realizadas", colorVar: "var(--success)" },
  CANCELLED: { label: "Canceladas", colorVar: "var(--danger)" },
  NO_SHOW: { label: "Inasistencias", colorVar: "var(--warning)" },
  SCHEDULED: { label: "Programadas", colorVar: "var(--accent)" },
};

const STATUS_ORDER: AppointmentStatus[] = ["COMPLETED", "CANCELLED", "NO_SHOW", "SCHEDULED"];

const SIZE = 180;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data }) => {
  const [hovered, setHovered] = useState<AppointmentStatus | null>(null);

  const countByStatus = new Map(data.map((d) => [d.status, d.count]));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (!total) {
    return <p className="analytics-empty">No hay citas registradas en este período.</p>;
  }

  let offsetSoFar = 0;
  const segments = STATUS_ORDER.map((status) => {
    const count = countByStatus.get(status) ?? 0;
    const fraction = count / total;
    const length = fraction * CIRCUMFERENCE;
    const segment = { status, count, fraction, length, offset: offsetSoFar };
    offsetSoFar += length;
    return segment;
  }).filter((s) => s.count > 0);

  return (
    <div className="analytics-donut-wrap">
      <div className="analytics-donut-figure">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Distribución de citas por estado">
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--border)"
              strokeWidth={STROKE}
            />
            {segments.map((seg) => (
              <circle
                key={seg.status}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={STATUS_META[seg.status].colorVar}
                strokeWidth={STROKE}
                strokeDasharray={`${seg.length} ${CIRCUMFERENCE - seg.length}`}
                strokeDashoffset={-seg.offset}
                className={`analytics-donut-segment ${hovered === seg.status ? "is-hovered" : ""}`}
                onMouseEnter={() => setHovered(seg.status)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(seg.status)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                role="button"
                aria-label={`${STATUS_META[seg.status].label}: ${seg.count} (${Math.round(seg.fraction * 100)}%)`}
              />
            ))}
          </g>
          <text x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle" className="analytics-donut-center-value">
            {hovered ? countByStatus.get(hovered) ?? 0 : total}
          </text>
          <text x={SIZE / 2} y={SIZE / 2 + 16} textAnchor="middle" className="analytics-donut-center-label">
            {hovered ? STATUS_META[hovered].label : "Total"}
          </text>
        </svg>
      </div>

      <ul className="analytics-legend">
        {STATUS_ORDER.filter((status) => (countByStatus.get(status) ?? 0) > 0).map((status) => (
          <li
            key={status}
            className={`analytics-legend-item ${hovered === status ? "is-hovered" : ""}`}
            onMouseEnter={() => setHovered(status)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="analytics-legend-swatch" style={{ background: STATUS_META[status].colorVar }} />
            {STATUS_META[status].label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusDistributionChart;
