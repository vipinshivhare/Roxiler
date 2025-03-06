import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const chartStyle = {
  p: 2, 
  mb: 4,
  background: 'linear-gradient(135deg, rgba(122, 86, 214, 0.15) 0%, rgba(76, 48, 158, 0.25) 100%)',
  boxShadow: '0 8px 32px 0 rgba(122, 86, 214, 0.1)',
  border: '1px solid rgba(122, 86, 214, 0.2)',
};

const headingStyle = {
  color: '#7a56d6',
  fontWeight: 'bold',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  mb: 2
};

const Charts = ({ barChartData, pieChartData }) => (
  <>
    <Paper sx={chartStyle}>
      <Typography variant="h6" sx={headingStyle}>
        Price Range Distribution
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#7a56d6" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>

    <Paper sx={chartStyle}>
      <Typography variant="h6" sx={headingStyle}>
        Category Distribution
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={0}
              paddingAngle={5}
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} items`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  </>
);

export default Charts;