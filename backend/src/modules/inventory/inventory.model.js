const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Inventory = sequelize.define("Inventory", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reorderLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    }
}, {
    timestamps: true
});

module.exports = Inventory;
