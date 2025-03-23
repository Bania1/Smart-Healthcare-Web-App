const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

// Register a new user
router.post("/register", authController.register);

// Login user and generate JWT
router.post("/login", authController.login);

// Get the profile of the authenticated user
// Protected by `authenticate` middleware
router.get("/profile", authenticate, authController.getProfile);

module.exports = router;
