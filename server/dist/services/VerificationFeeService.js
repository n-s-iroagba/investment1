import VerificationFee from '../models/VerificationFee.js';
import Investor from '../models/Investor.js';
import Admin from '../models/Admin.js';
import { CustomError } from '../utils/error/CustomError.js';
import Payment from '../models/Payment.js';
export class VerificationFeeService {
    static async createVerificationFee(data) {
        // Optionally verify Investor and Admin existence if needed here
        const verificationFee = await VerificationFee.create(data);
        return verificationFee;
    }
    static async uploadProofOfPayment(id, payload) {
        const verificationFee = await VerificationFee.findByPk(id);
        if (!verificationFee) {
            throw new CustomError(404, `VerificationFee with id ${id} not found`);
        }
        const data = { ...payload, paymentType: 'FEE', date: new Date(), isVerified: false };
        const payment = await Payment.create(data);
        const payments = verificationFee.payments ?? [];
        payments.push(payment);
        verificationFee.payments = payments;
        await verificationFee.save();
        return verificationFee;
    }
    static async getVerificationFeeById(id) {
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
    static async updateVerificationFee(id, data) {
        const verificationFee = await VerificationFee.findByPk(id);
        if (!verificationFee) {
            throw new CustomError(404, `VerificationFee with id ${id} not found`);
        }
        if (data.amount !== undefined)
            verificationFee.amount = data.amount;
        if (data.isPaid !== undefined)
            verificationFee.isPaid = data.isPaid;
        await verificationFee.save();
        return verificationFee;
    }
    static async deleteVerificationFee(id) {
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
