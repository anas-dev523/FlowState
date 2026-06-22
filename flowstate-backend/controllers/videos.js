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
