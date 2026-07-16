import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';

const SearchBar = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="search-bar-block">
      <div className={`search-bar ${isFocused ? 'search-bar-focused' : ''}`}>
        <FaSearch className="search-bar-icon" />
        <input
          type="text"
          placeholder="Search doctors by name, specialty, hospital, or registration number..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="search-bar-input"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
