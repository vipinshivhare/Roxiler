import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Pagination,
} from '@mui/material';
import axios from 'axios';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import StatisticsCards from './components/StatisticsCards';
import TransactionsTable from './components/TransactionsTable';
import Charts from './components/Charts';
import { API_BASE_URL, months } from './constants';
import './App.css';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [barChartData, setBarChartData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/combined-data`, {
        params: { month: selectedMonth, search: searchQuery, page, perPage: 10 }
      });

      if (data) {
        setTransactions(data.transactions.transactions || []);
        setTotalPages(Math.ceil(data.transactions.total / 10));
        setStatistics(data.statistics || {
          totalSaleAmount: 0,
          totalSoldItems: 0,
          totalNotSoldItems: 0
        });
        setBarChartData(data.barChart || []);
        setPieChartData(data.pieChart || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, searchQuery, page]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: 4,
        px: { xs: 2, md: 3 }, 
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
        width: '100%',
        overflow: 'hidden' 
      }}
    >
      <Navbar />
      <Box sx={{ 
        mt: 12,
        width: '100%',
        '& > *': { 
          width: '100%',
          maxWidth: '100%'
        }
      }}>
        <SearchBar
          selectedMonth={selectedMonth}
          searchQuery={searchQuery}
          months={months}
          onMonthChange={handleMonthChange}
          onSearchChange={handleSearchChange}
        />
        
        <StatisticsCards statistics={statistics} />
        <TransactionsTable transactions={transactions} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
        
        <Charts barChartData={barChartData} pieChartData={pieChartData} />
      </Box>
    </Container>
  );
}

export default App;