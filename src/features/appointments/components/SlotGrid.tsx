import React from "react";
import { type SlotState } from "../hooks/useAppointments";

interface SlotGridProps {
  slots: SlotState[];
  selectedTime: string;
  onSelect: (time: string, endTime: string) => void;
  loading?: boolean;
}

const SlotGrid: React.FC<SlotGridProps> = ({
  slots,
  selectedTime,
  onSelect,
  loading,
}) => {
  return (
    <>
      <div className="slot-grid">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={slot.status === "occupied" || loading}
            className={`slot-btn ${
              slot.status === "occupied"
                ? "occupied"
                : selectedTime === slot.time
                ? "selected"
                : ""
            }`}
            onClick={() => onSelect(slot.time, slot.endTime)}
          >
            {slot.time}
          </button>
        ))}
      </div>

      <div className="slot-legend">
        <span>
          <span className="slot-legend-dot occupied" />
          Ocupado
        </span>
        <span>
          <span className="slot-legend-dot selected" />
          Seleccionado
        </span>
        <span>Blanco = Disponible</span>
      </div>
    </>
  );
};

export default SlotGrid;
