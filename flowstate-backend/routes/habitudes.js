const express = require('express');
const authMiddleware = require('../middleware/auth');
const habitudesController = require('../controllers/habitudes');

const router = express.Router();

router.get('/catalogue', authMiddleware, habitudesController.getCatalogue);

router.use(authMiddleware);

router.get('/', habitudesController.getMesHabitudes);
router.get('/validations/today', habitudesController.getValidationsToday);
router.post('/:id/suivre', habitudesController.suivreHabitude);
router.delete('/:id/suivre', habitudesController.unfollow);
router.put('/:id', habitudesController.updateHabitude);
router.delete('/:id', habitudesController.deleteHabitude);
router.post('/:id/valider', habitudesController.validerHabitude);
router.delete('/:id/valider', habitudesController.devaliderHabitude);

module.exports = router;
