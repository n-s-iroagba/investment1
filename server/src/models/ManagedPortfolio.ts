import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
} from 'sequelize';
import sequelize from '../config/database.js';
import Investor from './Investor.js';
import Manager from './Manager.js';
import CryptoWallet from './CryptoWallet.js';
import Payment from './Payment.js';

export class ManagedPortfolio extends Model<
  InferAttributes<ManagedPortfolio>,
  InferCreationAttributes<ManagedPortfolio>
> {
  declare id: CreationOptional<number>;
  declare amount: number;
  declare earnings?: number;
  declare amountDeposited?: number;
  declare lastDepositDate?: Date | null;
  declare paymentStatus?: 'COMPLETE_PAYMENT' | 'INCOMPLETE_PAYMENT' | 'NOT_PAID';

  // Foreign keys
  declare investorId: ForeignKey<Investor['id']>;
  declare managerId: ForeignKey<Manager['id']>;

  // Associations
  declare investor?: NonAttribute<Investor>;
  declare manager?: NonAttribute<Manager>;
  declare cryptoWallet?: NonAttribute<CryptoWallet>;
  declare payments?: NonAttribute<Payment[]>;

  // Mixins
  declare getInvestor: BelongsToGetAssociationMixin<Investor>;
  declare setInvestor: BelongsToSetAssociationMixin<Investor, number>;
  
  declare getManager: BelongsToGetAssociationMixin<Manager>;
  declare setManager: BelongsToSetAssociationMixin<Manager, number>;
  
  declare getCryptoWallet: HasOneGetAssociationMixin<CryptoWallet>;
  declare setCryptoWallet: HasOneSetAssociationMixin<CryptoWallet, number>;
  
  declare getPayments: HasManyGetAssociationsMixin<Payment>;
  declare setPayments: HasManySetAssociationsMixin<Payment, number>;
}

ManagedPortfolio.init(
  {
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
  },
  {
    sequelize,
    modelName: 'ManagedPortfolio',
    tableName: 'managed_portfolios',
    timestamps: true,
  }
);

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
