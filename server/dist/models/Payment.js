// models/Payment.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js'; // adjust to your actual sequelize instance
import ManagedPortfolio from './ManagedPortfolio.js';
import VerificationFee from './VerificationFee.js';
// 3. Define the model class
export class Payment extends Model {
}
// 4. Initialize the model
Payment.init({
    id: {
        type: DataTypes.INTEGER,
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
}, {
    sequelize,
    tableName: 'payments',
    modelName: 'Payment',
});
export default Payment;
ManagedPortfolio.hasMany(Payment, {
    foreignKey: 'managedPortfolioId',
    as: 'payments',
});
VerificationFee.hasMany(Payment, {
    foreignKey: 'verificationFeeId',
    as: 'payments',
});
