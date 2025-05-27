import { Model, DataTypes, } from "sequelize";
import sequelize from "../config/database";
export class AdminWallet extends Model {
}
AdminWallet.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "AdminWallet",
    tableName: "admin_wallets",
    timestamps: true,
});
