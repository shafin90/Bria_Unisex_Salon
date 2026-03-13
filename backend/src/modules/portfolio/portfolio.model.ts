import { DataTypes }  from 'sequelize';
import { sequelize }  from '../../config/db';

const Portfolio = sequelize.define("Portfolio", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    beforeImg: {
        type: DataTypes.STRING
    },
    afterImg: {
        type: DataTypes.STRING,
        allowNull: false
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

export default Portfolio;
