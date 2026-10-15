// ==========================================================================
// Analytics Routes (/api/analytics)
// ==========================================================================

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/dashboard - Fetch all SaaS metrics and chart data
router.get('/dashboard', analyticsController.getDashboardMetrics);

module.exports = router;

