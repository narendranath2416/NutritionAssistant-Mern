import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
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

// Serve static view client assets
app.use('/public', express.static('public'));

// API Mounting
app.use('/api/logs', logRoutes);

// Base Route serving the View layer
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});