import ManagedPortfolio from '../models/ManagedPortfolio';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';


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

  // Read by id
  static async getPortfolioById(id: number) {
    const portfolio = await ManagedPortfolio.findByPk(id);
    if (!portfolio) {
      throw new CustomError(404, `ManagedPortfolio with id ${id} not found`);
    }
    return portfolio;
  }

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
}
