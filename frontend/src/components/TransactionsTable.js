import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell, Typography, Box } from '@mui/material';

const tableHeadingStyle = {
  color: '#7a56d6',
  fontWeight: 'bold',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  mb: 2
};

const TransactionsTable = ({ transactions }) => (
  <>
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 2 
    }}>
      <Typography variant="h6" sx={tableHeadingStyle}>
        Transaction Details
      </Typography>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.7)',
          fontStyle: 'italic'
        }}
      >
        Created by VIPIN SHIVHARE
      </Typography>
    </Box>
    <TableContainer component={Paper} sx={{ 
      mb: 4,
      background: 'linear-gradient(135deg, rgba(122, 86, 214, 0.15) 0%, rgba(76, 48, 158, 0.25) 100%)',
      boxShadow: '0 8px 32px 0 rgba(122, 86, 214, 0.1)',
      border: '1px solid rgba(122, 86, 214, 0.2)',
    }} className="transactions-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#7a56d6', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: '#7a56d6', fontWeight: 'bold' }}>Image</TableCell>
            <TableCell sx={{ color: '#7a56d6', fontWeight: 'bold' }}>Title</TableCell>
            <TableCell sx={{ color: '#7a56d6', fontWeight: 'bold' }}>Description</TableCell>
            <TableCell sx={{ color: '#7a56d6', fontWeight: 'bold' }}>Price</TableCell>
            <TableCell sx={{ color: '#7a56d6', fontWeight: 'bold' }}>Category</TableCell>
            <TableCell sx={{ color: '#7a56d6', fontWeight: 'bold' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id || transaction._id}>
                <TableCell sx={{ color: '#fff' }}>{transaction.id}</TableCell>
                <TableCell>
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#fff' }}>{transaction.title}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{transaction.description}</TableCell>
                <TableCell sx={{ color: '#fff' }}>₹{(transaction.price || 0).toLocaleString()}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{transaction.category}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{transaction.sold ? 'Sold' : 'Not Sold'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ color: '#fff' }}>
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default TransactionsTable;
