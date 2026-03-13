const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Service = sequelize.define("Service", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    serviceName: {
        type: DataTypes.STRING
    },
    serviceDescription: {
        type: DataTypes.TEXT
    },
    img: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER
    },
    category: {
        type: DataTypes.STRING // for men or women
    },
    bookingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    serviceType: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

module.exports = Service;
