import { DataTypes }  from 'sequelize';
import { sequelize }  from '../../config/db';

const AuditLog = sequelize.define("AuditLog", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    targetId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    perfomedBy: {
        type: DataTypes.UUID,
        allowNull: true // Can be null for system actions
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: true // Global logs might not have a tenant
    },
    details: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    timestamps: true
});

export default AuditLog;
