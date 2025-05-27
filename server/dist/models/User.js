import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database'; // adjust path as necessary
class User extends Model {
}
User.init({
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
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});
export default User;
