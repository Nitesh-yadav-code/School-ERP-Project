import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { FiSearch, FiX } from 'react-icons/fi';
import useDebounce from '../utils/debounce';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    color: '#374151',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    '&:hover': {
      backgroundColor: '#e5e7eb',
      '& fieldset': {
        borderColor: 'rgba(102, 126, 234, 0.5)',
      },
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      '& fieldset': {
        borderColor: '#667eea',
        borderWidth: '2px',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#667eea',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 14px',
    fontSize: '0.9rem',
  },
  '& .MuiInputAdornment-root': {
    color: '#6b7280',
  },
});

const SearchField = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  onDebouncedChange 
}) => {
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    if (onDebouncedChange) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, onDebouncedChange]);

  const handleClear = () => {
    onChange('');
  };

  return (
    <StyledTextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FiSearch style={{ fontSize: '1.125rem' }} />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
              edge="end"
              sx={{
                color: '#a0aec0',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                },
              }}
            >
              <FiX />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ maxWidth: '400px' }}
    />
  );
};

export default SearchField;