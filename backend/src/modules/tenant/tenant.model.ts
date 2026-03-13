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
    }
}, {
    timestamps: true
});

export default Tenant;
