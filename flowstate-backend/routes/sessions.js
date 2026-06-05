const express = require('express');
const authMiddleware = require('../middleware/auth');
const sessionsController = require('../controllers/sessions');

const router = express.Router();

router.use(authMiddleware);

router.get('/', sessionsController.getSessions);
router.post('/', sessionsController.startSession);
router.put('/:id/terminer', sessionsController.terminerSession);

module.exports = router;
