// ==========================================================================
// Payment Routes (/api/payment)
// Dedicated Stripe & PayPal Sandbox Payment APIs
// ==========================================================================

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /api/payment/stripe-charge - Process simulated Stripe Card charge
router.post('/stripe-charge', paymentController.stripeCharge);

// POST /api/payment/paypal-capture - Capture simulated PayPal transaction
router.post('/paypal-capture', paymentController.paypalCapture);

// GET /api/payment/config - Retrieve public sandbox keys & supported gateways
router.get('/config', paymentController.getPaymentConfig);

module.exports = router;

