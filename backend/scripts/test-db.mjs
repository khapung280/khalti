import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1') });

const uri = process.env.MONGODB_URL;
console.log('Testing MongoDB connection...');

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log('SUCCESS: Connected to MongoDB');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('FAILED:', err.message);
  process.exit(1);
}
