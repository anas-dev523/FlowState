const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/stats/global — lecture depuis la table statistiques
router.get('/global', async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await prisma.statistiques.findUnique({ where: { id_utilisateur: userId } });

    if (!stats) {
      return res.json({ score: 0, habitsFollowed: 0, validatedCount: 0, focusMinutes: 0, startDate: null });
    }

    res.json({
      score: stats.score_total,
      habitsFollowed: stats.nb_habitudes_actives,
      validatedCount: stats.nb_validations,
      focusMinutes: stats.total_minutes_focus,
      startDate: stats.debut ? stats.debut.toISOString().split('T')[0] : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/stats/daily-completion?days=14 — taux de completion (%) par jour
router.get('/daily-completion', async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 14;

    const suivis = await prisma.suivre.findMany({
      where: { id_utilisateur: userId },
      select: { id_habitude: true },
    });
    const total = suivis.length;

    if (total === 0) {
      return res.json([]);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (days - 1));

    const validations = await prisma.validationHabitude.findMany({
      where: {
        id_utilisateur: userId,
        date_validation: { gte: startDate, lte: today },
      },
      select: { date_validation: true },
    });

    // Compte des validations par jour
    const countByDay = {};
    for (const v of validations) {
      const key = v.date_validation.toISOString().split('T')[0];
      countByDay[key] = (countByDay[key] || 0) + 1;
    }

    // Construit la serie pour les N derniers jours
    const result = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0];
      const count = countByDay[key] || 0;
      const percent = Math.round((count / total) * 100);
      result.push({ date: key, percent });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
