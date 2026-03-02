import mongoose from 'mongoose';

const connectDB = async () => {
   console.log('Connecting to MongoDB...',process.env.MONGO_URI);
  try {
   
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
