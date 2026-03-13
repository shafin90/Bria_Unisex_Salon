const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        unique: true
    },
    isRepeat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    howMuchRepeat: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalSpent: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastAppearenceDate: {
        type: DataTypes.JSONB // Storing { Date: string, time: string }
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tier: {
        type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Platinum'),
        defaultValue: 'Bronze'
    },
    membershipExpireDate: {
        type: DataTypes.DATE
    }
}, {
    timestamps: true
});

module.exports = User;
