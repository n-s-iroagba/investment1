import { TradingAsset } from "./TradingAsset";

export type TradeOption ={
  id: number;
  TradingAsset: TradingAsset;//select form pre existing TradingAsset
  direction: 'buy' | 'sell';
  percentageReturn: number;
  durationInDays: number;

}

export type TradeOptionCreationDto = Omit<TradeOption, 'id'>