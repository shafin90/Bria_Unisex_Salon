const { Sequelize } = require("sequelize");
const config = require("./env");

const sequelize = new Sequelize(config.databaseUrl, {
    dialect: "postgres",
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL Connected successfully via Sequelize.");

        // Define Associations here to avoid circular dependencies
        const Admin = require("../modules/auth/auth.model");
        const User = require("../modules/user/user.model");
        const Booking = require("../modules/booking/booking.model");
        const Stylist = require("../modules/stylist/stylist.model");
        const Portfolio = require("../modules/portfolio/portfolio.model");
        const Waitlist = require("../modules/waitlist/waitlist.model");
        const Payment = require("../modules/payment/payment.model");

        // Relationships
        Admin.belongsTo(Stylist, { foreignKey: 'stylistId' });
        Booking.belongsTo(Stylist, { foreignKey: 'stylistId' });
        Portfolio.belongsTo(Stylist, { foreignKey: 'stylistId' });
        Waitlist.belongsTo(User, { foreignKey: 'userId' });
        Payment.belongsTo(Booking, { foreignKey: 'bookingId' });
        Payment.belongsTo(User, { foreignKey: 'userId' });
        Payment.belongsTo(Stylist, { foreignKey: 'stylistId' });

        // Sync Database
        await sequelize.sync({ alter: true });
        console.log("Database synchronized.");

    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
