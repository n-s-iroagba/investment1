import Admin from '../models/Admin.js';
import CryptoWallet from '../models/CryptoWallet.js';
import Investor from '../models/Investor.js';
import Kyc from '../models/Kyc.js';
import ManagedPortfolio from '../models/ManagedPortfolio.js';
import Manager from '../models/Manager.js';
import Payment, { PaymentCreationAttributes } from '../models/Payment.js';
import User from '../models/User.js';
import VerificationFee from '../models/VerificationFee.js';
import { CustomError } from '../utils/error/CustomError.js';
import logger from '../utils/logger/logger.js';
import { PaymentCreationDto } from './VerificationFeeService.js';


interface ManagedPortfolioInput {
  amount: number;
  earnings?:number;
  amountDeposited?: number;
  lastDepositDate?: Date | null;
  isPaused?: boolean;
  investorId: number;
  managerId: number;
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
static async creditAmountDeposited(id:string, amount:number){
  try{
  const portfolio = await ManagedPortfolio.findByPk(id)
  if(!portfolio){
    throw new CustomError(404, 'Portfolio not found')
  }
  portfolio.amountDeposited? portfolio.amountDeposited += amount : portfolio.amountDeposited = amount
  
  await portfolio.save()
}
catch (error) {
      logger.error(`Failed to credit amount deposited ManagedPortfolio: ${error}`);
      throw error;
    }
  }
static async creditEarnings(id:string, amount:number){
  try{
  const portfolio = await ManagedPortfolio.findByPk(id)
  if(!portfolio){
    throw new CustomError(404, 'Portfolio not found')
  }
  portfolio.earnings? portfolio.earnings += amount : portfolio.earnings = amount
  await portfolio.save()
}
catch (error) {
      logger.error(`Failed to credit earnings for ManagedPortfolio: ${error}`);
      throw error;
    }
  }
  static async getInvestmentByInvestorId(
  investorId: number
): Promise<ManagedPortfolio | null> {
  console.log('in portfolio service')
  const portfolio = await ManagedPortfolio.findOne({
    where: { investorId },
    include: [
      {
        model: Manager,
        as: 'manager',
      },
      {
        model:Payment,
        as:'payments'
      },
        {
        model:CryptoWallet,
        as:'cryptoWallet'
      }
    ],

  });
console.log(portfolio)

  return portfolio;
};
}
