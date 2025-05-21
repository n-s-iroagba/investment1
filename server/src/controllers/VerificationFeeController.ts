import { Request, Response } from 'express';
import { VerificationFeeService } from '../services/VerificationFeeService';
import { CustomError } from '../utils/error/CustomError';
import { errorHandler } from '../utils/error/errorHandler';

export class VerificationFeeController {
  static async create(req: Request, res: Response) {
    try {
      const { amount, investorId } = req.body;
      const fee = await VerificationFeeService.createVerificationFee({ amount, investorId });
      res.status(201).json(fee);
    } catch (error) {
      errorHandler(error,req,res)
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fee = await VerificationFeeService.getVerificationFeeById(Number(id));
      res.status(200).json(fee);
    } catch (error) {
      errorHandler(error,req,res)
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await VerificationFeeService.updateVerificationFee(Number(id), updates);
      res.status(200).json(updated);
    } catch (error) {
      errorHandler(error,req,res)
    }
  }

  static async uploadProofOfPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!req.file || !req.file.path) {
        throw new CustomError(400,'proof of payment required')
      }

      const updated = await VerificationFeeService.uploadProofOfPayment(Number(id), req.file.path);
      res.status(200).json(updated);
    } catch (error) {
      errorHandler(error,req,res)
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const fees = await VerificationFeeService.getAllVerificationFees();
      res.status(200).json(fees);
    } catch (error) {
      errorHandler(error,req,res)
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await VerificationFeeService.deleteVerificationFee(Number(id));
      res.status(204).send();
    } catch (error) {
      errorHandler(error,req,res)
    }
  }
}