import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './TransactionsTable';
import Statistics from './Statistics';
import BarChart from './BarChart';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('3'); // Default March
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({
    transactions: [],
    statistics: {},
    barChartData: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, searchText, currentPage]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/combined-data`, {
        params: {
          month: selectedMonth,
          search: searchText,
          page: currentPage,
          perPage: 10
        }
      });
      setData(response.data);
      setTotalPages(Math.ceil(response.data.transactions.total / 10));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="dashboard">
      <h1>Transaction Dashboard</h1>
      
      <div className="controls">
        <input
          type="text"
          placeholder="Search transaction..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
        
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-select"
        >
          {months.map((month, index) => (
            <option key={index + 1} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <Statistics data={data.statistics} />
      
      <TransactionsTable
        transactions={data.transactions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      <BarChart data={data.barChart} />
    </div>
  );
};

export default Dashboard;