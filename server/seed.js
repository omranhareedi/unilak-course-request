import 'dotenv/config';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';

const seed = async () => {
  await connectDB();

  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  await Admin.create({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  console.log(`Admin created: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
  process.exit(0);
};

seed();
