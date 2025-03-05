const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

const app = express();

// Update CORS configuration to be more permissive
app.use(cors());

// Middleware
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Import routes
const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);

// Initialize database with seed data
const initializeDatabase = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const products = response.data;
    
    // Clear existing data
    await Product.deleteMany({});
    
    // Insert new data
    await Product.insertMany(products);
    console.log('Database initialized with seed data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database on server start
initializeDatabase();

// Update port to match frontend expectations
const PORT = process.env.PORT || 5000;  // Changed from 5050 to 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});