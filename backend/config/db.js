import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const maskUri = (uri) => uri.replace(/\/\/([^@]+)@/, '//***@');

export const connectDB = async () => {
  const candidates = [
    process.env.MONGODB_LOCAL_URL,
    'mongodb://127.0.0.1:27017/khalti',
    process.env.MONGODB_URL,
  ].filter(Boolean);

  if (candidates.length === 0) {
    throw new Error('MONGODB_URL is missing in backend/.env');
  }

  let lastError;

  for (const uri of candidates) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log(`✅ MongoDB connected (${maskUri(uri)})`);
      return;
    } catch (err) {
      lastError = err;
      console.warn(`⚠️  Could not connect: ${maskUri(uri)} — ${err.message}`);
    }
  }

  throw lastError || new Error('MongoDB connection failed');
};

export const isDbConnected = () => mongoose.connection.readyState === 1;
