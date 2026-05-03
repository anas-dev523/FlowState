const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await prisma.sessionFocus.findMany({
      where: { id_utilisateur: req.user.userId },
      orderBy: { debut: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/sessions - démarrer une session
router.post('/', async (req, res) => {
  try {
    // Auto-cleanup: ferme les sessions orphelines (tab fermé, endSession qui a échoué...)
    const activeSessions = await prisma.sessionFocus.findMany({
      where: { est_terminee: false, id_utilisateur: req.user.userId }
    });
    for (const old of activeSessions) {
      const fin = new Date();
      const duree_reelle = Math.round((fin - old.debut) / 1000 / 60);
      await prisma.sessionFocus.update({
        where: { id_session_focus: old.id_session_focus },
        data: { fin, duree_reelle, est_terminee: true }
      });
    }

    const session = await prisma.sessionFocus.create({
      data: {
        id_utilisateur: req.user.userId,
        debut: new Date()
      }
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/sessions/:id/terminer
router.put('/:id/terminer', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const session = await prisma.sessionFocus.findFirst({
      where: { id_session_focus: id, id_utilisateur: req.user.userId }
    });
    if (!session) return res.status(404).json({ error: 'Session non trouvée' });

    const fin = new Date();
    const duree_reelle = Math.round((fin - session.debut) / 1000 / 60);

    const updated = await prisma.sessionFocus.update({
      where: { id_session_focus: id },
      data: { fin, duree_reelle, est_terminee: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
