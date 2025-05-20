import { Request, Response } from 'express';
import { errorHandler } from '../utils/error/errorHandler';
import { FiatAccountService } from '../services/FiatAccountService';

class FiatAccountController {
  // Create FiatAccount
  static async create(req: Request, res: Response) {
    try {
      const { accountId, platform, identification } = req.body;

      const fiatAccount = await FiatAccountService.createFiatAccount({
        accountId,
        platform,
        identification,
      });

      res.status(201).json(fiatAccount);
    } catch (error) {
      errorHandler(error,req,res)
    }
  }

  // Get FiatAccount by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const fiatAccount = await FiatAccountService.getFiatAccountById(Number(id));
      res.status(200).json(fiatAccount);
    } catch (error) {
      errorHandler(error,req,res)
      
    }
  }

  // Update FiatAccount
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedAccount = await FiatAccountService.updateFiatAccount(Number(id), updates);
      res.status(200).json(updatedAccount);
    } catch (error) {
      errorHandler(error,req,res)
  
    }
  }
}

export default FiatAccountController;
