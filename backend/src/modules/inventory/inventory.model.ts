import { DataTypes }  from 'sequelize';
import { sequelize }  from '../../config/db';

const Inventory = sequelize.define("Inventory", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reorderLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Inventory;
