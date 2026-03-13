import { Sequelize }  from 'sequelize';
import config  from './env';
import { getTenantId } from '../utils/context';

export const sequelize = new Sequelize(config.databaseUrl, {
    dialect: "postgres",
    logging: false,
});

// GLOBAL TENANT ISOLATION HOOKS
sequelize.addHook('beforeFind', (options: any) => {
    const tenantId = getTenantId();
    if (tenantId) {
        // Automatically inject tenantId into where clause
        options.where = {
            ...options.where,
            tenantId
        };
    }
});

sequelize.addHook('beforeCreate', (instance: any) => {
    const tenantId = getTenantId();
    if (tenantId && !instance.tenantId) {
        // Automatically set tenantId for new records
        instance.tenantId = tenantId;
    }
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL Connected successfully via Sequelize.");

        // Define Associations here to avoid circular dependencies
        const { default: Tenant } = await import('../modules/tenant/tenant.model');
        const { default: Admin } = await import('../modules/auth/auth.model');
        const { default: User } = await import('../modules/user/user.model');
        const { default: Booking } = await import('../modules/booking/booking.model');
        const { default: Stylist } = await import('../modules/stylist/stylist.model');
        const { default: Portfolio } = await import('../modules/portfolio/portfolio.model');
        const { default: Waitlist } = await import('../modules/waitlist/waitlist.model');
        const { default: Payment } = await import('../modules/payment/payment.model');
        const { default: Inventory } = await import('../modules/inventory/inventory.model');
        const { default: Offer } = await import('../modules/offer/offer.model');
        const { default: Package } = await import('../modules/package/package.model');
        const { default: Review } = await import('../modules/review/review.model');
        const { default: Service } = await import('../modules/service/service.model');

        // Relationships
        
        // Tenant associations
        Admin.belongsTo(Tenant, { foreignKey: 'tenantId' });
        User.belongsTo(Tenant, { foreignKey: 'tenantId' });
        Booking.belongsTo(Tenant, { foreignKey: 'tenantId' });
        Stylist.belongsTo(Tenant, { foreignKey: 'tenantId' });
        Portfolio.belongsTo(Tenant, { foreignKey: 'tenantId' });
        Waitlist.belongsTo(Tenant, { foreignKey: 'tenantId' });
        Payment.belongsTo(Tenant, { foreignKey: 'tenantId' });
        if(Inventory) Inventory.belongsTo(Tenant, { foreignKey: 'tenantId' });
        if(Offer) Offer.belongsTo(Tenant, { foreignKey: 'tenantId' });
        if(Package) Package.belongsTo(Tenant, { foreignKey: 'tenantId' });
        if(Review) Review.belongsTo(Tenant, { foreignKey: 'tenantId' });
        if(Service) Service.belongsTo(Tenant, { foreignKey: 'tenantId' });

        // Existing relationships
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

    } catch (error: any) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};
