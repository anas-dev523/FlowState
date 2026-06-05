const express = require('express');
const authenticateToken = require('../middleware/auth');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/password', authenticateToken, authController.updatePassword);
router.delete('/account', authenticateToken, authController.deleteAccount);
router.post('/Logout', authController.logout);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
