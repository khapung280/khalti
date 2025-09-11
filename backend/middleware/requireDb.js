import { isDbConnected } from '../config/db.js';

export const requireDb = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      msg: 'Database is not connected. Check MongoDB Atlas IP whitelist and MONGODB_URL in backend/.env',
    });
  }
  next();
};
