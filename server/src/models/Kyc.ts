import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  DataTypes,
} from 'sequelize';
import sequelize from '../config/database';
import { Investor } from './Investor';

export class Kyc extends Model<
  InferAttributes<Kyc>,
  InferCreationAttributes<Kyc>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare image: string;
  declare  isVerified?: boolean
  declare number: string;

  declare investorId: ForeignKey<Investor['id']>;
  declare investor: NonAttribute<Investor>;
} 

Kyc.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isVerified: {
type:DataTypes.BOOLEAN,
defaultValue:false
    }
  },
  {
    sequelize,
    modelName: 'Kyc',
    tableName: 'kycs',
    timestamps: true,
  }
);

// Associations
Investor.hasOne(Kyc, {
  foreignKey: 'investorId',
  as: 'kyc',
});
Kyc.belongsTo(Investor, {
  foreignKey: 'investorId',
  as: 'investor',
});

export default Kyc;











