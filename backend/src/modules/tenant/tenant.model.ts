import { DataTypes }  from 'sequelize';
import { sequelize }  from '../../config/db';

const Tenant = sequelize.define("Tenant", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subdomain: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    stripeAccountId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stripeConnectStatus: {
        type: DataTypes.ENUM('pending', 'active'),
        defaultValue: 'pending'
    },
    // Stripe Billing (Platform Subscription)
    stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subscriptionId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subscriptionStatus: {
        type: DataTypes.STRING,
        defaultValue: 'none' // 'active', 'past_due', 'canceled', 'none'
    },
    planTier: {
        type: DataTypes.ENUM('basic', 'pro', 'enterprise'),
        defaultValue: 'basic'
    }
}, {
    timestamps: true
});

export default Tenant;
