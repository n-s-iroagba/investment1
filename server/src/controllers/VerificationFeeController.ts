import { Request, Response } from 'express';
import { VerificationFeeService } from '../services/VerificationFeeService.js';
import { CustomError } from '../utils/error/CustomError.js';
import { errorHandler } from '../utils/error/errorHandler.js';
import VerificationFee from '../models/VerificationFee.js';
import { Op } from 'sequelize';
import Payment from '../models/Payment.js';

export class VerificationFeeController {
  static async create(req: Request, res: Response) {
    const investorId = req.params.investorId
    try {
      const { amount, investorId,name,  } = req.body;
      const fee = await VerificationFeeService.createVerificationFee({ amount, investorId,name,  } );
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

      const updated = await VerificationFeeService.uploadProofOfPayment(Number(id), req.body);
      res.status(200).json(updated);
    } catch (error) {
      errorHandler(error,req,res)
    }
  }
  static async getUnpaidVerificationFees(req: Request, res: Response) {
    try {
      const investorId = req.params.investorId;

      const unpaidFees = await VerificationFee.findAll({
        where: {
          investorId,
          isPaid: false
        },
        order: [['createdAt', 'DESC']]
      });

    

      res.status(200).json(unpaidFees);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unpaid verification fees',
        error: error.message
      });
    }
  }

  static async getAllUnpaidVerificationFees(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query as any;

      const where: any = {
        status: 'unpaid',
        isActive: true
      };

      if (search) {
        where[Op.or] = [
          { verificationType: { [Op.like]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;

      const { rows: unpaidFees, count: totalCount } = await VerificationFee.findAndCountAll();



      res.status(200).json(unpaidFees);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unpaid verification fees',
        error: error.message
      });
    }
  }

  static async payVerificationFee(req: Request, res: Response) {
    try {
      const { verificationFeeId, amount, paymentMethod = 'card', paymentReference } = req.body;
      const investorId = Number(req.params.id);

      if (!verificationFeeId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Verification fee ID and amount are required'
        });
      }

      const verificationFee = await VerificationFee.findByPk(verificationFeeId);

      if (!verificationFee) {
        return res.status(404).json({
          success: false,
          message: 'Verification fee not found'
        });
      }

      if (verificationFee.investorId !== investorId) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to pay this fee'
        });
      }

   

  

      await verificationFee.update({
        isPaid:true,
       
      });

          const payment = await Payment.create({
    
      });

      res.status(200).json({
        success: true,
        message: 'Verification fee paid successfully',
        data: {
          verificationFee,
          payment
        }
      });
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: 'Payment processing failed',
        error: error.message
      });
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
