import Notification from '../models/Notification';
import logger from '../utils/logger/logger';


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
