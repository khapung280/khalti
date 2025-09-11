import Product from '../model/productmodel.js';
import { groceryProducts } from '../data/groceryProducts.js';

export async function seedProductsIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(groceryProducts);
    console.log(`✅ Seeded ${groceryProducts.length} grocery products`);
  } else {
    console.log(`📦 Products in database: ${count}`);
  }
}
