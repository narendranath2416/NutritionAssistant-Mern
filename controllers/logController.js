import Log from '../models/Log.js';
import Profile from '../models/Profile.js';

// Get logs for a specific user email
export const getLogs = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    const logs = await Log.find({ userEmail: email }).sort({ loggedAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a log entry linked to user email
export const createLog = async (req, res) => {
  try {
    const newLog = await Log.create(req.body);
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a specific entry
export const deleteLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Not found' });
    await log.deleteOne();
    res.status(200).json({ success: true, message: 'Removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get or Save Profile details
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userEmail: req.query.email });
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveProfile = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const profile = await Profile.findOneAndUpdate({ userEmail }, req.body, { upsert: true, new: true });
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};