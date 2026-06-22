const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function sendBrevoEmail({ to, toName, subject, html }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'FlowState', email: process.env.EMAIL_USER },
      to: [{ email: to, name: toName || to }],
      subject,
      htmlContent: html
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error('Brevo: ' + JSON.stringify(err));
  }
}

/**
 * Inscrit un nouvel utilisateur après validation complète des entrées.
 * Vérifie le format email (regex RFC), la politique de mot de passe (12+ chars, maj, min, chiffre, spécial),
 * et l'unicité de l'email. Hash le mot de passe avec bcrypt (coût 10), génère un token de vérification
 * via crypto.randomBytes(32) et envoie un email d'activation via l'API Brevo.
 */
exports.register = async (req, res) => {
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
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await prisma.utilisateur.create({
      data: { email, mot_de_passe: hashedPassword, prenom, nom, verification_token: verificationToken }
    });

    await sendBrevoEmail({
      to: email,
      toName: prenom,
      subject: 'Confirme ton adresse email FlowState',
      html: `<p>Bonjour ${prenom},</p>
             <p>Clique sur ce lien pour activer ton compte :</p>
             <a href="${(process.env.FRONTEND_URL || 'http://localhost:3000').trim()}/verify-email?token=${verificationToken}">Activer mon compte</a>
             <p>Ce lien expire dans 24h.</p>`
    });

    res.status(201).json({ message: 'Compte créé. Vérifie ta boîte mail pour activer ton compte.' });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
};

/**
 * Authentifie un utilisateur avec son email et mot de passe.
 * Vérifie l'existence du compte, la validité du mot de passe via bcrypt,
 * et que l'email a bien été vérifié. En cas de succès, génère un JWT signé
 * et le dépose dans un cookie httpOnly valable 7 jours.
 */
exports.login = async (req, res) => {
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

    if (!user.email_verified) {
      return res.status(403).json({ error: 'Compte non vérifié. Vérifie ta boîte mail.' });
    }

    const token = jwt.sign(
      { userId: user.id_utilisateur, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.json({
      message: 'Connexion réussie',
      user: { id: user.id_utilisateur, role: user.role, email: user.email, prenom: user.prenom, nom: user.nom, date_creation: user.date_creation }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, prenom, nom } = req.body;

    if (!email || !prenom || !nom) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    const user = await prisma.utilisateur.update({
      data: { email, prenom, nom },
      where: { id_utilisateur: req.user.userId }
    });
    res.json({
      message: 'modification réussie',
      user: { id: user.id_utilisateur, email: user.email, prenom: user.prenom, nom: user.nom }
    });
  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la modification' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { ancienPassword, nouveauPassword } = req.body;

    if (!ancienPassword || !nouveauPassword) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (!passwordRegex.test(nouveauPassword)) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' });
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
};

exports.deleteAccount = async (req, res) => {
  try {
    await prisma.utilisateur.delete({
      where: { id_utilisateur: req.user.userId },
    });
    res.json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression compte:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du compte' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Compte deconnecté avec succès' });
  } catch (error) {
    console.error('Erreur deconnexion du compte:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la deconnexion du compte' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token manquant' });

    const user = await prisma.utilisateur.findFirst({ where: { verification_token: token } });
    if (!user) return res.status(400).json({ error: 'Token invalide' });

    await prisma.utilisateur.update({
      where: { id_utilisateur: user.id_utilisateur },
      data: { email_verified: true, verification_token: null }
    });

    res.json({ message: 'Email vérifié avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: 'Si cet email est enregistré, vous recevrez un lien de réinitialisation.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    await prisma.utilisateur.update({
      where: { id_utilisateur: user.id_utilisateur },
      data: { reset_token: resetToken, reset_token_expiry: new Date(Date.now() + 3600000) }
    });
    await sendBrevoEmail({
      to: email,
      subject: 'Réinitialisation de mot de passe FlowState',
      html: `<p>Clique sur ce lien pour réinitialiser ton mot de passe :</p>
             <a href="${(process.env.FRONTEND_URL || 'http://localhost:3000').trim()}/reset-password?token=${resetToken}">Réinitialiser</a>
             <p>Ce lien expire dans 1 heure.</p>`
    });

    res.json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, nouveauPassword } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (!passwordRegex.test(nouveauPassword)) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' });
    }
    const tokenexist = await prisma.utilisateur.findFirst({ where: { reset_token: token } });
    if (!tokenexist) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }
    if (tokenexist.reset_token_expiry < new Date()) {
      return res.status(400).json({ error: 'Token expiré' });
    }
    const hashed = await bcrypt.hash(nouveauPassword, 10);
    await prisma.utilisateur.update({
      where: { id_utilisateur: tokenexist.id_utilisateur },
      data: { mot_de_passe: hashed, reset_token: null, reset_token_expiry: null }
    });
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
