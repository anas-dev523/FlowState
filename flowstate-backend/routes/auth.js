const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, prenom, nom } = req.body;

    if (!email || !password || !prenom || !nom) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' });
    }

    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Un compte existe déjà avec cet email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.utilisateur.create({
      data: { email, mot_de_passe: hashedPassword, prenom, nom }
    });

    const token = jwt.sign(
      { userId: user.id_utilisateur, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: { id: user.id_utilisateur, email: user.email, prenom: user.prenom, nom: user.nom,date_creation : user.date_creation }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const validPassword = await bcrypt.compare(password, user.mot_de_passe);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user.id_utilisateur, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id_utilisateur, email: user.email, prenom: user.prenom, nom: user.nom ,date_creation : user.date_creation}
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

//PUT /api/auth/profile
router.put('/profile',authenticateToken,async (req,res) =>{
    try{
      const { email, prenom, nom } = req.body;
    
    if (!email || !prenom || !nom) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    const user = await prisma.utilisateur.update({
      data: { email, prenom, nom } ,
      where:{id_utilisateur :req.user.userId}
    });
    res.json({
      message: 'modification réussie',
      user: { id: user.id_utilisateur, email: user.email, prenom: user.prenom, nom: user.nom }
    });

}catch (error) {
    console.error('Erreur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la modification' });
  }
});
// PUT /api/auth/password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { ancienPassword, nouveauPassword } = req.body;

    if (!ancienPassword || !nouveauPassword) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(nouveauPassword)) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' });
    }

    const user = await prisma.utilisateur.findUnique({ where: { id_utilisateur: req.user.userId } });

    const valid = await bcrypt.compare(ancienPassword, user.mot_de_passe);
    if (!valid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    const hashed = await bcrypt.hash(nouveauPassword, 10);
    await prisma.utilisateur.update({
      where: { id_utilisateur: req.user.userId },
      data: { mot_de_passe: hashed },
    });

    res.json({ message: 'Mot de passe modifié avec succès' });

  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur lors du changement de mot de passe' });
  }
});

// DELETE /api/auth/account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    await prisma.utilisateur.delete({
      where: { id_utilisateur: req.user.userId },
    });
    res.json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression compte:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du compte' });
  }
});

module.exports = router;
