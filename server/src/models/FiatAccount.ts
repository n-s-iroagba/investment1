import { DataTypes, ForeignKey, Model, NonAttribute, Optional } from 'sequelize';
import sequelize from '../config/database';
import Account from './Account';

interface FiatAccountAttributes {
  id: number;
 identification:string
  accountId:ForeignKey<Account['id']>;
  account?:NonAttribute<Account>
  platform: string;

}

type FiatAccountCreationAttributes = Optional<FiatAccountAttributes, 'id'>;

class FiatAccount extends Model<FiatAccountAttributes, FiatAccountCreationAttributes>
  implements FiatAccountAttributes {
  public id!: number;
  public accountId!: ForeignKey<Account['id']>;
  public platform!: string;
  public identification!:string
  public account?:NonAttribute<Account>
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FiatAccount.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identification: {
      type:DataTypes.STRING,
      allowNull:false
    }
  },
  {
    sequelize,
    modelName: 'FiatAccount',
    tableName: 'fiat_accounts',
    timestamps: true,
  }
);

Account.hasOne(FiatAccount, {
  foreignKey: 'accountId',
  as: 'fiatAccount',
});
FiatAccount.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account',
});

export default FiatAccount;
