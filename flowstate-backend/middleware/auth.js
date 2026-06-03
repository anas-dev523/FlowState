// Middleware de vérification du token JWT

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware de vérification du token JWT.
 * Vérifie la présence et la validité du token dans les cookies ou le header Authorization.
 * Si valide, attache les informations de l'utilisateur à req.user et passe au middleware suivant.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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
