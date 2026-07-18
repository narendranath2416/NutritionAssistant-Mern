import Log from '../models/Log.js';

// @desc    Get all daily nutrition logs
// @route   GET /api/logs
export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ loggedAt: -1 });
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new nutrition entry
// @route   POST /api/logs
export const createLog = async (req, res) => {
  try {
    const newLog = await Log.create(req.body);
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a specific log entry
// @route   DELETE /api/logs/:id
export const deleteLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log entry not found' });
    }
    await log.deleteOne();
    res.status(200).json({ success: true, message: 'Log entry removed safely' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};