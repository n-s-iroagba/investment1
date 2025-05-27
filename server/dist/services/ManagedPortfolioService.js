import Investor from '../models/Investor.js';
import Kyc from '../models/Kyc.js';
import ManagedPortfolio from '../models/ManagedPortfolio.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import VerificationFee from '../models/VerificationFee.js';
import { CustomError } from '../utils/error/CustomError.js';
import logger from '../utils/logger/logger.js';
export class ManagedPortfolioService {
    // Create with required amount and managerId (and investorId)
    static async createPortfolio(data) {
        const { amount, managerId, investorId } = data;
        if (amount == null || managerId == null || investorId == null) {
            throw new CustomError(400, 'amount, managerId, and investorId are required');
        }
        try {
            const portfolio = await ManagedPortfolio.create(data);
            logger.info(`Created ManagedPortfolio id=${portfolio.id}`);
            return portfolio;
        }
        catch (error) {
            logger.error(`Failed to create ManagedPortfolio: ${error}`);
            throw error;
        }
    }
    static async creditInvestment(id, amount) {
        try {
            const portfolio = await ManagedPortfolio.findOne({ where: { investorId: id } });
            if (!portfolio) {
                throw new CustomError(404, 'Portfolio not found');
            }
            portfolio.amountDeposited ? portfolio.amountDeposited += amount : portfolio.amountDeposited = amount;
            await portfolio.save();
        }
        catch (error) {
            logger.error(`Failed to credit ManagedPortfolio: ${error}`);
            throw error;
        }
    }
    static async getInvestorById(investorId) {
        const investor = await Investor.findByPk(investorId, {
            attributes: ['id', 'firstName', 'lastName', 'gender', 'countryOfResidence', 'dateOfBirth', 'referralCode'],
            include: [
                {
                    model: User,
                    attributes: ['email'],
                    as: 'user',
                },
                {
                    model: Kyc,
                    as: 'kyc',
                },
                {
                    model: ManagedPortfolio,
                    as: 'managedPortfolios',
                },
                {
                    model: VerificationFee,
                    as: 'verificationFees',
                },
            ],
        });
        if (!investor)
            throw new CustomError(404, 'investor not found');
        return investor;
    }
    ;
    // Update by id - must include amount and managerId
    static async updatePortfolio(id, data) {
        const { amount, managerId } = data;
        if (amount == null || managerId == null) {
            throw new CustomError(400, 'amount and managerId are required for update');
        }
        const portfolio = await ManagedPortfolio.findByPk(id);
        if (!portfolio) {
            throw new CustomError(404, `ManagedPortfolio with id ${id} not found`);
        }
        try {
            // Update all passed fields
            portfolio.amount = amount;
            portfolio.managerId = managerId;
            if (data.earnings !== undefined)
                portfolio.earnings = data.earnings;
            if (data.amountDeposited !== undefined)
                portfolio.amountDeposited = data.amountDeposited;
            if (data.lastDepositDate !== undefined)
                portfolio.lastDepositDate = data.lastDepositDate;
            if (data.investorId !== undefined)
                portfolio.investorId = data.investorId;
            await portfolio.save();
            logger.info(`Updated ManagedPortfolio id=${id}`);
            return portfolio;
        }
        catch (error) {
            logger.error(`Failed to update ManagedPortfolio: ${error}`);
            throw error;
        }
    }
    static async uploadProofOfPayment(id, payload) {
        const managedPortfolio = await ManagedPortfolio.findByPk(id);
        if (!managedPortfolio) {
            throw new CustomError(404, `ManagedPortfolio with id ${id} not found`);
        }
        const data = { ...payload, paymentType: 'INVESTMENT', date: new Date(), isVerified: false };
        try {
            const payment = await Payment.create(data);
            const payments = managedPortfolio.payments ?? [];
            payments.push(payment);
            managedPortfolio.setPayments(payments);
            await managedPortfolio.save();
            return managedPortfolio;
        }
        catch (error) {
            logger.error(`Failed to upload managed portfolio proof of payment: ${error}`);
            throw error;
        }
    }
}
