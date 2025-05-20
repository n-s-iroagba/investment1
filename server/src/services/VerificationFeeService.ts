import VerificationFee from '../models/VerificationFee';
import Investor from '../models/Investor';
import Admin from '../models/Admin';
import { CustomError } from '../utils/error/CustomError';

interface VerificationFeeCreateInput {
  amount: number;
  investorId: number;
  
}

interface VerificationFeeUpdateInput {
  amount?: number;
  isPaid?: boolean;
  
}

type ProofOfPaymentUpload={
  proofOfPayment: string;
}
export class VerificationFeeService {
  static async createVerificationFee(data: VerificationFeeCreateInput) {
    // Optionally verify Investor and Admin existence if needed here
    const verificationFee = await VerificationFee.create(data);
    return verificationFee;
  }

  static async uploadProofOfPayment(id: number, filePath: string) {
  const verificationFee = await VerificationFee.findByPk(id);
  if (!verificationFee) {
    throw new CustomError(404, `VerificationFee with id ${id} not found`);
  }

  verificationFee.proofOfPayment = filePath;
  await verificationFee.save();
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
