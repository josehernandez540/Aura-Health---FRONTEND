import React, { forwardRef } from "react";
import "./inputs.css";

const DateInput = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      <input
        type="date"
        ref={ref}
        className={`date-input ${error ? "is-invalid" : ""}`}
        {...props}
      />

      {error && <span className="form-error">{error}</span>}
    </div>
  );
});

DateInput.displayName = "DateInput";
export default DateInput;