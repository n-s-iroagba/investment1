import { Request, Response } from 'express';
import { CryptoWalletService } from '../services/CryptoWalletService';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';
import { errorHandler } from '../utils/error/errorHandler';

class CryptoWalletController {
  // Create a new CryptoWallet
  static async create(req: Request, res: Response) {
    try {
      const { TradingAsset, address, accountId } = req.body;

      const wallet = await CryptoWalletService.createCryptoWallet(TradingAsset, address, accountId);
      res.status(201).json(wallet);
    } catch (error) {
        errorHandler(error,req, res)
     
    }
  }

  // Retrieve a CryptoWallet by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const wallet = await CryptoWalletService.getCryptoWalletById(Number(id));
      res.status(200).json(wallet);
    } catch (error) {
        errorHandler(error,req, res)
      
    }
  }

  // Update a CryptoWallet
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedWallet = await CryptoWalletService.updateCryptoWallet(Number(id), updates);
      res.status(200).json(updatedWallet);
    } catch (error) {
        errorHandler(error,req, res)
      
    }
  }
}

export default CryptoWalletController;
