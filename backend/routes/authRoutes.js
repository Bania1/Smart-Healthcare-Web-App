const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

/**
 * TODO: Implementați rutele de autentificare.
 * Aceste rute ar trebui să permită:
 * 1. Înregistrarea unui utilizator nou (/register).
 * 2. Autentificarea utilizatorului și generarea unui token JWT (/login).
 * 3. Obținerea profilului utilizatorului autentificat (/profile) - protejat prin middleware-ul `authenticate`.
 */

module.exports = router;
