import { Request, Response } from 'express';
import { TradingAssetService } from '../services/TradingAssetService';
import { CustomError } from '../utils/error/CustomError';
import { errorHandler } from '../utils/error/errorHandler';

class TradingAssetController {
  static async create(req: Request, res: Response) {
    try {
      const { name, type } = req.body;
      const newAsset = await TradingAssetService.createTradingAsset({ name, type });
      res.status(201).json(newAsset);
    } catch (error) {
    
     errorHandler(error,req,res)
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const assets = await TradingAssetService.getAllTradingAssets();
      res.status(200).json(assets);
    } catch (error) {
     errorHandler(error,req,res)
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type } = req.body;
      const updatedAsset = await TradingAssetService.updateTradingAsset(Number(id), { name, type });
      res.status(200).json(updatedAsset);
    } catch (error) {
    
     errorHandler(error,req,res)
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await TradingAssetService.deleteTradingAsset(Number(id));
      res.status(204).send();
    } catch (error) {
    
     errorHandler(error,req,res)
    }
  }
}

export default TradingAssetController;
