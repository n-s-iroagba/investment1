import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  DataTypes,
} from "sequelize";
import sequelize from "../config/database";
import Admin from "./Admin";

export class AdminWallet extends Model<
  InferAttributes<AdminWallet>,
  InferCreationAttributes<AdminWallet>
> {
  declare id: CreationOptional<number>;
  declare address: string;
  declare currency: string;

}

AdminWallet.init(
  {
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
  
  },
  {
    sequelize,
    modelName: "AdminWallet",
    tableName: "admin_wallets",
    timestamps: true,
  }
);
