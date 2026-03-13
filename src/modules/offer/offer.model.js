const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Offer = sequelize.define("Offer", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    offerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    offerImg: {
        type: DataTypes.STRING
    },
    startDate: {
        type: DataTypes.STRING
    },
    endDate: {
        type: DataTypes.STRING
    },
    usageLimit: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "Active"
    }
}, {
    timestamps: true
});

module.exports = Offer;
