// Point d'entrée principal de l'API FlowState

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Import des routes
const authRoutes = require('./routes/auth');

// Initialisation de Prisma et Express
const prisma = new PrismaClient({});
const app = express();
const PORT = process.env.PORT || 5000;

// Configuration des middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Route de test de l'API
app.get('/', (req, res) => {
  res.json({ 
    message: 'FlowState API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Route de vérification de la connexion à la base de données
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ 
      database: 'Connected',
      message: 'PostgreSQL is running'
    });
  } catch (error) {
    res.status(500).json({ 
      database: 'Disconnected',
      error: error.message 
    });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Health check disponible sur http://localhost:${PORT}/api/health`);
  console.log(`Auth routes disponibles sur http://localhost:${PORT}/api/auth`);
});

// Gestion de l'arrêt du serveur
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});