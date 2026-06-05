const express = require('express');
const authMiddleware = require('../middleware/auth');
const statsController = require('../controllers/stats');

const router = express.Router();

router.use(authMiddleware);

router.get('/global', statsController.getGlobal);
router.get('/daily-completion', statsController.getDailyCompletion);

module.exports = router;
