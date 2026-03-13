const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receiver: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});

module.exports = Message;
