import { StringLiteralLike } from 'typescript';
import CryptoWallet from '../models/CryptoWallet';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';

export class CryptoWalletService {
  // Create a CryptoWallet
  static async createCryptoWallet(currency: string, address: string, depositAddress:string,managedPortfolioId: number) {
    try {
      if (!currency || !address || !managedPortfolioId) {
        throw new CustomError(400, 'currency, address, and managedPortfolioId are required');
      }

      const wallet = await CryptoWallet.create({ currency, address, depositAddress,managedPortfolioId });
      logger.info(`Created CryptoWallet for managedPortfolioId ${managedPortfolioId}`);
      return wallet;
    } catch (error) {
      logger.error(`Failed to create CryptoWallet: ${error}`);
      throw error;
    }
  }

  // Retrieve a CryptoWallet by ID
  static async getCryptoWalletById(id: number) {
    try {
      const wallet = await CryptoWallet.findByPk(id);
      if (!wallet) {
        throw new CustomError(404, 'CryptoWallet not found');
      }

      return wallet;
    } catch (error) {
      logger.error(`Failed to retrieve CryptoWallet: ${error}`);
      throw error;
    }
  }

  // Update a CryptoWallet
  static async updateCryptoWallet(id: number, updates: Partial<{ currency: string; address: string }>) {
    try {
      const wallet = await CryptoWallet.findByPk(id);
      if (!wallet) {
        throw new CustomError(404, 'CryptoWallet not found');
      }

      if (updates.currency) wallet.currency = updates.currency;
      if (updates.address) wallet.address = updates.address;

      await wallet.save();
      logger.info(`Updated CryptoWallet with id ${id}`);
      return wallet;
    } catch (error) {
      logger.error(`Failed to update CryptoWallet: ${error}`);
      throw error;
    }
  }
}
