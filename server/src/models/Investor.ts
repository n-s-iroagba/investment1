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
import User from './User.js';
import Admin from './Admin.js';
import Kyc from './Kyc.js';
import ManagedPortfolio from './ManagedPortfolio.js';
import Referral from './Referral.js';

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
  declare referrer?: NonAttribute<Investor>;
  declare referredInvestors?: NonAttribute<Investor[]>;
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

// Define associations
Investor.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Investor,{
  foreignKey:'userId',
  as:'investors'
})




export default Investor;