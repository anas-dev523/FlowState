const { PrismaClient } = require('@prisma/client');
const { updateDailyScore, updateStatistiques } = require('../utils/score');

const prisma = new PrismaClient();

exports.getCatalogue = async (req, res) => {
  try {
    const habitudes = await prisma.habitude.findMany({
      orderBy: { date_creation: 'asc' }
    });
    res.json(habitudes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getMesHabitudes = async (req, res) => {
  try {
    const habitudes = await prisma.habitude.findMany({
      where: { suivis: { some: { id_utilisateur: req.user.userId } } },
      orderBy: { date_creation: 'desc' }
    });
    res.json(habitudes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getValidationsToday = async (req, res) => {
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
};

exports.suivreHabitude = async (req, res) => {
  try {
    const id = req.params.id;

    const habitude = await prisma.habitude.findUnique({ where: { id_habitude: id } });
    if (!habitude) return res.status(404).json({ error: 'Habitude non trouvée' });

    const existing = await prisma.suivre.findUnique({
      where: { id_utilisateur_id_habitude: { id_utilisateur: req.user.userId, id_habitude: id } }
    });
    if (existing) return res.status(400).json({ error: 'Habitude déjà suivie' });

    await prisma.suivre.create({
      data: { id_utilisateur: req.user.userId, id_habitude: id }
    });

    await updateStatistiques(prisma, req.user.userId);

    res.status(201).json({ message: 'Habitude ajoutée', habitude });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await prisma.suivre.findUnique({
      where: { id_utilisateur_id_habitude: { id_utilisateur: req.user.userId, id_habitude: id } }
    });
    if (!existing) return res.status(404).json({ error: 'Habitude non suivie' });

    await prisma.suivre.delete({
      where: { id_utilisateur_id_habitude: { id_utilisateur: req.user.userId, id_habitude: id } }
    });

    await updateStatistiques(prisma, req.user.userId);

    res.json({ message: 'Habitude retiree de la liste' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateHabitude = async (req, res) => {
  try {
    const id = req.params.id;
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
};

exports.deleteHabitude = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await prisma.suivre.findUnique({
      where: { id_utilisateur_id_habitude: { id_utilisateur: req.user.userId, id_habitude: id } }
    });
    if (!existing) return res.status(404).json({ error: 'Habitude non suivie' });

    await prisma.suivre.delete({
      where: { id_utilisateur_id_habitude: { id_utilisateur: req.user.userId, id_habitude: id } }
    });

    await updateStatistiques(prisma, req.user.userId);

    res.json({ message: 'Habitude supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Valide une habitude pour l'utilisateur authentifié à la date du jour.
 * Vérifie que l'habitude est bien suivie par l'utilisateur et qu'elle n'a pas déjà
 * été validée aujourd'hui (contrainte 1 validation/jour/habitude).
 * Déclenche la mise à jour du score journalier et des statistiques globales.
 */
exports.validerHabitude = async (req, res) => {
  try {
    const id = req.params.id;
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

    await updateDailyScore(prisma, req.user.userId, today);
    await updateStatistiques(prisma, req.user.userId);

    res.status(201).json(validation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.devaliderHabitude = async (req, res) => {
  try {
    const id = req.params.id;

    const habitude = await prisma.habitude.findFirst({
      where: { id_habitude: id, suivis: { some: { id_utilisateur: req.user.userId } } }
    });
    if (!habitude) return res.status(404).json({ error: 'Habitude non trouvée' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.validationHabitude.deleteMany({
      where: { id_habitude: id, id_utilisateur: req.user.userId, date_validation: today }
    });

    await updateDailyScore(prisma, req.user.userId, today);
    await updateStatistiques(prisma, req.user.userId);

    res.json({ message: 'Validation supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
