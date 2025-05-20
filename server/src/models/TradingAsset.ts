import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from 'sequelize';
import sequelize from '../config/database';

export class TradingAsset extends Model<
  InferAttributes<TradingAsset>,
  InferCreationAttributes<TradingAsset>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare type : string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TradingAsset.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: '',
    updatedAt: '',
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      
    }
  },
  {
    sequelize,
    modelName: 'TradingAsset',
    tableName: 'TradingAssets',
    timestamps: true,
  }
);

export default TradingAsset;
