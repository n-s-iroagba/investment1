import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database';
import Investor from './Investor';
export class VerificationFee extends Model {
}
VerificationFee.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    investorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'VerificationFee',
    tableName: 'verification_fees',
    timestamps: true,
});
// Associations
VerificationFee.belongsTo(Investor, {
    foreignKey: 'investorId',
    as: 'investor',
});
Investor.hasMany(VerificationFee, {
    foreignKey: 'investorId',
    as: 'verificationFees',
});
export default VerificationFee;
