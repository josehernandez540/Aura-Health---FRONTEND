import './inputs.css'

const DateInput = ({ value, onChange }) => {
  return (
    <div className="filter-date-wrapper">
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="date-input"
      />
    </div>
  );
};

export default DateInput;