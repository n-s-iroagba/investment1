import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database';
import Investor from './Investor';
import Manager from './Manager';
export class ManagedPortfolio extends Model {
}
ManagedPortfolio.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    earnings: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    amountDeposited: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    lastDepositDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    paymentStatus: {
        type: DataTypes.ENUM('COMPLETE_PAYMENT', 'INCOMPLETE_PAYMENT', 'NOT_PAID'),
        allowNull: true
    },
    investorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    managerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'ManagedPortfolio',
    tableName: 'managed_portfolios',
    timestamps: true,
});
// Associations
ManagedPortfolio.belongsTo(Investor, {
    foreignKey: 'investorId',
    as: 'investor',
});
ManagedPortfolio.belongsTo(Manager, {
    foreignKey: 'managerId',
    as: 'manager',
});
Manager.hasMany(ManagedPortfolio, {
    foreignKey: 'managerId',
    as: 'managedPortfolios',
});
Investor.hasMany(ManagedPortfolio, {
    foreignKey: 'investorId',
    as: 'managedPortfolios',
});
export default ManagedPortfolio;
