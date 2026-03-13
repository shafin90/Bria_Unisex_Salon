import { DataTypes }  from 'sequelize';
import { sequelize }  from '../../config/db';

const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'usd'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
        defaultValue: 'Pending'
    },
    paymentMethod: {
        type: DataTypes.STRING
    },
    transactionId: {
        type: DataTypes.STRING
    },
    commissionAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    stylistId: {
        type: DataTypes.UUID
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Payment;
