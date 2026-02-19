const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { validatePerformance, validateId } = require('../middleware/validation');

router.get('/', performanceController.getPerformances);
router.get('/:id', validateId, performanceController.getPerformanceById);
router.get('/student/:studentId', validateId, performanceController.getPerformanceByStudent);
router.post('/', validatePerformance, performanceController.createPerformance);
router.put('/:id', validateId, validatePerformance, performanceController.updatePerformance);
router.delete('/:id', validateId, performanceController.deletePerformance);

module.exports = router;
