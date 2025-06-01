import type { Request, Response } from "express"
import { PaymentService } from "../services/PaymentService.js"
import { CustomError, errorHandler } from "../utils/error/errorHandler.js"
import ManagedPortfolio from "../models/ManagedPortfolio.js"
import VerificationFee from "../models/VerificationFee.js"
import Payment from "../models/Payment.js"

class PaymentController {
  static async getUnverifiedPayments(req: Request, res: Response) {
    try {
      const payments = await PaymentService.getUnverifiedPayments()
     return res.status(200).json( payments)
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async unverifyPayment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const paymentId = parseInt(id)

      if (isNaN(paymentId)) {
        throw new CustomError(400, 'Invalid payment ID')
      }

      const payment = await PaymentService.unverifyPayment(paymentId)

     return res.status(200).json({
        success: true,
        message: 'Payment unverified successfully',
        data: payment
      })
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async createPayment(req: Request, res: Response) {
    try {
      const { type, amount, paymentID, depositType, managedPortfolioId, verificationFeeId } = req.body
      const investorId = Number(req.params.investorId)
      const receipt = req.file.filename
      if (!investorId) {
        throw new CustomError(401, 'Unauthorized: User not authenticated')
      }
      if (!receipt) {
        throw new CustomError(400, 'Missing receipt file')
      }
      if (!type || !amount || !paymentID || !depositType) {
        throw new CustomError(400, 'Missing required fields: type, amount, paymentID, depositType')
      }

      if (!['INVESTMENT', 'FEE'].includes(type)) {
        throw new CustomError(400, 'Invalid payment type. Must be INVESTMENT or FEE')
      }

      if (type === 'INVESTMENT' && !managedPortfolioId) {
        throw new CustomError(400, 'managedPortfolioId is required for INVESTMENT payments')
      }

      if (type === 'FEE' && !verificationFeeId) {
        throw new CustomError(400, 'verificationFeeId is required for FEE payments')
      }

      if (amount <= 0) {
        throw new CustomError(400, 'Amount must be greater than 0')
      }

      const paymentData = {
        type,
        amount,
        paymentID,
        depositType,
        receipt,
        investorId,
        managedPortfolioId,
        verificationFeeId
      }

      const payment = await PaymentService.createPayment(paymentData)

     return res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      })
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async updatePayment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { amount, paymentID, depositType, receipt, verificationStatus } = req.body
      const paymentId = parseInt(id)

    
      if (isNaN(paymentId)) {
        throw new CustomError(400, 'Invalid payment ID')
      }

      if (amount !== undefined && amount <= 0) {
        throw new CustomError(400, 'Amount must be greater than 0')
      }

      if (verificationStatus && !['PENDING', 'VERIFIED', 'REJECTED'].includes(verificationStatus)) {
        throw new CustomError(400, 'Invalid verification status')
      }

      const updateData = {
        amount,
        paymentID,
        depositType,
        receipt,
        verificationStatus
      }

      Object.keys(updateData).forEach(key =>
        updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
      )

      const payment = await PaymentService.updatePayment(paymentId, updateData)

     return res.status(200).json({
        success: true,
        message: 'Payment updated successfully',
        data: payment
      })
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async verifyPayment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const paymentId = parseInt(id)

      if (isNaN(paymentId)) {
        throw new CustomError(400, 'Invalid payment ID')
      }

      const payment = await PaymentService.verifyPayment(paymentId)

     return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: payment
      })
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async getInvestorPayments(req: Request, res: Response) {
    try {
      const investorId = Number(req.params.id)

      if (!investorId) {
        throw new CustomError(401, 'Unauthorized: User not authenticated')
      }

      const payments = await PaymentService.getInvestorPayments(investorId)

     return res.status(200).json(payments)
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async getPaymentsByInvestorId(req: Request, res: Response) {
    try {
      const { investorId } = req.params
      const id = parseInt(investorId)

      if (isNaN(id)) {
        throw new CustomError(400, 'Invalid investor ID')
      }

      const payments = await PaymentService.getInvestorPayments(id)

     return res.status(200).json(payments)
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async deletePayment(req: Request, res: Response) {
    try {
      const { id } = req.params
  
      const paymentId = parseInt(id)

      

      if (isNaN(paymentId)) {
        throw new CustomError(400, 'Invalid payment ID')
      }

      await PaymentService.deletePayment(paymentId)

     return res.status(200).json({
        success: true,
        message: 'Payment deleted successfully'
      })
    } catch (error) {
      errorHandler(error, req, res)
    }
  }
}

export { PaymentController }
export default PaymentController
