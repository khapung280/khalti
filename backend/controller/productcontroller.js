import Product from '../model/productmodel.js';
import { groceryProducts } from '../data/groceryProducts.js';

export const seedGroceryProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.status(200).json({ message: 'Products already exist', count });
    }
    const created = await Product.insertMany(groceryProducts);
    res.status(201).json({ message: 'Grocery products seeded', count: created.length });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: 'Failed to seed products', details: err.message });
  }
};
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products', details: err.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: 'Product created', product: newProduct });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}; 

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error finding product by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};