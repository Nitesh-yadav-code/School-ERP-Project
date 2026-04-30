import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FiX, FiFilter } from 'react-icons/fi';

const CommonFilter = ({ 
  show,
  onClose,
  data = [],
  filterFields = [],
  onFilter
}) => {
  const [filterValues, setFilterValues] = useState({});
  const [uniqueValues, setUniqueValues] = useState({});

  useEffect(() => {
    const unique = {};
    filterFields.forEach(field => {
      const values = [...new Set(data.map(item => item[field.key]).filter(Boolean))];
      unique[field.key] = values;
    });
    setUniqueValues(unique);
  }, [data, filterFields]);

  const handleChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const filteredData = data.filter(item => {
      return filterFields.every(field => {
        const filterValue = filterValues[field.key];
        if (!filterValue) return true;
        return item[field.key] === filterValue;
      });
    });
    onFilter(filteredData);
    onClose();
  };

  const handleReset = () => {
    setFilterValues({});
    onFilter(data);
  };

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 175,
        right: 20,
        width: 320,
        bgcolor: '#ffffff',
        borderRadius: 1,
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
          <FiFilter size={18} />
          <Typography fontWeight={600}>Filters</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
          <FiX />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filterFields.map((field) => (
          <TextField
            key={field.key}
            fullWidth
            select
            label={field.label}
            size="small"
            value={filterValues[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f9fafb',
                color: '#374151',
                '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
                '&:hover fieldset': { borderColor: '#667eea' },
                '&.Mui-focused fieldset': { borderColor: '#667eea' },
              },
              '& .MuiInputLabel-root': { color: '#6b7280' },
              '& .MuiSelect-icon': { color: '#6b7280' },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueValues[field.key]?.map((value) => (
              <MenuItem key={value} value={value}>{value}</MenuItem>
            ))}
          </TextField>
        ))}
      </Box>

      {/* Actions */}
      <Box sx={{ p: 2, bgcolor: '#f9fafb', borderTop: '1px solid rgba(0, 0, 0, 0.08)', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ color: '#374151', borderColor: '#d1d5db', textTransform: 'none' }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            textTransform: 'none',
          }}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default CommonFilter;