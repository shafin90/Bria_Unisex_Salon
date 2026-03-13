import { DataTypes }  from 'sequelize';
import { sequelize }  from '../../config/db';

const Service = sequelize.define("Service", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    serviceName: {
        type: DataTypes.STRING
    },
    serviceDescription: {
        type: DataTypes.TEXT
    },
    img: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER
    },
    category: {
        type: DataTypes.STRING // for men or women
    },
    bookingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    serviceType: {
        type: DataTypes.STRING
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Service;
