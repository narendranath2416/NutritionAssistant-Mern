import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true
    },
    mealType: {
      type: String,
      required: true,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    },
    foodItem: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: { type: Number, default: 0, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    fats: { type: Number, default: 0, min: 0 },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Log = mongoose.model('Log', logSchema);
export default Log;