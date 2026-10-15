// ==========================================================================
// Product Routes (/api/products)
// ==========================================================================

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Get all hardware items with search/filters
router.get('/', productController.getProducts);

// GET /api/products/:id - Single hardware item details
router.get('/:id', productController.getProductById);

// POST /api/products - Add hardware product (Admin/Manager)
router.post('/', productController.createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;

