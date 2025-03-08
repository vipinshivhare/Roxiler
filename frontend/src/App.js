import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Box, Pagination, CircularProgress } from '@mui/material';
import axios from 'axios';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import StatisticsCards from './components/StatisticsCards';
import TransactionsTable from './components/TransactionsTable';
import Charts from './components/Charts';
import { API_BASE_URL, months } from './constants';
import './App.css';

function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState({
    transactions: { transactions: [], total: 0 },
    statistics: { totalSaleAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 },
    barChart: [],
    pieChart: [],
  });
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  // Memoized API Call to Prevent Unnecessary Re-renders
  const fetchData = useCallback(async () => {
    if (isFetching) return; // Prevents duplicate requests
    setIsFetching(true);
  
    try {
      const controller = new AbortController();
      const signal = controller.signal;
  
      const response = await axios.get(`${API_BASE_URL}/combined-data`, {
        params: { month: selectedMonth, search: searchQuery.trim(), page, perPage: 10 },
        signal,
      });
  
      setData(response.data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error:', error);
        alert('Error loading data. Please try again.');
      }
    } finally {
      setInitialLoading(false);
      setIsFetching(false);
    }
  }, [searchQuery, selectedMonth, page, isFetching]); 
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 250); 

    return () => clearTimeout(debounceTimer);
  }, [fetchData]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const totalPages = useMemo(() => Math.ceil((data.transactions.total || 0) / 10), [data.transactions.total]);

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
        px: { xs: 2, md: 3 },
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Navbar />
      <Box
        sx={{
          mt: 12,
          width: '100%',
          position: 'relative',
          '& > *': { width: '100%', maxWidth: '100%' },
        }}
      >
        {initialLoading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9999,
              backdropFilter: 'blur(8px)',
            }}
          >
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                color: '#7a56d6',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
          </Box>
        )}

        <SearchBar
          selectedMonth={selectedMonth}
          searchQuery={searchQuery}
          months={months}
          onMonthChange={handleMonthChange}
          onSearchChange={handleSearchChange}
        />

        <StatisticsCards statistics={data.statistics} />
        <TransactionsTable transactions={data.transactions.transactions || []} />

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
        </Box>

        <Charts barChartData={data.barChart} pieChartData={data.pieChart} />
      </Box>
    </Container>
  );
}

export default App;
