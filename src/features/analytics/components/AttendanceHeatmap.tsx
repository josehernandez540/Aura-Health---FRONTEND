import React, { useState } from "react";
import type { DayCount } from "../services/analytics.service";

interface AttendanceHeatmapProps {
  data: DayCount[];
}

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];
const INTENSITY_STEPS = [0.12, 0.3, 0.5, 0.7, 1];

const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
};

const intensityFor = (count: number, maxValue: number): number => {
  if (count <= 0 || maxValue <= 0) return 0;
  const ratio = count / maxValue;
  const stepIndex = Math.min(INTENSITY_STEPS.length - 1, Math.ceil(ratio * INTENSITY_STEPS.length) - 1);
  return INTENSITY_STEPS[Math.max(0, stepIndex)];
};

const AttendanceHeatmap: React.FC<AttendanceHeatmapProps> = ({ data }) => {
  const [hovered, setHovered] = useState<DayCount | null>(null);

  if (!data.length) {
    return <p className="analytics-empty">No hay datos suficientes.</p>;
  }

  const weeks: DayCount[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="analytics-heatmap-wrap">
      <div className="analytics-heatmap-grid" style={{ gridTemplateColumns: `20px repeat(${weeks.length}, 1fr)` }}>
        {WEEKDAY_LABELS.map((label, rowIndex) => (
          <React.Fragment key={label}>
            <span className="analytics-heatmap-rowlabel">{label}</span>
            {weeks.map((week, colIndex) => {
              const cell = week[rowIndex];
              if (!cell) return <span key={colIndex} />;
              const intensity = intensityFor(cell.count, maxValue);
              return (
                <button
                  key={cell.date}
                  type="button"
                  className="analytics-heatmap-cell"
                  style={{ background: intensity === 0 ? "var(--border)" : `color-mix(in srgb, var(--accent) ${intensity * 100}%, var(--surface))` }}
                  onMouseEnter={() => setHovered(cell)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(cell)}
                  onBlur={() => setHovered(null)}
                  aria-label={`${formatDate(cell.date)}: ${cell.count} citas`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="analytics-heatmap-footer">
        {hovered ? (
          <span className="analytics-heatmap-hover-detail">
            <strong>{hovered.count}</strong> citas · {formatDate(hovered.date)}
          </span>
        ) : (
          <span />
        )}

        <div className="analytics-heatmap-legend">
          <span>Menos</span>
          <span className="analytics-heatmap-legend-cell" style={{ background: "var(--border)" }} />
          {INTENSITY_STEPS.map((step) => (
            <span
              key={step}
              className="analytics-heatmap-legend-cell"
              style={{ background: `color-mix(in srgb, var(--accent) ${step * 100}%, var(--surface))` }}
            />
          ))}
          <span>Más</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeatmap;
