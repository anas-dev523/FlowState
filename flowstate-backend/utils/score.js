/**
 * Calcule le bonus de points accordé selon la durée d'une session focus.
 * @param {number} dureeMinutes - Durée de la session en minutes
 * @returns {number} Bonus de points : 1 (courte ≤20min), 2 (moyenne ≤50min), 3 (longue >50min)
 */
function bonusFocus(dureeMinutes) {
  if (dureeMinutes <= 20) return 1;
  if (dureeMinutes <= 35) return 2;
  if (dureeMinutes <= 50) return 2;
  return 3;
}

async function updateDailyScore(prisma, userId, date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  const suivis = await prisma.suivre.findMany({
    where: { id_utilisateur: userId },
    include: { habitude: true }
  });

  const validations = await prisma.validationHabitude.findMany({
    where: { id_utilisateur: userId, date_validation: dayStart },
    select: { id_habitude: true }
  });
  const validatedIds = new Set(validations.map(v => v.id_habitude));

  let score = 0;
  for (const s of suivis) {
    score += validatedIds.has(s.id_habitude) ? s.habitude.points : -2;
  }

  const sessions = await prisma.sessionFocus.findMany({
    where: { id_utilisateur: userId, est_terminee: true, fin: { gte: dayStart, lte: dayEnd } },
    select: { duree_reelle: true }
  });
  for (const s of sessions) {
    score += bonusFocus(s.duree_reelle);
  }

  await prisma.scoreJournalier.upsert({
    where: { id_utilisateur_date: { id_utilisateur: userId, date: dayStart } },
    create: { id_utilisateur: userId, date: dayStart, score },
    update: { score }
  });
}

async function updateStatistiques(prisma, userId) {
  const nbHabitudesActives = await prisma.suivre.count({ where: { id_utilisateur: userId } });

  const nbValidations = await prisma.validationHabitude.count({ where: { id_utilisateur: userId } });

  const focusResult = await prisma.sessionFocus.aggregate({
    where: { id_utilisateur: userId, est_terminee: true },
    _sum: { duree_reelle: true }
  });
  const totalMinutesFocus = focusResult._sum.duree_reelle || 0;

  const scoreResult = await prisma.scoreJournalier.aggregate({
    where: { id_utilisateur: userId },
    _sum: { score: true }
  });
  const scoreTotal = Math.max(0, scoreResult._sum.score || 0);

  const firstValidation = await prisma.validationHabitude.findFirst({
    where: { id_utilisateur: userId },
    orderBy: { date_validation: 'asc' },
    select: { date_validation: true }
  });
  const debut = firstValidation?.date_validation || null;

  await prisma.statistiques.upsert({
    where: { id_utilisateur: userId },
    create: { id_utilisateur: userId, debut, nb_habitudes_actives: nbHabitudesActives, nb_validations: nbValidations, score_total: scoreTotal, total_minutes_focus: totalMinutesFocus },
    update: { debut, nb_habitudes_actives: nbHabitudesActives, nb_validations: nbValidations, score_total: scoreTotal, total_minutes_focus: totalMinutesFocus }
  });
}

module.exports = { bonusFocus, updateDailyScore, updateStatistiques };
