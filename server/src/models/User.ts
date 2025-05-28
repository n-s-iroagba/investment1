import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js'; // adjust path as necessary

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: 'ADMIN'|'INVESTOR'
  isEmailVerified:boolean;
  emailVerificationCode?: string | null;
  emailVerificationToken?: string | null;
  passwordResetToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a user
type UserCreationAttributes = Optional<UserAttributes, 'id' | 'emailVerificationCode' | 'emailVerificationToken' | 'passwordResetToken'|'isEmailVerified'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
public role!: 'ADMIN'|'INVESTOR'
public  isEmailVerified!:boolean;
  public emailVerificationCode!: string | null;
  public emailVerificationToken!: string | null;
  public passwordResetToken!: string | null;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailVerificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'INVESTOR')
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
