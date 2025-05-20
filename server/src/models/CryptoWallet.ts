import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  DataTypes,
} from 'sequelize';
import sequelize from '../config/database';
import ManagedPortfolio from './ManagedPortfolio';


 class CryptoWallet extends Model<
  InferAttributes<CryptoWallet>,
  InferCreationAttributes<CryptoWallet>
> {
  declare id: CreationOptional<number>;
  declare currency: string;
  declare address: string;
  declare depositAddress:string

  // Foreign key to ManagedPortfolio.
  declare managedPortfolioId: ForeignKey<ManagedPortfolio['id']>;
  declare managedPortfolio?: NonAttribute<ManagedPortfolio>;
}

CryptoWallet.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    depositAddress: {
      type: DataTypes.STRING,
      allowNull:false,
    }
  },
  {
    sequelize,
    modelName: 'CryptoWallet',
    tableName: 'crypto_wallets',
    timestamps: true,
  }
);

// One-to-one association
ManagedPortfolio.hasOne(CryptoWallet, {
  foreignKey: 'managedPortfolioId',
  as: 'cryptoWallet',
});
CryptoWallet.belongsTo(ManagedPortfolio, {
  foreignKey: 'managedPortfolioId',
  as: 'account',
});
export default CryptoWallet