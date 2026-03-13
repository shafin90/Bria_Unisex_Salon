const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Portfolio = sequelize.define("Portfolio", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    beforeImg: {
        type: DataTypes.STRING
    },
    afterImg: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stylistId: {
        type: DataTypes.UUID
    }
}, {
    timestamps: true
});

module.exports = Portfolio;
