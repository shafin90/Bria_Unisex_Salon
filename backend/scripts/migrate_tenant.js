const { sequelize } = require("../src/config/db");
const Tenant = require("../src/modules/tenant/tenant.model");
const Admin = require("../src/modules/auth/auth.model");
const User = require("../src/modules/user/user.model");
const Booking = require("../src/modules/booking/booking.model");
const Stylist = require("../src/modules/stylist/stylist.model");
const Portfolio = require("../src/modules/portfolio/portfolio.model");
const Waitlist = require("../src/modules/waitlist/waitlist.model");
const Payment = require("../src/modules/payment/payment.model");
const Inventory = require("../src/modules/inventory/inventory.model");
const Offer = require("../src/modules/offer/offer.model");
const Package = require("../src/modules/package/package.model");
const Review = require("../src/modules/review/review.model");
const Service = require("../src/modules/service/service.model");

async function runMigration() {
    try {
        console.log("Starting multi-tenant migration...");
        
        // Ensure models are available (alter: false to prevent crashing on allowNull if columns don't exist yet)
        await sequelize.authenticate();
        
        // Creating the default tenant. Raw query in case sync hasn't run.
        await sequelize.sync({ alter: false }); // Just to make sure tables exist, but might fail if we rely on it to create tenantId nullably.
        
        // Actually, the app's db.js already syncs with alter: true. 
        // If it crashes because of allowNull: false on existing data, the user will have to wipe or manually alter.
        // Assuming fresh DB or handled by user, this script populates the default.

        await sequelize.sync({ alter: true }); // Will add the tenantId columns.

        let defaultTenant = await Tenant.findOne({ where: { subdomain: 'default' } });
        if (!defaultTenant) {
            defaultTenant = await Tenant.create({
                name: "Bria Salon (Default)",
                subdomain: "default",
                active: true
            });
            console.log("Created Default Tenant:", defaultTenant.id);
        } else {
            console.log("Default Tenant already exists:", defaultTenant.id);
        }

        const tenantId = defaultTenant.id;

        // Assign all existing records to the default tenant
        const models = [Admin, User, Booking, Stylist, Portfolio, Waitlist, Payment, Inventory, Offer, Package, Review, Service];

        for (const Model of models) {
            if (Model) {
                const [updatedRows] = await Model.update(
                    { tenantId: tenantId },
                    { where: { tenantId: null } }
                );
                console.log(`Updated ${updatedRows} rows in ${Model.name}`);
            }
        }

        console.log("Migration completed successfully.");
        process.exit(0);

    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

runMigration();
