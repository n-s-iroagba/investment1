import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database.js';
import ManagedPortfolio from './ManagedPortfolio.js';
class CryptoWallet extends Model {
}
CryptoWallet.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    managedPortfolioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    depositAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'CryptoWallet',
    tableName: 'crypto_wallets',
    timestamps: true,
});
// One-to-one association
ManagedPortfolio.hasOne(CryptoWallet, {
    foreignKey: 'managedPortfolioId',
    as: 'cryptoWallet',
});
CryptoWallet.belongsTo(ManagedPortfolio, {
    foreignKey: 'managedPortfolioId',
    as: 'account',
});
export default CryptoWallet;
