import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { initDb } from './config/db.js';
import applicationRoutes from './routes/applications.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/students.js';
import studentQueueRoutes from './routes/queue/students.js';
import staffQueueRoutes from './routes/queue/staff.js';
import publicDisplayRoutes from './routes/queue/publicDisplay.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new SocketServer(server, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true },
});

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/queue', studentQueueRoutes);
app.use('/api/queue/staff', staffQueueRoutes);
app.use('/api/queue/display', publicDisplayRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

io.on('connection', (socket) => {
  socket.on('join-campus', (campusId) => {
    socket.join(`campus-${campusId}`);
  });
  socket.on('join-department', (deptId) => {
    socket.join(`dept-${deptId}`);
  });
});

import { setIO } from './utils/broadcast.js';
setIO(io);

await initDb();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
