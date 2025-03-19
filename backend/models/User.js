const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/database");

/**
 * User model
 */
const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true,
				len: [3, 30],
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [6, 100],
			},
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		timestamps: true,
		tableName: "users",
		// Don't return password in JSON responses
		defaultScope: {
			attributes: { exclude: ["password"] },
		},
		// Include password when specifically requested
		scopes: {
			withPassword: {
				attributes: { include: ["password"] },
			},
		},
		hooks: {
			// Hash password before saving
			beforeCreate: async (user) => {
				if (user.password) {
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
				}
			},
			beforeUpdate: async (user) => {
				if (user.changed("password")) {
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
				}
			},
		},
	}
);

/**
 * Compare plain text password with hashed password
 * @param {string} password - Plain text password to compare
 * @returns {boolean} - True if password matches
 */
User.prototype.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

module.exports = User;
