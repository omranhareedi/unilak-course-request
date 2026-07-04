import 'dotenv/config';
import { initDb } from './config/db.js';
import { createAdmin, findByEmail } from './models/Admin.js';

const seed = async () => {
  await initDb();

  const existing = findByEmail(process.env.ADMIN_EMAIL);
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  await createAdmin(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  console.log(`Admin created: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
  process.exit(0);
};

seed();
