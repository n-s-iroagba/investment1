import { AdminWallet } from '../models/AdminWallet';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';


export class AdminWalletService {
  // Create a new AdminWallet
  static async createAdminWallet(data:{address: string, currency: string}) {
    try {
      if (!data.address || !data.currency ) {
        throw new CustomError(400, 'All fields (address, currency, adminId) are required');
      }

      const wallet = await AdminWallet.create(data);
      logger.info(`Created AdminWallet`);
      return wallet;
    } catch (error) {
      logger.error(`Failed to create AdminWallet: ${error}`);
      throw error;
    }
  }

  // Get a wallet by ID
  static async getAdminWalletById(id: number) {
    try {
      const wallet = await AdminWallet.findByPk(id);
      if (!wallet) {
        throw new CustomError(404, 'AdminWallet not found');
      }

      return wallet;
    } catch (error) {
      logger.error(`Failed to retrieve AdminWallet: ${error}`);
      throw error;
    }
  }
  static async getAllAdminWallet(){
    try {
      const wallets = await AdminWallet.findAll();
      return wallets;
    }catch(error){
      throw error;
    }
  }

  // Update an existing wallet
  static async updateAdminWallet(id: number, updates: Partial<{ address: string; currency: string }>) {
    try {
      const wallet = await AdminWallet.findByPk(id);
      if (!wallet) {
        throw new CustomError(404, 'AdminWallet not found');
      }

      if (updates.address) wallet.address = updates.address;
      if (updates.currency) wallet.currency = updates.currency;

      await wallet.save();
      logger.info(`Updated AdminWallet with id ${id}`);
      return wallet;
    } catch (error) {
      logger.error(`Failed to update AdminWallet: ${error}`);
      throw error;
    }
  }

  // Delete a wallet
  static async deleteAdminWallet(id: number) {
    try {
      const wallet = await AdminWallet.findByPk(id);
      if (!wallet) {
        throw new CustomError(404, 'AdminWallet not found');
      }

      await wallet.destroy();
       logger.info(`Deleted AdminWallet with id ${id}`);
      return wallet
     
    } catch (error) {
      logger.error(`Failed to delete AdminWallet: ${error}`);
      throw error;
    }
  }
}
