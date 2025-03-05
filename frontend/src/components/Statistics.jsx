import React from 'react';
import './Statistics.css';

const Statistics = ({ data }) => {
  return (
    <div className="statistics">
      <div className="stat-box">
        <h3>Total Sale</h3>
        <p>${data?.totalSaleAmount || 0}</p>
      </div>
      <div className="stat-box">
        <h3>Total Sold Items</h3>
        <p>{data?.totalSoldItems || 0}</p>
      </div>
      <div className="stat-box">
        <h3>Total Not Sold Items</h3>
        <p>{data?.totalNotSoldItems || 0}</p>
      </div>
    </div>
  );
};

export default Statistics;