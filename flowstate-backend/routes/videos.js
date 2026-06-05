const express = require('express');
const authMiddleware = require('../middleware/auth');
const videosController = require('../controllers/videos');

const router = express.Router();

router.get('/', videosController.getVideos);
router.post('/:id/visionner', authMiddleware, videosController.visionner);

module.exports = router;
