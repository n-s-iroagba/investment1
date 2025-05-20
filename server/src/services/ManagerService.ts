import Manager from '../models/Manager';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';


interface ManagerInput {
  lastName: string;
  firstName: string;
  image: string;
  minimumInvestmentAmount: number;
  percentageYield: number;
  duration: number;
  qualification: string;
}

export class ManagerService {
  // Create a new manager - all fields required
  static async createManager(data: ManagerInput) {
    try {
      const manager = await Manager.create(data);
      logger.info(`Created Manager id=${manager.id}`);
      return manager;
    } catch (error) {
      logger.error(`Failed to create Manager: ${error}`);
      throw error;
    }
  }

  // Get manager by id
  static async getManagerById(id: number) {
    const manager = await Manager.findByPk(id);
    if (!manager) {
      throw new CustomError(404, `Manager with id ${id} not found`);
    }
    return manager;
  }

  // Get all managers (optionally add pagination/filter later)
  static async getAllManagers() {
    return Manager.findAll();
  }

  // Update manager by id - all fields required to update
  static async updateManager(id: number, data: ManagerInput) {
    const manager = await Manager.findByPk(id);
    if (!manager) {
      throw new CustomError(404, `Manager with id ${id} not found`);
    }

    try {
      manager.lastName = data.lastName;
      manager.firstName = data.firstName;
      manager.image = data.image;
      manager.minimumInvestmentAmount = data.minimumInvestmentAmount;
      manager.percentageYield = data.percentageYield;
      manager.duration = data.duration;
      manager.qualification = data.qualification;

      await manager.save();

      logger.info(`Updated Manager id=${id}`);
      return manager;
    } catch (error) {
      logger.error(`Failed to update Manager: ${error}`);
      throw error;
    }
  }

  // Delete manager by id
  static async deleteManager(id: number) {
    const manager = await Manager.findByPk(id);
    if (!manager) {
      throw new CustomError(404, `Manager with id ${id} not found`);
    }
    try {
      await manager.destroy();
      logger.info(`Deleted Manager id=${id}`);
      return { message: `Manager with id ${id} deleted successfully` };
    } catch (error) {
      logger.error(`Failed to delete Manager: ${error}`);
      throw error;
    }
  }
}
