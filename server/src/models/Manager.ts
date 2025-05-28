import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  DataTypes,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import sequelize from '../config/database.js';
import ManagedPortfolio from './ManagedPortfolio.js';

export class Manager extends Model<
  InferAttributes<Manager>,
  InferCreationAttributes<Manager>
> {
  declare id: CreationOptional<number>;
  declare lastName: string;
  declare firstName: string;
  declare image: string;
  declare minimumInvestmentAmount: number;
  declare percentageYield: number;
  declare duration: number;
  declare qualification: string;

  declare managedPortfolios: NonAttribute<ManagedPortfolio[]>;

  // Optional: Association mixin (if needed)
  declare getManagedPortfolios: HasManyGetAssociationsMixin<ManagedPortfolio>;
}

Manager.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minimumInvestmentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    percentageYield: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Manager',
    tableName: 'managers',
    timestamps: true,
  }
);



export default Manager;
