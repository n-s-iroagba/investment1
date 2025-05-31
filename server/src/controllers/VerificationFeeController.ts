import { Request, Response } from 'express';
import { VerificationFeeService } from '../services/VerificationFeeService.js';
import { CustomError } from '../utils/error/CustomError.js';
import { errorHandler } from '../utils/error/errorHandler.js';
import VerificationFee from '../models/VerificationFee.js';
import { Op } from 'sequelize';
import Payment from '../models/Payment.js';
import Investor from '../models/Investor.js';
export interface VerificationFeeItem {
  id: number;
  name: string;
  amount: number;
  isPaid: boolean;
  investorId: number;
  investorName: string;
  createdAt: Date;
  updatedAt: Date;
}
export class VerificationFeeController {
  static async create(req: Request, res: Response) {
    const investorId = Number(req.params.investorId)
    try {
      const { amount,name,  } = req.body;
      const fee = await VerificationFeeService.createVerificationFee({ amount, investorId,name,  } );
      res.status(201).json(fee);
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
       errorHandler(error,req,res)
    }
  }

// Updated backend method with proper pagination and investor name inclusion
static async getAllVerificationFees(req: Request, res: Response) {
  try {
    const unpaidFees = await VerificationFee.findAll({
      where: {
        isPaid: false
      },
      include: [
        {
          model: Investor,
          as: 'investor',
          attributes: ['id', 'firstName', 'lastName'],
          required: true
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Transform the data to include investor full name
    const transformedFees: VerificationFeeItem[] = unpaidFees.map(fee => ({
      id: fee.id,
      name: fee.name,
      amount: fee.amount,
      isPaid: fee.isPaid,
      investorId: fee.investorId,
      investorName: fee.investor ? `${fee.investor.firstName} ${fee.investor.lastName}` : 'Unknown',
      createdAt: fee.createdAt,
      updatedAt: fee.updatedAt
    }));
    
    res.status(200).json(transformedFees);
  } catch (error: any) {
    errorHandler(error, req, res);
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
