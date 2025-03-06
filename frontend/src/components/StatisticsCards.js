import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const cardStyle = {
  background: 'linear-gradient(135deg, rgba(122, 86, 214, 0.15) 0%, rgba(76, 48, 158, 0.25) 100%)',
  boxShadow: '0 8px 32px 0 rgba(122, 86, 214, 0.1)',
  border: '1px solid rgba(122, 86, 214, 0.2)',
};

const StatisticsCards = ({ statistics }) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid item xs={12} md={4}>
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
            Total Sale Amount
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
            ₹{statistics.totalSaleAmount.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
            Total Sold Items
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
            {statistics.totalSoldItems}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
            Total Not Sold Items
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
            {statistics.totalNotSoldItems}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default StatisticsCards;