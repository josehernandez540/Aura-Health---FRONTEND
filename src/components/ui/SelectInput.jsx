const SelectInput = ({ value, onChange, options }) => {
  return (
    <div className="filter-select-wrapper">
      <select
        value={value}
        onChange={onChange}
        className="action-select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;