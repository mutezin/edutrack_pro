const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authenticate, isParent } = require('../middleware/authMiddleware');

// All parent routes require auth and parent role
router.use(authenticate, isParent);

// GET /api/parents/:parentId/dashboard
router.get('/:parentId/dashboard', parentController.getParentDashboard);

// GET /api/parents/:parentId/child/:childId/report
router.get('/:parentId/child/:childId/report', parentController.getChildReport);

// GET /api/parents/:parentId/child/:childId/analysis
router.get('/:parentId/child/:childId/analysis', parentController.getDetailedAnalysis);

module.exports = router;
