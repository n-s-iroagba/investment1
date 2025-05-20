import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  DataTypes,
} from 'sequelize';
import sequelize from '../config/database';
import Trade from './Trade';
import TradingAsset from './TradingAsset';

export class TradeOption extends Model<
  InferAttributes<TradeOption>,
  InferCreationAttributes<TradeOption>
> {
  declare id: CreationOptional<number>;
  declare TradingAsset: string;
  declare direction: 'buy' | 'sell';
  declare percentageReturn: number;
  declare durationInDays: number;
  declare tradeId: ForeignKey<Trade['id']>;
  declare TradingAssetId: ForeignKey<TradingAsset['id']>
}

TradeOption.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    TradingAsset: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM('buy', 'sell'),
      allowNull: false,
    },
    percentageReturn: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    durationInDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tradeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TradeOption',
    tableName: 'trade_options',
    timestamps: true,
  }
);

// Associations
TradeOption.belongsTo(Trade, {
  foreignKey: 'tradeId',
  as: 'trade',
});



// Inside TradingAsset class after init
TradingAsset.hasMany(TradeOption, {
  foreignKey: 'TradingAssetId',
  as: 'tradeOptions',
});


export default TradeOption;
