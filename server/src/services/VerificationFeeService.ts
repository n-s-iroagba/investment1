import VerificationFee from '../models/VerificationFee.js';
import Investor from '../models/Investor.js';
import Admin from '../models/Admin.js';
import { CustomError } from '../utils/error/CustomError.js';
import Payment, { PaymentCreationAttributes } from '../models/Payment.js';

interface VerificationFeeCreateInput {
  amount: number;
  investorId: number;
  name:string
  
}

interface VerificationFeeUpdateInput {
  amount?: number;
  isPaid?: boolean;
  
}

export type  PaymentCreationDto = {
   receipt: string;
  depositType: string;
  amount: number;
   paymentID:string;
}
export class VerificationFeeService {
  static async createVerificationFee(data: VerificationFeeCreateInput) {
    // Optionally verify Investor and Admin existence if needed here
    const verificationFee = await VerificationFee.create(data);
    return verificationFee;
  }

  static async uploadProofOfPayment(id: number, payload:PaymentCreationDto) {
  const verificationFee = await VerificationFee.findByPk(id);
  if (!verificationFee) {
    throw new CustomError(404, `VerificationFee with id ${id} not found`);
  }
  const data:PaymentCreationAttributes ={...payload,paymentType:'FEE',date:new Date(),isVerified:false}
  const payment = await Payment.create(data);
  const payments = verificationFee.payments??[]
  payments.push(payment)
  verificationFee.payments = payments
  await verificationFee.save()
  return verificationFee;
}

  static async getVerificationFeeById(id: number) {
    const verificationFee = await VerificationFee.findByPk(id, {
      include: [
        { model: Investor, as: 'investor' },
        { model: Admin, as: 'admin' },
      ],
    });
    if (!verificationFee) {
      throw new CustomError(404, `VerificationFee with id ${id} not found`);
    }
    return verificationFee;
  }

  static async updateVerificationFee(id: number, data: VerificationFeeUpdateInput) {
    const verificationFee = await VerificationFee.findByPk(id);
    if (!verificationFee) {
      throw new CustomError(404, `VerificationFee with id ${id} not found`);
    }

    if (data.amount !== undefined) verificationFee.amount = data.amount;
    if (data.isPaid !== undefined) verificationFee.isPaid = data.isPaid;
 

    await verificationFee.save();
    return verificationFee;
  }

  static async deleteVerificationFee(id: number) {
    const verificationFee = await VerificationFee.findByPk(id);
    if (!verificationFee) {
      throw new CustomError(404, `VerificationFee with id ${id} not found`);
    }

    await verificationFee.destroy();
    return true;
  }

  static async getAllVerificationFees() {
    return VerificationFee.findAll({
      include: [
        { model: Investor, as: 'investor' },
        { model: Admin, as: 'admin' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
