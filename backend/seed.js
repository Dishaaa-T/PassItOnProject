import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import Product from './models/productModel.js';

dotenv.config();

const seedData = [
  {
    user: { name: 'Maya Chen', email: 'maya@example.com', password: 'password123', location: 'Portland, OR' },
    products: [
      { title: 'Vintage Denim Jacket — 90s', description: 'Classic 90s oversized denim jacket in excellent condition. Light wash with original hardware. A timeless piece that only gets better with age.', category: 'Clothing', condition: 'Like New', price: 45, images: ['https://images.pexels.com/photos/8685990/pexels-photo-8685990.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'] },
      { title: 'Hardcover Classics Collection', description: 'Set of 5 hardcover classic novels — Pride and Prejudice, Jane Eyre, Wuthering Heights, Great Expectations, and Middlemarch. Read once, pristine condition.', category: 'Books', condition: 'Like New', price: 32, images: ['https://images.pexels.com/photos/2002217/pexels-photo-2002217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'] },
    ],
  },
  {
    user: { name: 'James Okoro', email: 'james@example.com', password: 'password123', location: 'Austin, TX' },
    products: [
      { title: 'MacBook Pro 2017 — 13 inch', description: 'MacBook Pro 2017 13-inch, 8GB RAM, 256GB SSD. Works perfectly. Some cosmetic wear on the edges but fully functional. Charger included.', category: 'Electronics', condition: 'Good', price: 380, images: ['https://images.pexels.com/photos/12200696/pexels-photo-12200696.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'] },
      { title: 'Yashica Film Camera', description: 'Vintage Yashica twin-lens reflex film camera. Beautiful piece for collectors or film enthusiasts. Lens is clean, shutter fires correctly.', category: 'Electronics', condition: 'Fair', price: 85, images: ['https://images.pexels.com/photos/4678185/pexels-photo-4678185.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'] },
    ],
  },
  {
    user: { name: 'Sofia Rossi', email: 'sofia@example.com', password: 'password123', location: 'Brooklyn, NY' },
    products: [
      { title: 'Acoustic Guitar — Yamaha FG800', description: 'Yamaha FG800 acoustic guitar. Warm tone, recently restrung. A few minor dings on the body but plays beautifully. Great for beginners or intermediate players.', category: 'Sports', condition: 'Good', price: 120, images: ['https://images.pexels.com/photos/26770053/pexels-photo-26770053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'] },
      { title: 'Vintage Magazine Bundle', description: 'Collection of 12 vintage lifestyle magazines from the 70s and 80s. Great for collage art, decor, or reading. All intact.', category: 'Books', condition: 'Fair', price: 18, images: ['https://images.pexels.com/photos/30618331/pexels-photo-30618331.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'] },
    ],
  },
  {
    user: { name: 'Liam Murphy', email: 'liam@example.com', password: 'password123', location: 'Denver, CO' },
    products: [
      { title: 'Smartwatch & Laptop Bundle', description: 'Gently used smartwatch and laptop. Both about 2 years old, well maintained. Perfect starter tech setup for a student.', category: 'Electronics', condition: 'Good', price: 220, images: ['https://images.pexels.com/photos/31696749/pexels-photo-31696749.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'] },
      { title: 'Denim & Accessories Bundle', description: 'Two pairs of jeans, one vintage camera bag, and sunglasses. All in great shape. Selling as a bundle.', category: 'Clothing', condition: 'Good', price: 28, images: ['https://images.pexels.com/photos/18533668/pexels-photo-18533668.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'] },
    ],
  },
];

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/passiton';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await Product.deleteMany();
    await User.deleteMany();
    console.log('Cleared existing data');

    for (const seed of seedData) {
      const user = await User.create(seed.user);
      for (const p of seed.products) {
        const score = { New: 30, 'Like New': 70, Good: 85, Fair: 95 }[p.condition] || 50;
        await Product.create({ ...p, seller: user._id, sellerName: user.name, location: user.location, sustainabilityScore: score });
      }
    }

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

run();

