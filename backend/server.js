import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { seedProductsIfEmpty } from './utils/seedProducts.js';
import authRoutes from './route/router.js';
import adminLogin from './route/adminroute.js';
import productRoutes from './route/productroute.js';
import favouriteroute from './route/favouriteroute.js';
import contactRoutes from './route/contactroute.js';
import homeRoutes from './route/homeroute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api', adminLogin);
app.use('/api/fav', favouriteroute);
app.use('/api/contact', contactRoutes);
app.use('/api/home', homeRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await seedProductsIfEmpty();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Fix: MongoDB Atlas → Network Access → Add IP Address (or 0.0.0.0/0 for dev)');
    console.error('   Then restart: npm run dev');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
