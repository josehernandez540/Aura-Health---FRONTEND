
const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="filter-input-wrapper">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
};

export default SearchInput;