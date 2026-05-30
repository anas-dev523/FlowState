// Middleware de vérification du token JWT

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: 'Token manquant. Authentification requise.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.utilisateur.findUnique({ where: { id_utilisateur: decoded.userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    req.user = decoded;

    next();

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({
      error: 'Token invalide ou expiré'
    });
  }
};

module.exports = authMiddleware;
