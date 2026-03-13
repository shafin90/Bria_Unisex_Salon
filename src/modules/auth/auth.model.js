const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Admin = sequelize.define("Admin", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Owner', 'Manager', 'Stylist'),
        defaultValue: 'Owner'
    },
    stylistId: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Admin;
