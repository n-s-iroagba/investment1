import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database.js';
export class Investor extends Model {
}
Investor.init({
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
}, {
    sequelize,
    modelName: 'Investor',
    tableName: 'investors',
    timestamps: true,
});
export default Investor;
