require("dotenv").config();

/**
 * TODO: Configurați fișierul pentru gestionarea conexiunii la baza de date.
 * Acest fișier ar trebui să:
 * 1. Utilizeze variabilele de mediu pentru a configura conexiunea la baza de date.
 *
 * Exemplu:
 * module.exports = {
 *   development: {
 *     username: process.env.DB_USER || "postgres",
 *     password: process.env.DB_PASSWORD || "postgres",
 *     database: process.env.DB_NAME || "app_db",
 *     host: process.env.DB_HOST || "localhost",
 *     port: process.env.DB_PORT || 5432,
 *     dialect: "postgres",
 *     logging: console.log,
 *   }
 * };
 */
