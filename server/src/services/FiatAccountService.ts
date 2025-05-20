import FiatAccount from '../models/FiatAccount';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';


export class FiatAccountService {
  // Create a FiatAccount
  static async createFiatAccount(data:{accountId: number, platform: string,identification:string}) {
    const { accountId, platform,identification } =data
    try {
      if (!accountId || !platform) {
        throw new CustomError(400, 'accountId and platform are required');
      }

      const fiatAccount = await FiatAccount.create(data);
      logger.info(`Created FiatAccount for accountId ${accountId}`);
      return fiatAccount;
    } catch (error) {
      logger.error(`Failed to create FiatAccount: ${error}`);
      throw error;
    }
  }

  // Read a FiatAccount by ID
  static async getFiatAccountById(id: number) {
    try {
      const fiatAccount = await FiatAccount.findByPk(id);
      if (!fiatAccount) {
        throw new CustomError(404, 'FiatAccount not found');
      }
      return fiatAccount;
    } catch (error) {
      logger.error(`Failed to retrieve FiatAccount: ${error}`);
      throw error;
    }
  }

  // Update a FiatAccount
  static async updateFiatAccount(id: number, updates: Partial<{ platform: string }>) {
    try {
      const fiatAccount = await FiatAccount.findByPk(id);
      if (!fiatAccount) {
        throw new CustomError(404, 'FiatAccount not found');
      }

      if (updates.platform) {
        fiatAccount.platform = updates.platform;
      }

      await fiatAccount.save();
      logger.info(`Updated FiatAccount with id ${id}`);
      return fiatAccount;
    } catch (error) {
      logger.error(`Failed to update FiatAccount: ${error}`);
      throw error;
    }
  }
}
