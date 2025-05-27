import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database.js';
import { Investor } from './Investor.js';
export class Referral extends Model {
    ;
}
Referral.init({
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
        defaultValue: false
    },
}, {
    sequelize,
    modelName: 'Referral',
    tableName: 'referrals',
    timestamps: true,
});
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
