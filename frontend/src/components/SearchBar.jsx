import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';

const SearchBar = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    position: 'relative',
    borderRadius: '0.75rem',
    border: isFocused ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(71, 85, 105, 0.5)',
    backgroundColor: isFocused ? '#020617' : 'rgba(2, 6, 23, 0.5)',
    boxShadow: isFocused ? '0 20px 25px -5px rgba(59, 130, 246, 0.2)' : 'none',
    transition: 'all 0.3s ease',
    padding: '0.5rem 0',
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '0.875rem',
    fontSize: '1.125rem',
    color: isFocused ? '#60a5fa' : '#475569',
    transition: 'color 0.2s ease',
    pointerEvents: 'none',
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: '1rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    backgroundColor: 'transparent',
    color: '#f1f5f9',
    fontSize: '0.875rem',
    border: 'none',
    outline: 'none',
    borderRadius: '0.75rem',
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={containerStyle}>
        <FaSearch style={iconStyle} />
        <input
          type="text"
          placeholder="Search doctors by name, specialty, hospital, or registration number..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
