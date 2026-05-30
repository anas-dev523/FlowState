require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const habitudesRoutes = require('./routes/habitudes');
const sessionsRoutes = require('./routes/sessions');
const videosRoutes = require('./routes/videos');
const statsRoutes = require('./routes/stats');
const cookieParser = require('cookie-parser');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = (process.env.FRONTEND_URL || 'http://localhost:3000').trim();
app.use(cors({origin: allowedOrigin, credentials:true}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/habitudes', habitudesRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin',adminRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'FlowState API is running', status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ database: 'Connected', message: 'PostgreSQL is running' });
  } catch (error) {
    res.status(500).json({ database: 'Disconnected', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Health check : http://localhost:${PORT}/api/health`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
