import { Payment } from "../models/Payment.js";
import { CustomError } from "../utils/error/CustomError.js";
import logger from "../utils/logger/logger.js";
class PaymentService {
    static async getUnverifiedPayments() {
        try {
            const payments = await Payment.findAll({ where: { isVerified: false } });
            return payments;
        }
        catch (error) {
            logger.error(error);
            throw error;
        }
    }
    static async verifyPayment(id) {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            throw new CustomError(404, `Payment with id ${id} not found`);
        }
        payment.isVerified = true;
        await payment.save();
        logger.info(`Payment ${id} verified`);
        return payment;
    }
    static async unverifyPayment(id) {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            throw new CustomError(404, `Payment with id ${id} not found`);
        }
        payment.isVerified = false;
        await payment.save();
        logger.info(`Payment ${id} unverified`);
        return payment;
    }
}
export { PaymentService };
export default PaymentService;
