const express = require('express');
const authMiddleware = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const adminController = require('../controllers/admin');

const router = express.Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.post('/habitudes', adminController.createHabitude);
router.put('/habitudes/:id', adminController.updateHabitude);
router.delete('/habitudes/:id', adminController.deleteHabitude);
router.post('/videos', adminController.createVideo);
router.put('/videos/:id', adminController.updateVideo);
router.delete('/videos/:id', adminController.deleteVideo);
router.get('/stats', adminController.getStats);

module.exports = router;
