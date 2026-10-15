// ==========================================================================
// Order Routes (/api/orders)
// ==========================================================================

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders - Fetch customer orders list
router.get('/', orderController.getOrders);

// POST /api/orders - Place and confirm new customer order
router.post('/', orderController.createOrder);

// PATCH /api/orders/:id/status - Update tracking status
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;

