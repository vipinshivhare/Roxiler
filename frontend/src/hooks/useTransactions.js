import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

const useTransactions = () => {
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
        params: {
          month: selectedMonth,
          search: searchQuery,
          page,
          perPage: 10
        }
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

  return {
    selectedMonth,
    setSelectedMonth,
    searchQuery,
    setSearchQuery,
    transactions,
    statistics,
    barChartData,
    page,
    setPage,
    totalPages,
    pieChartData
  };
};

export default useTransactions;