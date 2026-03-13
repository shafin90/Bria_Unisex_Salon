import { DataTypes }  from 'sequelize';
import { sequelize }  from '../../config/db';

const Stylist = sequelize.define("Stylist", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    commissionRate: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    status: {
        type: DataTypes.ENUM('Active', 'On Leave', 'Inactive'),
        defaultValue: 'Active'
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Stylist;
