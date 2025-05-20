import { Transaction } from 'sequelize';
import sequelize from '../config/database';
import InvestorPortfolio from '../models/InvestorPortfolio';
import Trade from '../models/Trade';
import { CustomError } from '../utils/error/CustomError';
import TradeOption from '../models/TradeOption';
import logger from '../utils/logger/logger';

type CreateTradeInput = TradeOption & {

  amountTraded: number;
  // Add other Trade fields here if needed
}

interface CreateInvestorPortfolioInput {
  investorId: number;
  trades: CreateTradeInput[];
}

export class InvestorPortfolioService {
  // Create portfolio with at least one trade
  static async createInvestorPortfolio(data: CreateInvestorPortfolioInput) {
    const { investorId, trades } = data;

    if (!investorId) {
      throw new CustomError(400, 'investorId is required');
    }

    if (!Array.isArray(trades) || trades.length === 0) {
      throw new CustomError(400, 'At least one trade is required to create a portfolio');
    }

    const transaction: Transaction = await sequelize.transaction();

    try {
      // Create the portfolio
      const portfolio = await InvestorPortfolio.create(
        { investorId },
        { transaction }
      );

      // Create associated trades
      for (const tradeData of trades) {
        await Trade.create(
          {
              ...tradeData,
              investorPortfolioId: portfolio.id,
            
              earnings: 0,
              entryDate: new Date ()
          },
          { transaction }
        );
      }

      await transaction.commit();

      logger.info(`Created InvestorPortfolio ${portfolio.id} with ${trades.length} trades`);

      // Return portfolio including trades
      const portfolioWithTrades = await InvestorPortfolio.findByPk(portfolio.id, {
        include: ['trades'],
      });

      return portfolioWithTrades;
    } catch (error) {
      await transaction.rollback();
      logger.error(`Failed to create InvestorPortfolio: ${error}`);
      throw error;
    }
  }

  // Optionally add read/update methods here
}
