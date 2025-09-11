import mongoose from 'mongoose';
import Favorite from '../model/Favorite.js';
import User from '../model/user.js';
import Product from '../model/productmodel.js';

// Add product to favorites
export const addToFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Product already favorited' });
    }

    const favorite = new Favorite({ user: userId, product: productId });
    await favorite.save();

    res.status(200).json({ message: 'Product added to favorites', favorite });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Get all favorite products for a user
export const getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const favorites = await Favorite.find({ user: userId }).populate('product');
    res.status(200).json({ favorites });
  } catch (err) {
    console.error('getFavorites error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Get a specific favorite
export const getFavoriteById = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const favorite = await Favorite.findOne({ user: userId, product: productId }).populate('product');
    if (!favorite) {
      return res.status(404).json({ message: 'Product not found in favorites' });
    }

    res.status(200).json({ favorite });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Remove a product from favorites
export const removeFromFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const deleted = await Favorite.findOneAndDelete({ user: userId, product: productId });

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found in favorites' });
    }

    res.status(200).json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Clear all favorites
export const clearFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    await Favorite.deleteMany({ user: userId });
    res.status(200).json({ message: 'All favorites cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
