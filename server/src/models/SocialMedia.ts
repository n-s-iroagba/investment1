import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  DataTypes,
} from 'sequelize';
import sequelize from '../config/database.js';
import Admin from './Admin.js';

export class SocialMedia extends Model<
  InferAttributes<SocialMedia>,
  InferCreationAttributes<SocialMedia>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare link: string;
  declare logo: Buffer;




  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SocialMedia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'SocialMedia',
    tableName: 'social_media',
    timestamps: true,
  }
);



export default SocialMedia;
