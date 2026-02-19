const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { validateAlert, validateId } = require('../middleware/validation');

router.get('/', alertController.getAlerts);
router.get('/:id', validateId, alertController.getAlertById);
router.get('/status/:status', alertController.getAlertsByStatus);
router.post('/', validateAlert, alertController.createAlert);
router.put('/:id', validateId, validateAlert, alertController.updateAlert);
router.delete('/:id', validateId, alertController.deleteAlert);

module.exports = router;
