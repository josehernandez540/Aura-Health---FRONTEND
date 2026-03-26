import React, { forwardRef } from "react";
import './inputs.css';

const SelectInput = forwardRef(
  ({ label, options, error, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}

        <select
          ref={ref}
          defaultValue=""
          className={`form-control ${error ? "is-invalid" : ""}`}
          {...props}
          
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";
export default SelectInput;