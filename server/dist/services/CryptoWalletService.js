import CryptoWallet from '../models/CryptoWallet.js';
import { CustomError } from '../utils/error/CustomError.js';
import logger from '../utils/logger/logger.js';
export class CryptoWalletService {
    // Create a CryptoWallet
    static async createCryptoWallet(currency, address, depositAddress, managedPortfolioId) {
        try {
            if (!currency || !address || !managedPortfolioId) {
                throw new CustomError(400, 'currency, address, and managedPortfolioId are required');
            }
            const wallet = await CryptoWallet.create({ currency, address, depositAddress, managedPortfolioId });
            logger.info(`Created CryptoWallet for managedPortfolioId ${managedPortfolioId}`);
            return wallet;
        }
        catch (error) {
            logger.error(`Failed to create CryptoWallet: ${error}`);
            throw error;
        }
    }
}
