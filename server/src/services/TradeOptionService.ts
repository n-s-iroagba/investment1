import { Op } from 'sequelize';
import TradeOption from '../models/TradeOption';
import Trade from '../models/Trade';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';

interface TradeOptionCreateInput {
  TradingAsset: string;
  direction: 'buy' | 'sell';
  percentageReturn: number;
  durationInDays: number;
  tradeId: number;
}

interface TradeOptionUpdateInput {
  TradingAsset?: string;
  direction?: 'buy' | 'sell';
  percentageReturn?: number;
  durationInDays?: number;
}

export class TradeOptionService {
  static async createTradeOption(data: TradeOptionCreateInput) {
    logger.info('TradeOptionService.createTradeOption called', { data });
    try {
      if (
        !data.TradingAsset ||
        !data.direction ||
        data.percentageReturn === undefined ||
        data.durationInDays === undefined ||
        !data.tradeId
      ) {
        throw new CustomError(400, 'All fields must be present for TradeOption creation');
      }

      // Optional: Verify tradeId exists
      const trade = await Trade.findByPk(data.tradeId);
      if (!trade) {
        throw new CustomError(404, `Trade with id ${data.tradeId} not found`);
      }

      const tradeOption = await TradeOption.create(data);
      logger.info('TradeOption created successfully', { id: tradeOption.id });
      return tradeOption;
    } catch (error) {
      logger.error('Error creating TradeOption', { error });
      throw error;
    }
  }

  static async updateTradeOption(id: number, data: TradeOptionUpdateInput) {
    logger.info(`TradeOptionService.updateTradeOption called for id=${id}`, { data });

    const tradeOption = await TradeOption.findByPk(id);
    if (!tradeOption) {
      logger.warn(`TradeOption not found with id=${id}`);
      throw new CustomError(404, `TradeOption with id ${id} not found`);
    }

    // Update allowed fields only
    if (data.TradingAsset !== undefined) tradeOption.TradingAsset = data.TradingAsset;
    if (data.direction !== undefined) tradeOption.direction = data.direction;
    if (data.percentageReturn !== undefined) tradeOption.percentageReturn = data.percentageReturn;
    if (data.durationInDays !== undefined) tradeOption.durationInDays = data.durationInDays;

    await tradeOption.save();
    logger.info(`TradeOption updated successfully for id=${id}`);
    return tradeOption;
  }

  static async deleteTradeOption(id: number) {
    logger.info(`TradeOptionService.deleteTradeOption called for id=${id}`);

    const tradeOption = await TradeOption.findByPk(id);
    if (!tradeOption) {
      logger.warn(`TradeOption not found with id=${id}`);
      throw new CustomError(404, `TradeOption with id ${id} not found`);
    }

    await tradeOption.destroy();
    logger.info(`TradeOption deleted successfully for id=${id}`);
    return true;
  }

  // Get all past trade options for a trade:
  // past means entryDate + durationInDays < now
  static async getPastTradeOptions(tradeId: number) {
    logger.info(`TradeOptionService.getPastTradeOptions called for tradeId=${tradeId}`);

    // Fetch trade with entryDate
    const trade = await Trade.findByPk(tradeId);
    if (!trade) {
      logger.warn(`Trade not found with id=${tradeId}`);
      throw new CustomError(404, `Trade with id ${tradeId} not found`);
    }

    const now = new Date();

    // Fetch all tradeOptions for trade
    const tradeOptions = await TradeOption.findAll({
      where: {
        tradeId,
      },
    });

    // Filter tradeOptions where entryDate + durationInDays < now
    const pastTradeOptions = tradeOptions.filter((option) => {
      const expiryDate = new Date(trade.entryDate);
      expiryDate.setDate(expiryDate.getDate() + option.durationInDays);
      return expiryDate < now;
    });

    return pastTradeOptions;
  }

  // Get all current (active) trade options for a trade:
  // current means entryDate + durationInDays >= now
  static async getCurrentTradeOptions(tradeId: number) {
    logger.info(`TradeOptionService.getCurrentTradeOptions called for tradeId=${tradeId}`);

    const trade = await Trade.findByPk(tradeId);
    if (!trade) {
      logger.warn(`Trade not found with id=${tradeId}`);
      throw new CustomError(404, `Trade with id ${tradeId} not found`);
    }

    const now = new Date();

    const tradeOptions = await TradeOption.findAll({
      where: {
        tradeId,
      },
    });

    const currentTradeOptions = tradeOptions.filter((option) => {
      const expiryDate = new Date(trade.entryDate);
      expiryDate.setDate(expiryDate.getDate() + option.durationInDays);
      return expiryDate >= now;
    });

    return currentTradeOptions;
  }
}
