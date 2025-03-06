const Product = require('../models/Product');
const axios = require('axios');

const initializeDatabase = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Product.deleteMany({});
    await Product.insertMany(response.data);
    return { message: 'Database initialized successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTransactions = async ({ search = '', page = 1, perPage = 10, month }) => {
  if (!month) throw new Error('Month parameter is required');

  const monthNum = parseInt(month);
  const skip = (parseInt(page) - 1) * parseInt(perPage);

  let query = {
    $expr: { $eq: [{ $month: '$dateOfSale' }, monthNum] }
  };

  if (search) {
    const searchNumber = parseFloat(search);
    const searchConditions = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    
    if (!isNaN(searchNumber)) {
      searchConditions.push({ price: searchNumber });
    }

    query = {
      $and: [
        { $expr: { $eq: [{ $month: '$dateOfSale' }, monthNum] } },
        { $or: searchConditions }
      ]
    };
  }

  const total = await Product.countDocuments(query);
  const transactions = await Product.find(query)
    .skip(skip)
    .limit(parseInt(perPage));

  return { total, page: parseInt(page), perPage: parseInt(perPage), transactions };
};

const getStatistics = async ({ month }) => {
  if (!month) throw new Error('Month parameter is required');

  const monthFilter = {
    $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] }
  };

  const stats = await Product.aggregate([
    { $match: monthFilter },
    {
      $group: {
        _id: null,
        totalSaleAmount: { 
          $sum: { $cond: [{ $eq: ["$sold", true] }, { $toDouble: "$price" }, 0] }
        },
        totalSoldItems: { 
          $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] }
        },
        totalNotSoldItems: { 
          $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] }
        }
      }
    }
  ]);

  const result = stats[0] || {
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0
  };

  result.totalSaleAmount = parseFloat(result.totalSaleAmount.toFixed(2));
  return result;
};

const getBarChartData = async ({ month }) => {
  if (!month) throw new Error('Month parameter is required');

  const monthFilter = {
    $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] }
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

  return Promise.all(
    ranges.map(async (range) => ({
      range: `${range.min}-${range.max === Infinity ? 'above' : range.max}`,
      count: await Product.countDocuments({
        ...monthFilter,
        price: {
          $gte: range.min,
          $lt: range.max === Infinity ? Number.MAX_VALUE : range.max + 1
        }
      })
    }))
  );
};

const getPieChartData = async ({ month }) => {
  if (!month) throw new Error('Month parameter is required');

  return Product.aggregate([
    { 
      $match: {
        $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] }
      }
    },
    {
      $group: {
        _id: "$category",
        value: { $sum: 1 }
      }
    },
    {
      $project: {
        name: "$_id",
        value: 1,
        _id: 0
      }
    }
  ]);
};

const getAnalytics = async ({ month }) => {
  if (!month) throw new Error('Month parameter is required');

  const [statistics, barChart, pieChart] = await Promise.all([
    getStatistics({ month }),
    getBarChartData({ month }),
    getPieChartData({ month })
  ]);

  return { statistics, barChart, pieChart };
};

module.exports = {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getAnalytics
};