import {
  DataTypes,
  Model,
  Optional,
  Association,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  ForeignKey,
} from 'sequelize';
import sequelize from '../config/database';
import CryptoWallet from './CryptoWallet';
import FiatAccount from './FiatAccount';
import Investor from './Investor';

interface AccountAttributes {
  id: number;
  balanceInUSD: number;
  investorId: ForeignKey<Investor['id']>;
  createdAt?: Date;
  updatedAt?: Date;
}

type AccountCreationAttributes = Optional<AccountAttributes, 'id'>;

class Account
  extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes
{
  declare id: number;
  declare balanceInUSD: number;
  declare investorId: ForeignKey<Investor['id']>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // ✅ Mixins for CryptoWallet and FiatAccount
  declare getCryptoWallet: HasOneGetAssociationMixin<CryptoWallet>;
  declare setCryptoWallet: HasOneSetAssociationMixin<CryptoWallet, number>;
  declare cryptoWallet?: CryptoWallet;

  declare getFiatAccount: HasOneGetAssociationMixin<FiatAccount>;
  declare setFiatAccount: HasOneSetAssociationMixin<FiatAccount, number>;
  declare fiatAccount?: FiatAccount;

  // ✅ Mixins for Investor
  declare getInvestor: BelongsToGetAssociationMixin<Investor>;
  declare setInvestor: BelongsToSetAssociationMixin<Investor, number>;
  declare investor?: Investor;

  declare static associations: {
    cryptoWallet: Association<Account, CryptoWallet>;
    fiatAccount: Association<Account, FiatAccount>;
    investor: Association<Account, Investor>;
  };
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    balanceInUSD: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    investorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: true,
  }
);


// ✅ One-to-One: Investor → Account
Investor.hasOne(Account, {
  foreignKey: 'investorId',
  as: 'account',
});
Account.belongsTo(Investor, {
  foreignKey: 'investorId',
  as: 'investor',
});

export default Account;
