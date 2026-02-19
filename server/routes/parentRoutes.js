const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');

// GET /api/parents/:parentId/dashboard
router.get('/:parentId/dashboard', parentController.getParentDashboard);

module.exports = router;
