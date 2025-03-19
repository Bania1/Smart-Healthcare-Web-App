const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Generate JWT token
 * @param {Object} payload - Data to be encoded in token
 * @returns {string} - JWT token
 */
const generateToken = (payload) => {
	/**
	 * TODO: Implementați funcția de generare a unui token JWT.
	 * Aceasta ar trebui să includă:
	 * 1. Crearea unui token JWT utilizând un secret definit în variabilele de mediu.
	 * 2. Definirea unei durate de expirare pentru token (exemplu: 1 zi).
	 * 3. Returnarea tokenului generat.
	 */
};

module.exports = {
	generateToken,
};
