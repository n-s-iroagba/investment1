export type CryptoWallet = {
    id:number;
     TradingAsset: string;
 address: string;
}

export type CryptoWalletCreationDto = Omit<CryptoWallet,'id'>