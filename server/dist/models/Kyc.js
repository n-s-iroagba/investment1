import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database.js';
import { Investor } from './Investor.js';
export class Kyc extends Model {
}
Kyc.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    investorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Kyc',
    tableName: 'kycs',
    timestamps: true,
});
// Associations
Investor.hasOne(Kyc, {
    foreignKey: 'investorId',
    as: 'kyc',
});
Kyc.belongsTo(Investor, {
    foreignKey: 'investorId',
    as: 'investor',
});
export default Kyc;
