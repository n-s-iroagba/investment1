import { DATE, literal, Op } from 'sequelize';
import Trade from '../models/Trade';
import TradeOption from '../models/TradeOption';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';

interface TradeCreateInput {
  amountTraded: number;
  investorPortfolioId: number;
  tradeOptionId: number;
  entryDate: Date;
  earnings?: number;
}

interface TradeUpdateInput {
  amountTraded: number;
  investorPortfolioId: number;
  tradeOptionId: number;
  entryDate?: Date;
  earnings?: number;
}

export class TradeService {
  static async createTrade(data: TradeCreateInput) {
    logger.info('TradeService.createTrade called', { data });
    try {
      const trade = await Trade.create({...data,entryDate:new Date () });
      logger.info('Trade created successfully', { id: trade.id });
      return trade;
    } catch (error) {
      logger.error('Error creating Trade', { error });
      throw error;
    }
  }

  static async getTradeById(id: number) {
    const trade = await Trade.findByPk(id, { include: ['tradeOption'] });
    if (!trade) {
      throw new CustomError(404, `Trade with id ${id} not found`);
    }
    return trade;
  }

  static async updateTrade(id: number, data: TradeUpdateInput) {
    const trade = await Trade.findByPk(id);
    if (!trade) {
      throw new CustomError(404, `Trade with id ${id} not found`);
    }
    await trade.update(data);
    return trade;
  }

  static async deleteTrade(id: number) {
    const trade = await Trade.findByPk(id);
    if (!trade) {
      throw new CustomError(404, `Trade with id ${id} not found`);
    }
    await trade.destroy();
    return true;
  }

  // Get all current trades:
  // assuming "current" means trades with entryDate <= now
  static async getCurrentTrades() {
    const now = new Date();
    const trades = await Trade.findAll({
      where: {
        entryDate: {
          [Op.lte]: now,
        },
      },
     include: [{
      model: TradeOption,
      as: 'tradeOptions',
      where: literal(`DATE_ADD(trade.entryDate, INTERVAL tradeOptions.durationInDays DAY) >= NOW()`),
      required: true,
    }],
    });
    return trades;
  }

    static async getPastTrades() {
    const now = new Date();
    const trades = await Trade.findAll({
      where: {
        entryDate: {
          [Op.lte]: now,
        },
      },
     include: [{
      model: TradeOption,
      as: 'tradeOptions',
      where: literal(`DATE_ADD(trade.entryDate, INTERVAL tradeOptions.durationInDays DAY) <= NOW()`),
      required: true,
    }],
    });
    return trades;
  }
}
