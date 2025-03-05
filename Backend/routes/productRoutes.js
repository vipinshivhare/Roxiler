const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const axios = require('axios');
const {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData
} = require('../controllers/productController');

router.post('/initialize-database', initializeDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);
router.get('/combined-data', getCombinedData);

// Helper function to get month filter
const getMonthFilter = (month) => {
  return {
    $expr: {
      $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
    }
  };
};

// Helper function to validate month
const validateMonth = (month) => {
  const monthNum = parseInt(month);
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    throw new Error('Month must be a number between 1 and 12');
  }
  return monthNum;
};

// List all transactions with search and pagination
router.get('/transactions', async (req, res) => {
  try {
    let { search = '', page = 1, perPage = 10 } = req.query;
    
    // Build search query
    let query = {};
    
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
      
      // If search term is a number, include price search
      const priceSearch = parseFloat(search);
      if (!isNaN(priceSearch)) {
        query.$or.push({ price: priceSearch });
      }
    }

    // Parse pagination parameters
    page = Math.max(1, parseInt(page));
    perPage = Math.max(1, parseInt(perPage));
    const skip = (page - 1) * perPage;

    // Execute queries with pagination
    const [transactions, total] = await Promise.all([
      Product.find(query)
        .skip(skip)
        .limit(perPage)
        .sort({ dateOfSale: -1 }),
      Product.countDocuments(query)
    ]);

    // Send paginated response
    res.json({
      transactions,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage)
    });

  } catch (error) {
    console.error('Transaction route error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Statistics API
router.get('/statistics', async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    validateMonth(month);
    const monthFilter = getMonthFilter(month);

    const stats = await Product.aggregate([
      { $match: monthFilter },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
          totalSoldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
          totalNotSoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } }
        }
      }
    ]);

    res.json(stats[0] || {
      totalSaleAmount: 0,
      totalSoldItems: 0,
      totalNotSoldItems: 0
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Bar Chart API
router.get('/bar-chart', async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    validateMonth(month);
    const monthFilter = getMonthFilter(month);

    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ];

    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Product.countDocuments({
          ...monthFilter,
          price: {
            $gte: range.min,
            $lte: range.max === Infinity ? Number.MAX_VALUE : range.max
          }
        });

        return {
          range: `${range.min}-${range.max === Infinity ? 'above' : range.max}`,
          count
        };
      })
    );

    res.json(barChartData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Pie Chart API
router.get('/pie-chart', async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    validateMonth(month);
    const monthFilter = getMonthFilter(month);

    const categoryData = await Product.aggregate([
      { $match: monthFilter },
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 }
        }
      },
      {
        $project: {
          category: "$_id",
          items: "$itemCount",
          _id: 0
        }
      },
      { $sort: { items: -1 } }
    ]);

    if (!categoryData.length) {
      return res.json([]);
    }

    res.json(categoryData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Combined API
router.get('/combined', async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    validateMonth(month);
    const baseUrl = `http://localhost:${process.env.PORT || 5000}/api`;

    // Fetch data from all three APIs
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`${baseUrl}/transactions?month=${month}`).then(res => res.data),
      axios.get(`${baseUrl}/statistics?month=${month}`).then(res => res.data),
      axios.get(`${baseUrl}/bar-chart?month=${month}`).then(res => res.data),
      axios.get(`${baseUrl}/pie-chart?month=${month}`).then(res => res.data)
    ]);

    res.json({
      transactions,
      statistics,
      barChart,
      pieChart
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;