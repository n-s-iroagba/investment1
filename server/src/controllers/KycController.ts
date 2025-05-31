import { Request, Response } from 'express';
import { KycService } from '../services/KycService.js';
import { CustomError } from '../utils/error/CustomError.js';
import logger from '../utils/logger/logger.js';
import { errorHandler } from '../utils/error/errorHandler.js';
import Kyc from '../models/Kyc.js';

class KycController {
  static async create(req: Request, res: Response) {
  
    try {
      const investorId = Number(req.params.investorId)
      const { type, number } = req.body;
      const image = req.file?.path || ''; // assuming multer is used and path is stored as string

      const kyc = await KycService.createKyc({ type, image, number, investorId });
      res.status(201).json(kyc);
    } catch (error) {
        errorHandler(error, req, res)
    }
  }

static async getUnverified(req: Request, res: Response) {
  try{
    return await Kyc.findAll({where:{isVerified:false}})
   } catch (error) {
        errorHandler(error, req, res)
    }
}

  static async verify (req:Request,res:Response){
    try {
      const { id } = req.params;
      const kyc = await KycService.verifyKyc(Number(id));
      res.status(200).json(kyc);
      } catch (error) {
        errorHandler(error, req, res)
        }
  }


  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { type, number, investorId } = req.body;
      const image = req.file?.path || '';

      const updatedKyc = await KycService.updateKyc(Number(id), { type, image, number, investorId });
      res.status(200).json(updatedKyc);
    } catch (error) {
        errorHandler(error, req, res)
      
    }
  }
}

export default KycController;
