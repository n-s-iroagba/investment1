import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  DataTypes,
} from 'sequelize';
import sequelize from '../config/database.js';
import { Investor } from './Investor.js';

export class Referral extends Model<
  InferAttributes<Referral>,
  InferCreationAttributes<Referral>
> {
  declare id: CreationOptional<number>;
  declare amount: CreationOptional<number>;;
  declare referrerId: number;
  declare referredId: number;
  declare settled: boolean;

  declare referrer: NonAttribute<Investor>;
  declare referred: NonAttribute<Investor>;
}

Referral.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    referrerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referredId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    settled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false
    },
  },
  {
    sequelize,
    modelName: 'Referral',
    tableName: 'referrals',
    timestamps: true,
  }
);

// Associations
// Investor.hasMany(Referral, {
//   foreignKey: 'referrerId',
//   as: 'referralsGiven',
// });


// Referral.belongsTo(Investor, {
//   foreignKey: 'referrerId',
//   as: 'referrer',
// });



export default Referral;
