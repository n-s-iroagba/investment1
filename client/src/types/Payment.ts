export type Payment = {
   id: number;
  date: Date;
  receipt: string;
  depositType: string;
   paymentType:'FEE'|'INVESTMENT';
  amount: number;
   paymentID:string;
  isVerified?:boolean  
}

export type  PaymentCreationDto = {
   receipt: string;
  depositType: string;
  amount: number;
   paymentID:string;
}