const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/videos - liste publique
router.get('/', async (req, res) => {
  try {
    const videos = await prisma.videoMotivation.findMany({
      orderBy: { date_creation: 'desc' }
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/videos/:id/visionner - enregistrer un visionnage (auth required)
router.post('/:id/visionner', authMiddleware, async (req, res) => {
  try {
    const id_video = parseInt(req.params.id);
    const { duree_visionnee } = req.body;

    const video = await prisma.videoMotivation.findUnique({ where: { id_video } });
    if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });

    const visionnage = await prisma.visionnageVideo.create({
      data: { id_utilisateur: req.user.userId, id_video, duree_visionnee }
    });
    res.status(201).json(visionnage);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
