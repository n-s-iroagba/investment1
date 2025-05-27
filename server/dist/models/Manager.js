import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database';
export class Manager extends Model {
}
Manager.init({
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
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minimumInvestmentAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    percentageYield: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    qualification: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Manager',
    tableName: 'managers',
    timestamps: true,
});
export default Manager;
