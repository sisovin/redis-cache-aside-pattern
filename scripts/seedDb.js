const db = require('../src/config/database');
const User = require('../src/models/userModel');
const Product = require('../src/models/productModel');

const seedUsers = async () => {
  const users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ];

  for (const user of users) {
    await User.create(user);
  }
};

const seedProducts = async () => {
  const products = [
    { name: 'Product 1', price: 10.0 },
    { name: 'Product 2', price: 20.0 },
  ];

  for (const product of products) {
    await Product.create(product);
  }
};

const seedDatabase = async () => {
  try {
    await db.sync({ force: true });
    await seedUsers();
    await seedProducts();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await db.close();
  }
};

seedDatabase();
