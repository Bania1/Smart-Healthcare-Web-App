const { Sequelize } = require("sequelize");
const { User } = require("../models");
const { generateToken } = require("../utils/jwtHelper");

/**
 * Register a new user
 * @param {string} username - Username
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {Object} - User object and token
 */
const registerUser = async (username, email, password) => {
	/**
	 * TODO: Implementați funcția de înregistrare a unui utilizator.
	 * Aceasta ar trebui să includă:
	 * 1. Verificarea dacă utilizatorul există deja în baza de date (după email sau username).
	 * 2. Crearea unui nou utilizator dacă nu există deja.
	 * 3. Generarea unui token JWT pentru autentificare.
	 * 4. Returnarea obiectului utilizator și a tokenului generat.
	 */
};

/**
 * Login user
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {Object} - User object and token
 */
const loginUser = async (email, password) => {
	/**
	 * TODO: Implementați funcția de autentificare a unui utilizator.
	 * Aceasta ar trebui să includă:
	 * 1. Căutarea utilizatorului în baza de date pe baza emailului.
	 * 2. Verificarea parolei utilizatorului.
	 * 3. Generarea unui token JWT pentru sesiunea utilizatorului.
	 * 4. Returnarea utilizatorului (fără parolă) și a tokenului generat.
	 */
};

module.exports = {
	registerUser,
	loginUser,
};
