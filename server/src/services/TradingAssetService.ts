
import TradingAsset from '../models/TradingAsset';
import { CustomError } from '../utils/error/CustomError'; // Optional custom error class

interface TradingAssetCreateInput {
  name: string;
  type:string;
}

interface TradingAssetUpdateInput {
  name?: string;
  type?:string;
}

export class TradingAssetService {
  static async createTradingAsset(data: TradingAssetCreateInput) {
    const existing = await TradingAsset.findOne({ where: { name: data.name } });
    if (existing) {
      throw new CustomError(400, `TradingAsset name "${data.name}" already exists.`);
    }
    const tradingAsset = await TradingAsset.create(data);
    return TradingAsset;
  }

  static async getAllTradingAssets() {
    return TradingAsset.findAll({
      order: [['name', 'ASC']],
    });
  }

  static async updateTradingAsset(id: number, data: TradingAssetUpdateInput) {
    const tradingAsset = await TradingAsset.findByPk(id);
    if (!tradingAsset) {
      throw new CustomError(404, `TradingAsset with ID ${id} not found.`);
    }
    if (data.name !== undefined) tradingAsset.name = data.name;

    await tradingAsset.save();
    return tradingAsset;
  }

  static async deleteTradingAsset(id: number) {
    const tradingAsset = await TradingAsset.findByPk(id);
    if (!tradingAsset) {
      throw new CustomError(404, `TradingAsset with ID ${id} not found.`);
    }
    await tradingAsset.destroy();
    return true;
  }
}
