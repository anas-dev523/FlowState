// middleware/auth.js
// Middleware de vérification du token JWT

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token manquant. Authentification requise.'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter les infos de l'utilisateur à la requête
    req.user = decoded;

    // Continuer vers la route suivante
    next();

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({
      error: 'Token invalide ou expiré'
    });
  }
};

module.exports = authMiddleware;
