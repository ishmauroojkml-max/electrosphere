// ==========================================================================
// Auth Routes (/api/auth)
// ==========================================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - User Sign In
router.post('/login', authController.login);

// POST /api/auth/register - User Registration
router.post('/register', authController.register);

// GET /api/auth/users - List all users
router.get('/users', authController.getUsers);

// PATCH /api/auth/users/:id/role - Update user role
router.patch('/users/:id/role', authController.updateUserRole);

module.exports = router;

