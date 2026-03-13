const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Waitlist = sequelize.define("Waitlist", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    preferredDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preferredTimeRange: {
        type: DataTypes.JSONB // { start: string, end: string }
    },
    status: {
        type: DataTypes.ENUM('Waiting', 'Notified', 'Booked', 'Cancelled'),
        defaultValue: 'Waiting'
    }
}, {
    timestamps: true
});

module.exports = Waitlist;
