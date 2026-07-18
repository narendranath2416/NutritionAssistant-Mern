import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Attempt connection with a short 3-second timeout so it doesn't hang
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB Connected successfully.');
  } catch (error) {
    console.log('Database running in offline development mode.');
  }
};

export default connectDB;