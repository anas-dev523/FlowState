const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/habitudes
router.get('/', async (req, res) => {
  try {
    const habitudes = await prisma.habitude.findMany({
      where: { id_utilisateur: req.user.userId },
      include: { serie_habitude: true },
      orderBy: { date_creation: 'desc' }
    });
    res.json(habitudes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/habitudes
router.post('/', async (req, res) => {
  try {
    const { titre, description, frequence } = req.body;
    if (!titre) return res.status(400).json({ error: 'Le titre est requis' });

    const habitude = await prisma.habitude.create({
      data: {
        id_utilisateur: req.user.userId,
        titre,
        description,
        frequence: frequence || 'quotidienne'
      }
    });

    await prisma.serieHabitude.create({ data: { id_habitude: habitude.id_habitude } });

    res.status(201).json(habitude);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/habitudes/:id
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titre, description, frequence, est_active } = req.body;

    const habitude = await prisma.habitude.findFirst({
      where: { id_habitude: id, id_utilisateur: req.user.userId }
    });
    if (!habitude) return res.status(404).json({ error: 'Habitude non trouvée' });

    const updated = await prisma.habitude.update({
      where: { id_habitude: id },
      data: { titre, description, frequence, est_active }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/habitudes/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const habitude = await prisma.habitude.findFirst({
      where: { id_habitude: id, id_utilisateur: req.user.userId }
    });
    if (!habitude) return res.status(404).json({ error: 'Habitude non trouvée' });

    await prisma.habitude.delete({ where: { id_habitude: id } });
    res.json({ message: 'Habitude supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/habitudes/:id/valider
router.post('/:id/valider', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { note } = req.body;

    const habitude = await prisma.habitude.findFirst({
      where: { id_habitude: id, id_utilisateur: req.user.userId }
    });
    if (!habitude) return res.status(404).json({ error: 'Habitude non trouvée' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.validationHabitude.findFirst({
      where: { id_habitude: id, date_validation: today }
    });
    if (existing) return res.status(400).json({ error: 'Habitude déjà validée aujourd\'hui' });

    const validation = await prisma.validationHabitude.create({
      data: { id_habitude: id, date_validation: today, note }
    });

    const serie = await prisma.serieHabitude.findUnique({ where: { id_habitude: id } });
    const newStreak = serie.streak_courant + 1;
    await prisma.serieHabitude.update({
      where: { id_habitude: id },
      data: {
        streak_courant: newStreak,
        meilleur_streak: Math.max(newStreak, serie.meilleur_streak),
        derniere_date_validee: today
      }
    });

    res.status(201).json(validation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
