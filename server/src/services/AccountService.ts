import Account from '../models/Account'; // Adjust path as needed
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';


export class AccountService {
  // Method to create an account with zero balance
  static async createAccount(investorId: number) {
    try {
      if (!investorId) {
        throw new CustomError(400, 'Investor ID is required to create an account');
      }

      const newAccount = await Account.create({
        investorId,
        balanceInUSD: 0,
      });

      logger.info(`Account created for investorId ${investorId} with balance 0`);
      return newAccount;
    } catch (error) {
      logger.error(`Failed to create account: ${error}`);
      throw error;
    }
  }

  // Method to update the balance of an account
  static async updateBalance(accountId: number, newBalance: number) {
    try {
      const account = await Account.findByPk(accountId);
      if (!account) {
        throw new CustomError(404, 'Account not found');
      }

      account.balanceInUSD = newBalance;
      await account.save();

      logger.info(`Account ${accountId} balance updated to ${newBalance}`);
      return account;
    } catch (error) {
      logger.error(`Failed to update account balance: ${error}`);
      throw error;
    }
  }
}
