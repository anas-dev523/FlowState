const express = require('express');
const videosController = require('../controllers/videos');

const router = express.Router();

router.get('/', videosController.getVideos);

module.exports = router;
