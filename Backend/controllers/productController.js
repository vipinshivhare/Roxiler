const Product = require('../models/Product');
const axios = require('axios');

const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Product.deleteMany({});
    await Product.insertMany(response.data);
    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { search = '', page = 1, perPage = 10, month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    const monthNum = parseInt(month);
    const skip = (parseInt(page) - 1) * parseInt(perPage);

    let query = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, monthNum]
      }
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Product.countDocuments(query);
    const transactions = await Product.find(query)
      .skip(skip)
      .limit(parseInt(perPage));

    res.json({
      total,
      page: parseInt(page),
      perPage: parseInt(perPage),
      transactions
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    const monthNum = parseInt(month);
    const monthFilter = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, monthNum]
      }
    };

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
};

const getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    const monthNum = parseInt(month);
    const monthFilter = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, monthNum]
      }
    };

    const ranges = [
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

    const result = await Promise.all(
      ranges.map(async (range) => {
        const count = await Product.countDocuments({
          ...monthFilter,
          price: {
            $gte: range.min,
            $lt: range.max === Infinity ? Number.MAX_VALUE : range.max + 1
          }
        });

        return {
          range: `${range.min}-${range.max === Infinity ? 'above' : range.max}`,
          count
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    const monthNum = parseInt(month);
    const monthFilter = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, monthNum]
      }
    };

    const categoryData = await Product.aggregate([
      { $match: monthFilter },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(categoryData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      Product.find({
        $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] }
      }).limit(10),
      getStatistics({ query: { month } }, { json: (data) => data }),
      getBarChartData({ query: { month } }, { json: (data) => data }),
      getPieChartData({ query: { month } }, { json: (data) => data })
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
};

module.exports = {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData
};