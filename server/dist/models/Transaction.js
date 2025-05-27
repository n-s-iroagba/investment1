import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database.js';
import { Investor } from './Investor.js'; // adjust the path as needed
export class Transaction extends Model {
}
Transaction.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    participatingAccount: {
        type: DataTypes.ENUM('Company', 'Investor'),
        allowNull: false,
    },
    narration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    receipt: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('Debit', 'Credit'),
        allowNull: false,
    },
    investorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,
});
// Association
Investor.hasMany(Transaction, {
    foreignKey: 'investorId',
    as: 'transactions',
});
Transaction.belongsTo(Investor, {
    foreignKey: 'investorId',
    as: 'investor',
});
export default Transaction;
