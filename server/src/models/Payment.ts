// models/Payment.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; // adjust to your actual sequelize instance
import ManagedPortfolio from './ManagedPortfolio';
import VerificationFee from './VerificationFee';

// 1. Define attributes
export interface PaymentAttributes {
  id: number;
  date: Date;
  receipt: string;
  depositType: string;
   paymentType:'FEE'|'INVESTMENT';
  amount: number;
  paymentID:string;
  isVerified?:boolean  
}

// 2. Define creation attributes (id is auto-generated)
export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

// 3. Define the model class
export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes {
  public id!: number;
  public date!: Date;
  public receipt!: string;
  public depositType!: string;
  public paymentType!:'FEE'|'INVESTMENT';
  public paymentID!:string;
  public amount!: number;
  public isVerified?:boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4. Initialize the model
Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    receipt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    depositType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.ENUM('FEE', 'INVESTMENT'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    paymentID: {
      type: DataTypes.STRING,
      allowNull: false,
      
    }
  },
  {
    sequelize,
    tableName: 'payments',
    modelName: 'Payment',
  }
);

export default Payment;

ManagedPortfolio.hasMany(Payment, {
  foreignKey: 'managedPortfolioId',
  as: 'payments',
});


VerificationFee.hasMany(Payment, {
  foreignKey: 'verificationFeeId',
  as: 'payments',
});