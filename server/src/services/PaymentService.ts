import Payment, { PaymentCreationAttributes } from '../models/Payment';

/**
 * Create a new payment
 * @param payload - payment data excluding `id`
 */
export const createPayment = async (payload: PaymentCreationAttributes) => {
  try {
    const payment = await Payment.create(payload);
    return payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

/**
 * Verify an existing payment
 * @param paymentId - ID of the payment to verify
 */
export const verifyPayment = async (paymentId: number) => {
  try {
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.isVerified = true;
    await payment.save();

    return payment;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};
