import { Request, Response } from 'express';
import { AdminWalletService } from '../services/AdminWalletService.js';
import { errorHandler } from '../utils/error/errorHandler.js';
import { CustomError } from '../utils/error/CustomError.js';


class AdminWalletController {
  static async createAdminWallet(req: Request, res: Response) {
    try {
      const walletData = req.body;
      const newWallet = await AdminWalletService.createAdminWallet(walletData);
      res.status(201).json(newWallet);
    } catch (error: any) {
      errorHandler(error, req, res)
    }
  }

  static async getAllAdminWallets(req: Request, res: Response) {
    try {
      const wallets = await AdminWalletService.getAllAdminWallet();
      res.status(200).json(wallets);
    } catch (error: any) {
      errorHandler(error, req, res)
    }
  }

  static async getAdminWalletById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const wallet = await AdminWalletService.getAdminWalletById(Number(id));
      if (!wallet) {
        throw new CustomError(404,'admin wallet not found')
      }
      res.status(200).json(wallet);
    } catch (error: any) {
      errorHandler(error, req, res)
    }
  }

  static async updateAdminWallet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedWallet = await AdminWalletService.updateAdminWallet(Number(id), updatedData);
      if (!updatedWallet) {
        throw new CustomError(404,'admin wallet not found')
      }
      res.status(200).json(updatedWallet);
    } catch (error: any) {
      errorHandler(error, req, res)
    }
  }

  static async deleteAdminWallet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await AdminWalletService.deleteAdminWallet(Number(id));
      if (!deleted) {
        throw new CustomError(404,'admin wallet not found')
      }
      res.status(204).send();
    } catch (error: any) {
      errorHandler(error, req, res)
    }
  }
}

export default AdminWalletController;
