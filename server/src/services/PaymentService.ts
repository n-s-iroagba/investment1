
import ManagedPortfolio from "../models/ManagedPortfolio.js"
import { Payment } from "../models/Payment.js"
import VerificationFee from "../models/VerificationFee.js"
import { CustomError } from "../utils/error/CustomError.js"
import logger from "../utils/logger/logger.js"
interface CreatePaymentData {
  type: 'INVESTMENT' | 'FEE'
  amount: number
  paymentID: string
  depositType: string
  receipt?: Buffer
  investorId: number
  managedPortfolioId?: number
  verificationFeeId?: number
}

interface UpdatePaymentData {
  amount?: number
  paymentID?: string
  depositType?: string
  receipt?: Buffer
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED'
}

class PaymentService {

  static async getUnverifiedPayments(){
    try{
      const payments = await Payment.findAll({where:{isVerified: false}})
       const paymentssWithBase64Images = payments.map(payment => {
      const paymentData = payment.toJSON() as any; // Type assertion
      
      // Convert Buffer to base64 if image exists
      if (paymentData.image && Buffer.isBuffer(paymentData.image)) {
        paymentData.image = `data:image/png;base64,${paymentData.image.toString('base64')}`;
      }
      
      return paymentData;
    }
  )
    return paymentssWithBase64Images

    }catch(error){
      logger.error(error)
      throw error
    }
  }


  static async unverifyPayment(id: number) {
    const payment = await Payment.findByPk(id)
    if (!payment) {
      throw new CustomError(404, `Payment with id ${id} not found`)
    }

    payment.isVerified = false
    await payment.save()

    logger.info(`Payment ${id} unverified`)
    return payment
  }



  /**
   * Create a new payment record
   */
  static async createPayment(data: CreatePaymentData): Promise<Payment> {
    try {
      let entity
      // Validate the reference entity exists
      if (data.type === 'INVESTMENT' && data.managedPortfolioId) {
        entity = await ManagedPortfolio.findByPk(data.managedPortfolioId)
        if (!entity) {
          throw new CustomError( 404,'Investment portfolio not found')
        }
        // Verify the portfolio belongs to the investor
        if (entity.investorId !== data.investorId) {
          throw new CustomError( 403,'Unauthorized: Portfolio does not belong to this investor')
        }
      }

      if (data.type === 'FEE' && data.verificationFeeId) {
        entity = await VerificationFee.findByPk(data.verificationFeeId)
        if (!entity) {
          throw new CustomError( 404,'Verification fee not found')
        }
        // Verify the fee belongs to the investor
        if (entity.investorId !== data.investorId) {
          throw new CustomError( 403,'Unauthorized: Verification fee does not belong to this investor')
        }
      }

      // Create the payment record
      const payment = await Payment.create({
        paymentType: data.type,
        amount: data.amount,
        paymentID: data.paymentID,
        depositType: data.depositType,
        receipt: data.receipt,
        paymentDate: new Date(), // Set to current date as specified
        isVerified: false,
        investorId: data.investorId,
        entityId: data.managedPortfolioId,
      })

      return payment
    } catch (error) {
      console.error('Error creating payment:', error)
      throw error
    }
  }

  /**
   * Update an existing payment record
   */
  static async updatePayment(paymentId: number, data: UpdatePaymentData): Promise<Payment> {
    try {
      const payment = await Payment.findByPk(paymentId, {
        include: [
          { model: ManagedPortfolio, as: 'managedPortfolio' },
          { model: VerificationFee, as: 'verificationFee' }
        ]
      })

      if (!payment) {
        throw new CustomError( 40,'Payment not found')
      }

      // Update fields
      const updatedPayment = await payment.update({
        ...data,
        // Reset verification status if critical fields are changed
        isVerified: (data.amount || data.paymentID || data.receipt) 
          ? false
          : payment.isVerified
      })

      return updatedPayment
    } catch (error) {
      console.error('Error updating payment:', error)
      throw error
    }
  }

  /**
   * Verify a payment (Admin function)
   */
  static async verifyPayment(
    paymentId: number, 
  ): Promise<Payment> {
    try {
      const payment = await Payment.findByPk(paymentId)

      if (!payment) {
        throw new CustomError( 40,'Payment not found')
      }

      // Update payment verification status
      const updatedPayment = await payment.update({
        isVerified:true
      })


      return updatedPayment
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  /**
   * Get payments for an investor
   */
  static async getInvestorPayments(investorId: number): Promise<Payment[]> {
    try {
      const whereClause: any = { investorId }
   

      const payments = await Payment.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']]
      })
       const paymentssWithBase64Images = payments.map(payment => {
      const paymentData = payment.toJSON() as any; // Type assertion
      
      // Convert Buffer to base64 if image exists
      if (paymentData.image && Buffer.isBuffer(paymentData.image)) {
        paymentData.image = `data:image/png;base64,${paymentData.image.toString('base64')}`;
      }
      
      return paymentData;
    }
  )
    return paymentssWithBase64Images

    }catch(error){
      logger.error(error)
      throw error
    }
  }





  /**
   * Delete a payment (only if pending)
   */
  static async deletePayment(paymentId: number): Promise<void> {
    try {
      const payment = await Payment.findByPk(paymentId)

      if (!payment) {
        throw new CustomError( 40,'Payment not found')
      }
  

      await payment.destroy()
    } catch (error) {
      console.error('Error deleting payment:', error)
      throw error
    }
  }
}
export { PaymentService }
export default PaymentService
