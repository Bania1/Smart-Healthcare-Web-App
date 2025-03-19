const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = async (req, res, next) => {
	/**
	 * TODO: Implementați middleware-ul de autentificare JWT.
	 * Acest middleware ar trebui să:
	 * 1. Extrage token-ul JWT din antetul cererii (Authorization).
	 * 2. Verifice dacă token-ul există și are prefixul corect ("Bearer").
	 * 3. Decodeze și verifice token-ul folosind cheia secretă JWT.
	 * 4. Caută utilizatorul în baza de date pe baza ID-ului decodat din token.
	 * 5. Atașeze utilizatorul găsit la obiectul request pentru a putea fi utilizat în rutele protejate.
	 * 6. Returneze erori corespunzătoare în cazul unui token invalid, expirat sau a unui utilizator inexistent.
	 */
};

module.exports = { authenticate };
