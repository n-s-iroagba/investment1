
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
import InvestorPortfolio from './InvestorPortfolio';
import TradeOption from './TradeOption';

export class Trade extends Model<
  InferAttributes<Trade>,
  InferCreationAttributes<Trade>
> {
  declare id: CreationOptional<number>;
  declare amountTraded: number;
  declare earnings?: number;
  declare investorPortfolioId: ForeignKey<InvestorPortfolio['id']>;
  declare tradeOptionId: ForeignKey<TradeOption['id']>;
  declare entryDate: Date;

  declare investorPortfolio?: NonAttribute<InvestorPortfolio>;
  declare tradeOption?: NonAttribute<TradeOption>;
}

Trade.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    amountTraded: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    earnings: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    investorPortfolioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    tradeOptionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    entryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Trade',
    tableName: 'trades',
    timestamps: true,
  }
);

// Associations
Trade.belongsTo(InvestorPortfolio, {
  foreignKey: 'investorPortfolioId',
  as: 'investorPortfolio',
});
InvestorPortfolio.hasMany(Trade, {
  foreignKey: 'investorPortfolioId',
  as: 'trades',
});

Trade.belongsTo(TradeOption, {
  foreignKey: 'tradeOptionId',
  as: 'tradeOption',
});
TradeOption.hasMany(Trade, {
  foreignKey: 'tradeOptionId',
  as: 'trade',
});

export default Trade;


