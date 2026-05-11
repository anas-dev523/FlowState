const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// bonus de score selon la duree reelle d'une session focus terminee
function bonusFocus(dureeMinutes) {
  if (dureeMinutes <= 20) return 1;        
  if (dureeMinutes <= 35) return 2;        
  if (dureeMinutes <= 50) return 2;        
  return 3;                                // 60 min ou plus
}

// GET /api/stats/global — calcul du score global + stats focus
router.get('/global', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Habitudes suivies 
    const suivis = await prisma.suivre.findMany({
      where: { id_utilisateur: userId },
      include: { habitude: true },
    });

    //Toutes les validations de l'utilisateur
    const validations = await prisma.validationHabitude.findMany({
      where: { id_utilisateur: userId },
      select: { id_habitude: true, date_validation: true },
      orderBy: { date_validation: 'asc' },
    });

    // Set de lookup rapide : "habitId-YYYY-MM-DD"
    const validatedSet = new Set(
      validations.map(v => `${v.id_habitude}-${v.date_validation.toISOString().split('T')[0]}`)
    );

    // Date de depart = premiere validation. Si aucune, score = 0.
    let habitScore = 0;
    let validatedCount = 0;
    let missedDays = 0;
    let startDate = null;

    if (validations.length > 0 && suivis.length > 0) {
      startDate = new Date(validations[0].date_validation);
      startDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Iterer jour par jour, habitude par habitude
      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dayStr = d.toISOString().split('T')[0];
        for (const s of suivis) {
          const key = `${s.id_habitude}-${dayStr}`;
          if (validatedSet.has(key)) {
            habitScore += s.habitude.points;
            validatedCount += 1;
          } else {
            habitScore -= 2;
            missedDays += 1;
          }
        }
      }
    }

    // Sessions focus terminees
    const sessions = await prisma.sessionFocus.findMany({
      where: { id_utilisateur: userId, est_terminee: true, duree_reelle: { not: null } },
      select: { duree_reelle: true },
    });

    let focusScore = 0;
    let focusMinutes = 0;
    for (const s of sessions) {
      focusScore += bonusFocus(s.duree_reelle);
      focusMinutes += s.duree_reelle;
    }

    res.json({
      score: Math.max(0,habitScore + focusScore),
      habitScore,
      focusScore,
      validatedCount,
      missedDays,
      focusSessions: sessions.length,
      focusMinutes,
      habitsFollowed: suivis.length,
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
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
