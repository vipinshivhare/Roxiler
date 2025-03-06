const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getAnalytics
} = require('./controllers/productController');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add this route
app.get('/api/combined-data', async (req, res) => {
  try {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const transactions = await getTransactions({ month, search, page, perPage });
    const statistics = await getStatistics({ month });
    const barChart = await getBarChartData({ month });
    const pieChart = await getPieChartData({ month });

    res.json({
      transactions,
      statistics,
      barChart,
      pieChart,
      total: transactions.total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize database route
app.post('/api/initialize-database', async (req, res) => {
  try {
    const result = await initializeDatabase();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add the analytics endpoint
// Fix the analytics endpoint
// Update the analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const result = await getAnalytics(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions route
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await getTransactions(req.query);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistics route
app.get('/api/statistics', async (req, res) => {
  try {
    const statistics = await getStatistics(req.query);
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bar chart route
app.get('/api/bar-chart', async (req, res) => {
  try {
    const barChartData = await getBarChartData(req.query);
    res.json(barChartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Bhai API Working hai");
});

// Pie chart route
app.get('/api/pie-chart', async (req, res) => {
  try {
    const pieChartData = await getPieChartData(req.query);
    res.json(pieChartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 5030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});