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
import Investor from './Investor';
import Manager from './Manager';

export class ManagedPortfolio extends Model<
  InferAttributes<ManagedPortfolio>,
  InferCreationAttributes<ManagedPortfolio>
> {
  declare id: CreationOptional<number>;
  declare amount: number;
  declare earnings?: number;
  declare amountDeposited?: number;
  declare lastDepositDate?: Date | null;
  declare paymentStatus?:'COMPLETE_PAYMENT'|'INCOMPLETE_PAYMENT'|'NOT PAID'

  declare investorId: ForeignKey<Investor['id']>;
  declare investor?: NonAttribute<Investor>;

  declare managerId: ForeignKey<Manager['id']>;
  declare manager?: NonAttribute<Manager | null>;
}

ManagedPortfolio.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    investorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    managerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('COMPLETE_PAYMENT', 'INCOMPLETE_PAYMENT', 'NOT_PAID'),
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


export default ManagedPortfolio;
