const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Package = sequelize.define("Package", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    packageName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    services: {
        type: DataTypes.JSONB // Array of Service IDs
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    img: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "Active"
    }
}, {
    timestamps: true
});

module.exports = Package;
