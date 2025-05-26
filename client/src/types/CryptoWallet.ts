export type CryptoWallet = {
    id:number;
     currency: string;
 address: string;
 depositAddress:string
}

export type CryptoWalletCreationDto = Omit<CryptoWallet,'id'>
