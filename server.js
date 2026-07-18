import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import logRoutes from './routes/logRoutes.js';

// Load environment variables
dotenv.config();

// Establish Database connection
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Mounting
app.use('/api/logs', logRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('Nutrition Assistant App API is up and running safely.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});