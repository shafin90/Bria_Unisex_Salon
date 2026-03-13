const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Review = sequelize.define("Review", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    approvedAt: {
        type: DataTypes.DATE
    }
}, {
    timestamps: true
});

module.exports = Review;
