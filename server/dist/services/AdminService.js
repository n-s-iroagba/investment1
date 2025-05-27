import Admin from '../models/Admin.js';
import { CustomError } from '../utils/error/CustomError.js';
import logger from '../utils/logger/logger.js';
export class AdminService {
    // Method to create an admin
    static async createAdmin(username) {
        try {
            if (!username) {
                throw new CustomError(400, 'Username is required to create an admin');
            }
            const newAdmin = await Admin.create({ username });
            logger.info(`Admin created with username: ${username}`);
            return newAdmin;
        }
        catch (error) {
            logger.error(`Error creating admin: ${error}`);
            throw error;
        }
    }
    // Method to change an admin's username
    static async changeUsername(adminId, newUsername) {
        try {
            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                throw new CustomError(404, 'Admin not found');
            }
            admin.username = newUsername;
            await admin.save();
            logger.info(`Admin ${adminId} username changed to: ${newUsername}`);
            return admin;
        }
        catch (error) {
            logger.error(`Error changing admin username: ${error}`);
            throw error;
        }
    }
}
