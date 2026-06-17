const { PrismaClient } = require('@prisma/client');
const { updateDailyScore, updateStatistiques } = require('../utils/score');

const prisma = new PrismaClient();

exports.getSessions = async (req, res) => {
  try {
    const sessions = await prisma.sessionFocus.findMany({
      where: { id_utilisateur: req.user.userId },
      orderBy: { debut: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Démarre une nouvelle session focus pour l'utilisateur authentifié.
 * Avant de créer la session, ferme automatiquement toutes les sessions orphelines
 * (non terminées) en calculant leur durée réelle à partir de leur heure de début.
 * Garantit qu'un utilisateur n'a jamais plus d'une session active simultanément.
 */
exports.startSession = async (req, res) => {
  try {
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
      data: { id_utilisateur: req.user.userId, debut: new Date() }
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Termine une session focus active et calcule sa durée réelle en minutes.
 * Vérifie que la session appartient bien à l'utilisateur authentifié avant toute modification.
 * Déclenche la mise à jour du score journalier et des statistiques globales.
 */
exports.terminerSession = async (req, res) => {
  try {
    const id = req.params.id;

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

    await updateDailyScore(prisma, req.user.userId, fin);
    await updateStatistiques(prisma, req.user.userId);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
