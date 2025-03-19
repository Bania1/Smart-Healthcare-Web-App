const { Sequelize } = require("sequelize");
require("dotenv").config();

/**
 * TODO: Configurați conexiunea la baza de date utilizând Sequelize.
 * Acest fișier ar trebui să:
 * 1. Încarce variabilele de mediu pentru configurarea bazei de date.
 * 2. Inițializeze o instanță Sequelize cu setările corespunzătoare.
 * 3. Configureze pool-ul de conexiuni pentru o gestionare eficientă a resurselor.
 * 4. Exportă instanța Sequelize pentru a fi utilizată în întreaga aplicație.
 */

const sequelize = new Sequelize(
	process.env.DB_NAME || "app_db",
	process.env.DB_USER || "postgres",
	process.env.DB_PASSWORD || "postgres",
	{
		host: process.env.DB_HOST || "localhost",
		port: process.env.DB_PORT || 5432,
		dialect: "postgres",
		logging: process.env.NODE_ENV === "development" ? console.log : false,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);
module.exports = { sequelize };
