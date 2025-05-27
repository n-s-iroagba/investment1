import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
export class Notification extends Model {
}
Notification.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
});
// Association
User.hasMany(Notification, {
    foreignKey: 'userId',
    as: 'notifications',
});
Notification.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});
export default Notification;
