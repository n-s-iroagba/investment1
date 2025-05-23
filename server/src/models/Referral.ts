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
import { Investor } from './Investor';

export class Referral extends Model<
  InferAttributes<Referral>,
  InferCreationAttributes<Referral>
> {
  declare id: CreationOptional<number>;
  declare amount: CreationOptional<number>;;
  declare referrerId: ForeignKey<Investor['id']>;
  declare referredId: ForeignKey<Investor['id']>;
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
Investor.hasMany(Referral, {
  foreignKey: 'referrerId',
  as: 'referralsGiven',
});

Investor.hasMany(Referral, {
  foreignKey: 'referredId',
  as: 'referralsReceived',
});

Referral.belongsTo(Investor, {
  foreignKey: 'referrerId',
  as: 'referrer',
});

Referral.belongsTo(Investor, {
  foreignKey: 'referredId',
  as: 'referred',
});

export default Referral;
