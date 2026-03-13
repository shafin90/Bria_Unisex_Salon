import { DataTypes }  from 'sequelize';
import { sequelize }  from '../../config/db';

const Admin = sequelize.define("Admin", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Super Admin', 'Tenant Admin', 'Owner', 'Manager', 'Stylist'),
        defaultValue: 'Owner'
    },
    stylistId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: true // Super Admins might have null tenantId
    }
}, {
    timestamps: true
});

export default Admin;
