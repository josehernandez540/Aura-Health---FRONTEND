import React from "react";
import { DATE_RANGE_OPTIONS } from "../hooks/useAnalytics";

interface DateRangeSelectProps {
  value: number;
  onChange: (days: number) => void;
}

const DateRangeSelect: React.FC<DateRangeSelectProps> = ({ value, onChange }) => {
  return (
    <select
      className="analytics-range-select"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Rango de fechas"
    >
      {DATE_RANGE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default DateRangeSelect;
