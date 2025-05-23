import Admin from '../models/Admin';
import Investor from '../models/Investor';
import Kyc from '../models/Kyc';
import ManagedPortfolio from '../models/ManagedPortfolio';
import Payment, { PaymentCreationAttributes } from '../models/Payment';
import User from '../models/User';
import VerificationFee from '../models/VerificationFee';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';
import { PaymentCreationDto } from './VerificationFeeService';


interface ManagedPortfolioInput {
  amount: number;
  earnings?:number;
  amountDeposited?: number;
  lastDepositDate?: Date | null;
  isPaused?: boolean;
  investorId: number;
  managerId: number;
}

export type InvestorAndInvestment ={
      id:number;

   lastName: string;
   firstName: string;
   dateOfBirth: Date;
   gender: string;
   countryOfResidence: string;

   referralCode: number | null;

   user: {
    email:string
   }
   kyc?:Kyc
   managedPortfolios?: ManagedPortfolio[]
   verificationFees?: VerificationFee[]

  
}

export class ManagedPortfolioService {
  // Create with required amount and managerId (and investorId)
  static async createPortfolio(data: ManagedPortfolioInput) {
    const { amount, managerId, investorId } = data;

    if (amount == null || managerId == null || investorId == null) {
      throw new CustomError(400, 'amount, managerId, and investorId are required');
    }
  
    try {
      const portfolio = await ManagedPortfolio.create(data);
      logger.info(`Created ManagedPortfolio id=${portfolio.id}`);
      return portfolio;
    } catch (error) {
      logger.error(`Failed to create ManagedPortfolio: ${error}`);
      throw error;
    }
  }



static async getInvestorAndInvestmentById  (
  investorId: number
): Promise<InvestorAndInvestment | null> {
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

  if (!investor) return null;

  const investorAndInvestment: InvestorAndInvestment = {
    id: investor.id,
    firstName: investor.firstName,
    lastName: investor.lastName,
    dateOfBirth: investor.dateOfBirth,
    gender: investor.gender,
    countryOfResidence: investor.countryOfResidence,
    referralCode: investor.referralCode,
    user: {
      email: (investor as any).user?.email || '',
    },
    kyc: (investor as any).kyc || undefined,
    managedPortfolios: (investor as any).managedPortfolios || [],
    verificationFees: (investor as any).verificationFees || [],
  };

  return investorAndInvestment;
};


  // Update by id - must include amount and managerId
  static async updatePortfolio(id: number, data: ManagedPortfolioInput) {
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

      if (data.earnings !== undefined) portfolio.earnings = data.earnings;
      if (data.amountDeposited !== undefined) portfolio.amountDeposited = data.amountDeposited;
      if (data.lastDepositDate !== undefined) portfolio.lastDepositDate = data.lastDepositDate;
      if (data.investorId !== undefined) portfolio.investorId = data.investorId;

      await portfolio.save();

      logger.info(`Updated ManagedPortfolio id=${id}`);
      return portfolio;
    } catch (error) {
      logger.error(`Failed to update ManagedPortfolio: ${error}`);
      throw error;
    }
  }

      static async uploadProofOfPayment(id: number, payload:PaymentCreationDto) {
    const managedPortfolio = await ManagedPortfolio.findByPk(id);
    if (!managedPortfolio) {
      throw new CustomError(404, `ManagedPortfolio with id ${id} not found`);
    }
    const data:PaymentCreationAttributes ={...payload,paymentType:'INVESTMENT',date:new Date()}
    try{
    const payment = await Payment.create(data);
    const payments = managedPortfolio.payments??[]
    payments.push(payment)
    managedPortfolio.setPayments(payments)
    await managedPortfolio.save()
    return managedPortfolio;
    }catch(error){
       logger.error(`Failed to upload managed portfolio proof of payment: ${error}`);
      throw error;
    }
  }
}
