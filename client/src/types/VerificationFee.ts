import { Payment } from "./managedPortfolio";

export type VerificationFee ={
    id:number
     amount: number;
 isPaid?: boolean;
 name:string;
 payments: Payment[]
}

export type VerificationFeeCreationDto = {
    amount:number
}
export type UploadVerificationFeeProofOfPaymentDto={
    receipt:File
    paymentId:string
    paymentType:string
}
export type ApproveVerificationFee ={
    isPaid:boolean
}