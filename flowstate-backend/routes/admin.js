const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);  
router.use(requireAdmin);  

//POST /api/admin/habitudes
router.post('/habitudes', async (req, res) => {
  try {
   const { titre, description, effets, points } = req.body;
    const habitude = await prisma.habitude.create({
      data: { titre, description, effets, points }
    });
    res.status(201).json({ message: 'Habitude ajoutée', habitude });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
//PUT /api/admin/habitudes/:id
router.put('/habitudes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titre, description, effets, points } = req.body;
    const habitude = await prisma.habitude.update({
      where: { id_habitude: id },
      data: { titre, description, effets, points }
    });
    res.json({ message: 'Habitude modifiée', habitude });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


//DELETE /api/admin/habitudes/:id
router.delete('/habitudes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.habitude.delete({ where: { id_habitude: id } });
    res.json({ message: 'Habitude retirée' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Habitude non existante' });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/videos
router.post('/videos', async (req, res) => {
  try {
    const { titre, url, categorie, duree } = req.body;
    const video = await prisma.videoMotivation.create({
      data: { titre, url, categorie, duree }
    });
    res.status(201).json({ message: 'Vidéo ajoutée', video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/videos/:id
router.put('/videos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titre, url, categorie, duree } = req.body;
    const video = await prisma.videoMotivation.update({
      where: { id_video: id },
      data: { titre, url, categorie, duree }
    });
    res.json({ message: 'Vidéo modifiée', video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/videos/:id
router.delete('/videos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.videoMotivation.delete({ where: { id_video: id } });
    res.json({ message: 'Vidéo retirée' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Vidéo non existante' });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.get('/stats', async (req, res) => {
  try {
    const [users, habitudes, videos, sessions] = await Promise.all([
      prisma.utilisateur.count(),
      prisma.habitude.count(),
      prisma.videoMotivation.count(),
      prisma.sessionFocus.count({ where: { est_terminee: true } }),
    ]);
    res.json({ users, habitudes, videos, sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;
