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
import User from './User';
import Admin from './Admin';
import Kyc from './Kyc';
import ManagedPortfolio from './ManagedPortfolio';
import Referral from './Referral';

export class Investor extends Model<
  InferAttributes<Investor>,
  InferCreationAttributes<Investor>
> {
  declare id: CreationOptional<number>;

  declare lastName: string;
  declare firstName: string;
  declare dateOfBirth: Date;
  declare gender: string;
  declare countryOfResidence: string;

  declare referralCode: number | null;
  declare referrerId: number | null;

  // Foreign keys
  declare userId: ForeignKey<User['id']>;


  // Associations (non-DB attributes)
  declare user?: NonAttribute<User>;
  declare admin?: NonAttribute<Admin>;
  declare kyc?: NonAttribute<Kyc>;
  declare managedPortfolio?: NonAttribute<ManagedPortfolio>;

  declare referrals?: NonAttribute<Referral[]>;
}

Investor.init(
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
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryOfResidence: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referralCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    referrerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Investor',
    tableName: 'investors',
    timestamps: true,
  }
);



export default Investor;
