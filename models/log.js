import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    },
    foodItem: {
      type: String,
      required: [true, 'Food item name is required'],
      trim: true,
    },
    calories: {
      type: Number,
      required: [true, 'Calorie value is required'],
      min: [0, 'Calories cannot be negative'],
    },
    protein: {
      type: Number,
      default: 0,
      min: [0, 'Protein cannot be negative'],
    },
    carbs: {
      type: Number,
      default: 0,
      min: [0, 'Carbs cannot be negative'],
    },
    fats: {
      type: Number,
      default: 0,
      min: [0, 'Fats cannot be negative'],
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Log = mongoose.model('Log', logSchema);
export default Log;