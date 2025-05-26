import { CryptoWallet } from "./CryptoWallet";
import { Manager } from "./manager";
import { Payment } from "./Payment";
export type  ManagedPortfolio ={
    id:number
    amount: number;
 earnings?: number;
   amountDeposited?: number;

 payments: Payment[]
 manager:Manager
 cryptoWallet:CryptoWallet
}
