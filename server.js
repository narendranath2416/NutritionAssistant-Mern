// Force Node.js process to use Google DNS directly, bypassing hotspot network blocks
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// 🗄️ DATABASE SCHEMAS & MODELS
const profileSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  goal: { type: String, required: true, enum: ['Weight Loss', 'Weight Gain'] }
}, { timestamps: true });

const logSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  mealType: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
  foodItem: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 }
}, { timestamps: true });

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

// 🌐 ROUTING ENDPOINTS

// 1. Get logs for a specific user email
app.get('/api/logs', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email query parameter required.' });
    
    const logs = await Log.find({ userEmail: email }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Add a new meal log
app.post('/api/logs', async (req, res) => {
  try {
    const { userEmail, mealType, foodItem, calories, protein, carbs, fats } = req.body;
    const newLog = new Log({ userEmail, mealType, foodItem, calories, protein, carbs, fats });
    await newLog.save();
    return res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

// 3. Delete a meal log
app.delete('/api/logs/:id', async (req, res) => {
  try {
    const deletedLog = await Log.findByIdAndDelete(req.params.id);
    if (!deletedLog) return res.status(404).json({ success: false, message: 'Log entry not found.' });
    return res.status(200).json({ success: true, message: 'Removed successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Get profile configurations
app.get('/api/logs/profile', async (req, res) => {
  try {
    const { email } = req.query;
    const profile = await Profile.findOne({ userEmail: email });
    return res.status(200).json({ success: true, data: profile });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Save/Update profile configurations
app.post('/api/logs/profile', async (req, res) => {
  try {
    const { userEmail } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userEmail }, 
      req.body, 
      { upsert: true, new: true }
    );
    return res.status(200).json({ success: true, data: profile });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

// Base Route
app.get('/', (req, res) => {
  res.send('Nutrition Assistant MERN Cloud Backend is Active!');
});

// 🔌 MONGOOSE ONLINE CONNECTION WITH ATLAS URI
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB Database Connected Successfully to Cloud Atlas!");
    app.listen(PORT, () => console.log(`🚀 Server executing on port: ${PORT}`));
  })
  .catch((err) => console.error("❌ Link dropped:", err.message));