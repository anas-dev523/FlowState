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
