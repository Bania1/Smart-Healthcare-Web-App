// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register and login (públicas)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile (protegida)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
