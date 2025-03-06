// const express = require('express');
// const router = express.Router();
// const {
//   initializeDatabase,
//   getTransactions,
//   getStatistics,
//   getBarChartData,
//   getPieChartData,
//   getAnalytics
// } = require('../controllers/productController');

// router.get('/initialize', async (req, res) => {
//   try {
//     const result = await initializeDatabase();
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/transactions', async (req, res) => {
//   try {
//     const result = await getTransactions(req.query);
//     res.json(result);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.get('/statistics', async (req, res) => {
//   try {
//     const result = await getStatistics(req.query);
//     res.json(result);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.get('/bar-chart', async (req, res) => {
//   try {
//     const result = await getBarChartData(req.query);
//     res.json(result);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.get('/pie-chart', async (req, res) => {
//   try {
//     const result = await getPieChartData(req.query);
//     res.json(result);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.get('/combined-data', async (req, res) => {
//   try {
//     const result = await getAnalytics(req.query);
//     res.json(result);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;