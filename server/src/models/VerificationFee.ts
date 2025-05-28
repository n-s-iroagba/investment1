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
import Investor from './Investor.js';
import Admin from './Admin.js';
import Payment from './Payment.js';

export class VerificationFee extends Model<
  InferAttributes<VerificationFee>,
  InferCreationAttributes<VerificationFee>
> {
  declare id: CreationOptional<number>;
  declare name:string
  declare amount: number;
  declare isPaid?: boolean;
  declare investorId: ForeignKey<Investor['id']>;
  // Associations (non-DB attributes)
  declare investor?: NonAttribute<Investor>;
  declare payments?: NonAttribute<Payment[]>


  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

VerificationFee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    investorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
  {
    sequelize,
    modelName: 'VerificationFee',
    tableName: 'verification_fees',
    timestamps: true,
  }
);

// Associations

VerificationFee.belongsTo(Investor, {
  foreignKey: 'investorId',
  as: 'investor',
});

Investor.hasMany(VerificationFee, {
  foreignKey: 'investorId',
  as: 'verificationFees',
});

export default VerificationFee;
