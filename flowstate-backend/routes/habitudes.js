const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/habitudes/catalogue — toutes les habitudes disponibles (pour le picker)
router.get('/catalogue', authMiddleware, async (req, res) => {
  try {
    const habitudes = await prisma.habitude.findMany({
      where: { est_active: true },
      orderBy: { date_creation: 'asc' }
    });
    res.json(habitudes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.use(authMiddleware);

// GET /api/habitudes — les habitudes suivies par l'utilisateur
router.get('/', async (req, res) => {
  try {
    const habitudes = await prisma.habitude.findMany({
      where: { suivis: { some: { id_utilisateur: req.user.userId } } },
      orderBy: { date_creation: 'desc' }
    });
    res.json(habitudes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// GET /api/habitudes — les habitudes validé aujourd'hui par l'utilisateur
router.get('/validations/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validations = await prisma.validationHabitude.findMany({
      where: { id_utilisateur: req.user.userId, date_validation: today },
      select: { id_habitude: true }
    });
    res.json(validations.map(v => v.id_habitude));
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/habitudes/:id/suivre — l'utilisateur s'abonne a une habitude existante
router.post('/:id/suivre', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const habitude = await prisma.habitude.findUnique({ where: { id_habitude: id } });
    if (!habitude) return res.status(404).json({ error: 'Habitude non trouvée' });

    const existing = await prisma.suivre.findUnique({
      where: { id_utilisateur_id_habitude: { id_utilisateur: req.user.userId, id_habitude: id } }
    });
    if (existing) return res.status(400).json({ error: 'Habitude déjà suivie' });

    await prisma.suivre.create({
      data: { id_utilisateur: req.user.userId, id_habitude: id }
    });

    res.status(201).json({ message: 'Habitude ajoutée', habitude });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/habitudes/:id/suivre — l'utilisateur se desabonne d'une habitude 
router.delete('/:id/suivre', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.suivre.findUnique({
      where: { id_utilisateur_id_habitude: { id_utilisateur: req.user.userId, id_habitude: id } }
    });
    if (!existing) return res.status(404).json({ error: 'Habitude non suivie' });

    await prisma.suivre.delete({
      where: { id_utilisateur_id_habitude: { id_utilisateur: req.user.userId, id_habitude: id } }
    });

    res.json({ message: 'Habitude retiree de la liste' });
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
      where: { id_habitude: id, suivis: { some: { id_utilisateur: req.user.userId } } }
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
      where: { id_habitude: id, suivis: { some: { id_utilisateur: req.user.userId } } }
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
    const { note } = req.body || {};

    const habitude = await prisma.habitude.findFirst({
      where: { id_habitude: id, suivis: { some: { id_utilisateur: req.user.userId } } }
    });
    if (!habitude) return res.status(404).json({ error: 'Habitude non trouvée' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.validationHabitude.findFirst({
      where: { id_habitude: id, id_utilisateur: req.user.userId, date_validation: today }
    });
    if (existing) return res.status(400).json({ error: 'Habitude déjà validée aujourd\'hui' });

    const validation = await prisma.validationHabitude.create({
      data: { id_habitude: id, id_utilisateur: req.user.userId, date_validation: today, note: note !== undefined ? parseInt(note) : undefined }
    });

    res.status(201).json(validation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// DELETE /api/habitudes/:id/valider
router.delete('/:id/valider', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const habitude = await prisma.habitude.findFirst({
      where: { id_habitude: id, suivis: { some: { id_utilisateur: req.user.userId } } }
    });
    if (!habitude) return res.status(404).json({ error: 'Habitude non trouvée' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.validationHabitude.deleteMany({
      where: { id_habitude: id, id_utilisateur: req.user.userId, date_validation: today }
    });

    res.json({ message: 'Validation supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
