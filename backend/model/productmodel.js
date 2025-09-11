import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    ProductName: { type: String, required: true },
    ProductCode: { type: String, required: true, unique: true },
    Price: { type: Number, required: true },
    Stock: { type: Number, required: true },
    Thumbnail: { type: String, required: true },
    Description: { type: String, required: true },
    Category: { type: String, default: 'General' },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema, "Product");

export default Product;