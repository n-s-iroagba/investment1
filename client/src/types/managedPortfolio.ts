  
export type  ManagedInvestmentPortfolio ={
    id:number
    amount: number;
 earnings?: number;
   amountDeposited?: number;

 payments: Payment[]
}


export type Payment = {
  id:number;
  date:Date;
  receipt:string
  type:'FEE'|'PORTFOLIO'
  amount:number
}