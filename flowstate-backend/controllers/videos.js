const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getVideos = async (req, res) => {
  try {
    const videos = await prisma.videoMotivation.findMany({
      orderBy: { date_creation: 'desc' }
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.visionner = async (req, res) => {
  try {
    const id_video = req.params.id;
    const { duree_visionnee } = req.body;

    const video = await prisma.videoMotivation.findUnique({ where: { id_video } });
    if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });

    const visionnage = await prisma.visionnageVideo.create({
      data: { id_utilisateur: req.user.userId, id_video, duree_visionnee }
    });
    res.status(201).json(visionnage);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
