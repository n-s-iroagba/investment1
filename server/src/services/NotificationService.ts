import Notification from '../models/Notification.js';
import logger from '../utils/logger/logger.js';


interface NotificationInput {
  type: string;
  message: string;
  userId: number;
}

export class NotificationService {
  // Create a notification - all fields required
  static async createNotification(data: NotificationInput) {
    try {
      const notification = await Notification.create(data);
      logger?.info(`Created Notification id=${notification.id}`);
      return notification;
    } catch (error) {
      logger?.error(`Failed to create Notification: ${error}`);
      throw error;
    }
  }

  
}
