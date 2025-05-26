import type { Request, Response } from "express"
import { PaymentService } from "../services/PaymentService"
import { CustomError, errorHandler } from "../utils/error/errorHandler"
import ManagedPortfolio from "../models/ManagedPortfolio"
import VerificationFee from "../models/VerificationFee"
import Payment from "../models/Payment"

export class PaymentController {
  static async getUnverifiedPayments(req:Request, res:Response){
    try {
      const payments = PaymentService.getUnverifiedPayments()
      res.json(payments)
    }catch(error){
   errorHandler(error, req, res)
    }
  }
  static async verifyPayment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const payment = await PaymentService.verifyPayment(Number(id))
      res.status(200).json(payment)
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

static async createPayment(req: Request, res: Response) {
  try {
    const id = req.params.entityId;
    const { type, amount, paymentID } = req.body;

    if (!req.file?.path) {
      throw new CustomError(400, 'No file in request');
    }

    let entity;

    if (type === 'INVESTMENT') {
      entity = await ManagedPortfolio.findByPk(id);
    } else if (type === 'FEE') {
      entity = await VerificationFee.findByPk(id);
    } else {
      throw new CustomError(400, 'Invalid payment type');
    }

    if (!entity) {
      throw new CustomError(404, `${type} with ID ${id} not found`);
    }

    const payment = await Payment.create({
      isVerified: false,
      date: new Date(),
      receipt: req.file.path,
      depositType: type === 'INVESTMENT' ? 'PORTFOLIO' : 'VERIFICATION',
      paymentType: type,
      amount: parseFloat(amount),
      paymentID
    });

    return res.status(201).json({
      message: 'Payment created successfully',
      data: payment
    });

  } catch (error: any) {
    return res.status(error.status || 500).json({
      message: error.message || 'Internal Server Error'
    });
  }
}

  static async unverifyPayment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const payment = await PaymentService.unverifyPayment(Number(id))
      res.status(200).json(payment)
    } catch (error) {
      errorHandler(error, req, res)
    }
  }
}
