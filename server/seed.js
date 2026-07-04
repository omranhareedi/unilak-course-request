import 'dotenv/config';
import { initDb, queryAll } from './config/db.js';
import { createAdmin, findByEmail } from './models/Admin.js';
import * as Campus from './models/queue/campus.js';
import * as Department from './models/queue/department.js';
import * as Service from './models/queue/service.js';
import * as Staff from './models/queue/staff.js';

const seed = async () => {
  await initDb();

  // Admin
  const existing = findByEmail(process.env.ADMIN_EMAIL);
  if (!existing) {
    await createAdmin(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    console.log(`Admin: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
  }

  // Campuses
  Campus.seed();
  const campusMap = {};
  const campuses = queryAll('SELECT * FROM campuses');
  for (const c of campuses) campusMap[c.code] = c.id;
  console.log(`Campuses: ${campuses.map(c => c.name).join(', ')}`);

  // Departments
  Department.seed(campusMap);
  const deptMap = {};
  const depts = queryAll('SELECT * FROM departments');
  for (const d of depts) deptMap[d.campus_id + '-' + d.code] = d.id;
  console.log(`Departments: ${depts.length}`);

  // Services
  const svcDeptMap = {};
  for (const d of depts) svcDeptMap[d.code] = d.id;
  Service.seed(svcDeptMap);
  const services = queryAll('SELECT COUNT(*) as c FROM services');
  console.log(`Services: ${services[0].c}`);

  // Staff
  await Staff.seed(svcDeptMap);
  const staff = queryAll('SELECT COUNT(*) as c FROM staff');
  console.log(`Staff accounts: ${staff[0].c}`);
  console.log('Staff credentials:');
  const allStaff = queryAll('SELECT name, email FROM staff');
  for (const s of allStaff) console.log(`  ${s.name}: ${s.email} / staff123`);

  process.exit(0);
};

seed();
