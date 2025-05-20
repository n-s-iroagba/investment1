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
import Trade from './Trade';

export class InvestorPortfolio extends Model<
  InferAttributes<InvestorPortfolio>,
  InferCreationAttributes<InvestorPortfolio>
> {
  declare id: CreationOptional<number>;
  declare investorId: ForeignKey<Investor['id']>;

  declare investor?: NonAttribute<Investor>;
  declare trades?: NonAttribute<Trade[]>;
}

InvestorPortfolio.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    investorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'InvestorPortfolio',
    tableName: 'investor_portfolios',
    timestamps: true,
  }
);

// Associations
InvestorPortfolio.belongsTo(Investor, {
  foreignKey: 'investorId',
  as: 'investor',
});



export default InvestorPortfolio;
