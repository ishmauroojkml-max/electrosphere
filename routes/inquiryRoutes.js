// ==========================================================================
// Inquiry Routes (/api/inquiries)
// ==========================================================================

const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

// POST /api/inquiries - Submit 3D VIP Pre-Order Inquiry
router.post('/', inquiryController.createInquiry);

// GET /api/inquiries - Fetch all inquiries
router.get('/', inquiryController.getInquiries);

module.exports = router;

