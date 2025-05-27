import Notification from '../models/Notification';
import logger from '../utils/logger/logger';
export class NotificationService {
    // Create a notification - all fields required
    static async createNotification(data) {
        try {
            const notification = await Notification.create(data);
            logger?.info(`Created Notification id=${notification.id}`);
            return notification;
        }
        catch (error) {
            logger?.error(`Failed to create Notification: ${error}`);
            throw error;
        }
    }
}
