import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const SearchBar = ({ selectedMonth, searchQuery, months, onMonthChange, onSearchChange }) => (
  <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>Select Month</InputLabel>
      <Select
        value={selectedMonth}
        label="Select Month"
        onChange={onMonthChange}
      >
        {months.map((month) => (
          <MenuItem key={month.value} value={month.value}>
            {month.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      label="Search Transactions"
      variant="outlined"
      value={searchQuery}
      onChange={onSearchChange}
      sx={{ flexGrow: 1 }}
    />
  </Box>
);

export default SearchBar;