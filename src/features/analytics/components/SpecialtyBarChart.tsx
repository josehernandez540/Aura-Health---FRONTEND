import React, { useState } from "react";
import type { SpecialtyCount } from "../services/analytics.service";

interface SpecialtyBarChartProps {
  data: SpecialtyCount[];
}

const MAX_SLOTS = 6;
const CAT_VARS = ["--cat-1", "--cat-2", "--cat-3", "--cat-4", "--cat-5", "--cat-6"];

const foldToOther = (data: SpecialtyCount[]): SpecialtyCount[] => {
  if (data.length <= MAX_SLOTS) return data;
  const head = data.slice(0, MAX_SLOTS - 1);
  const tailCount = data.slice(MAX_SLOTS - 1).reduce((sum, d) => sum + d.count, 0);
  return [...head, { specialty: "Otras", count: tailCount }];
};

const SpecialtyBarChart: React.FC<SpecialtyBarChartProps> = ({ data }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data.length) {
    return <p className="analytics-empty">No hay citas registradas en este período.</p>;
  }

  const items = foldToOther(data);
  const maxValue = Math.max(...items.map((d) => d.count), 1);

  return (
    <ul className="analytics-hbar-list">
      {items.map((item, i) => (
        <li
          key={item.specialty}
          className="analytics-hbar-row"
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
          onFocus={() => setHoverIndex(i)}
          onBlur={() => setHoverIndex(null)}
          tabIndex={0}
        >
          <span className="analytics-hbar-label">{item.specialty}</span>
          <div className="analytics-hbar-track">
            <div
              className={`analytics-hbar-fill ${hoverIndex === i ? "is-hovered" : ""}`}
              style={{
                width: `${(item.count / maxValue) * 100}%`,
                background: `var(${CAT_VARS[i % CAT_VARS.length]})`,
              }}
            />
          </div>
          <span className="analytics-hbar-value">{item.count}</span>
        </li>
      ))}
    </ul>
  );
};

export default SpecialtyBarChart;
