
import { Payment } from "../models/Payment"
import { CustomError } from "../utils/error/CustomError"
import logger from "../utils/logger/logger"


class PaymentService {

  static async getUnverifiedPayments(){
    try{
      const payments = await Payment.findAll({where:{isVerified: false}})
      return payments
    }catch(error){
      logger.error(error)
      throw error
    }
  }
  static async verifyPayment(id: number) {
    const payment = await Payment.findByPk(id)
    if (!payment) {
      throw new CustomError(404, `Payment with id ${id} not found`)
    }

    payment.isVerified = true
    await payment.save()

    logger.info(`Payment ${id} verified`)
    return payment
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
}

export { PaymentService }
export default PaymentService
