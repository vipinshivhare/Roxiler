# Rolex Product Management System Backend

This is the backend API for the Rolex Product Management System. It provides endpoints for managing product transactions, generating statistics, and creating visualizations.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a remote instance)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rolex_db
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### 1. List Transactions
```
GET /api/transactions
Query Parameters:
- search (optional): Search text for product title/description/price
- page (optional): Page number (default: 1)
- perPage (optional): Items per page (default: 10)
- month (required): Month number (1-12)
```

### 2. Statistics
```
GET /api/statistics
Query Parameters:
- month (required): Month number (1-12)
```

### 3. Bar Chart Data
```
GET /api/bar-chart
Query Parameters:
- month (required): Month number (1-12)
```

### 4. Pie Chart Data
```
GET /api/pie-chart
Query Parameters:
- month (required): Month number (1-12)
```

### 5. Combined Data
```
GET /api/combined
Query Parameters:
- month (required): Month number (1-12)
```

## Features

- Automatic database initialization with seed data from the provided API
- Search and pagination for transactions
- Monthly statistics including total sales, sold items, and unsold items
- Price range distribution for bar chart
- Category distribution for pie chart
- Combined API endpoint for fetching all data at once

## Error Handling

All endpoints include proper error handling and will return appropriate HTTP status codes and error messages when something goes wrong. 