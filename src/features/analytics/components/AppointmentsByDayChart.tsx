import React, { useState } from "react";
import type { DayCount } from "../services/analytics.service";

interface AppointmentsByDayChartProps {
  data: DayCount[];
}

const CHART_WIDTH = 760;
const CHART_HEIGHT = 220;
const PADDING_LEFT = 32;
const PADDING_BOTTOM = 24;
const PADDING_TOP = 12;

const niceMax = (max: number): number => {
  if (max <= 5) return 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const normalized = max / magnitude;
  const step = normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
};

const formatDayLabel = (iso: string): string => {
  const [, month, day] = iso.split("-");
  return `${Number(day)}/${Number(month)}`;
};

const AppointmentsByDayChart: React.FC<AppointmentsByDayChartProps> = ({ data }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data.length) {
    return <p className="analytics-empty">No hay citas registradas en este período.</p>;
  }

  const plotWidth = CHART_WIDTH - PADDING_LEFT;
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const maxValue = niceMax(Math.max(...data.map((d) => d.count), 1));

  const slotWidth = plotWidth / data.length;
  const barWidth = Math.max(2, Math.min(24, slotWidth - 2));

  const labelBudget = 12;
  const labelStride = Math.max(1, Math.ceil(data.length / labelBudget));

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxValue * f));

  return (
    <div className="analytics-chart-wrap">
      <svg
        className="analytics-chart-svg"
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        role="img"
        aria-label="Citas por día"
      >
        {yTicks.map((tick) => {
          const y = PADDING_TOP + plotHeight - (tick / maxValue) * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={PADDING_LEFT}
                x2={CHART_WIDTH}
                y1={y}
                y2={y}
                className="analytics-chart-gridline"
              />
              <text x={PADDING_LEFT - 6} y={y + 3} textAnchor="end" className="analytics-chart-axis-text">
                {tick}
              </text>
            </g>
          );
        })}

        {data.map((point, i) => {
          const barHeight = (point.count / maxValue) * plotHeight;
          const x = PADDING_LEFT + i * slotWidth + (slotWidth - barWidth) / 2;
          const y = PADDING_TOP + plotHeight - barHeight;
          const isHovered = hoverIndex === i;

          return (
            <g key={point.date}>
              <rect
                x={x - 3}
                y={PADDING_TOP}
                width={barWidth + 6}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(i)}
                onBlur={() => setHoverIndex(null)}
                tabIndex={0}
                role="button"
                aria-label={`${formatDayLabel(point.date)}: ${point.count} citas`}
              />
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 0)}
                rx={3}
                className={`analytics-bar ${isHovered ? "is-hovered" : ""}`}
              />
              {i % labelStride === 0 && (
                <text
                  x={x + barWidth / 2}
                  y={CHART_HEIGHT - 6}
                  textAnchor="middle"
                  className="analytics-chart-axis-text"
                >
                  {formatDayLabel(point.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hoverIndex !== null && (
        <div className="analytics-tooltip" style={{ left: `${((hoverIndex + 0.5) / data.length) * 100}%` }}>
          <strong>{data[hoverIndex].count}</strong> citas
          <span className="analytics-tooltip-sub">{formatDayLabel(data[hoverIndex].date)}</span>
        </div>
      )}
    </div>
  );
};

export default AppointmentsByDayChart;
