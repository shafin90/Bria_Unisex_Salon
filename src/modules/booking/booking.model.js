const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    service: {
        type: DataTypes.JSONB // Array of { serviceName, servicePrice, serviceImg }
    },
    date: {
        type: DataTypes.STRING
    },
    time: {
        type: DataTypes.STRING
    },
    confirmationCode: {
        type: DataTypes.STRING
    },
    stylistId: {
        type: DataTypes.UUID
    },
    reminderMessageSend: {
        type: DataTypes.BOOLEAN
    }
}, {
    timestamps: true
});

module.exports = Booking;
