import React from 'react';
import { Box, Pagination } from '@mui/material';

const PaginationComponent = ({ totalPages, page, handlePageChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
    <Pagination
      count={totalPages}
      page={page}
      onChange={handlePageChange}
      color="primary"
    />
  </Box>
);

export default PaginationComponent;