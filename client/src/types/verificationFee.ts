export type VerificationFee ={
    id:number
     amount: number;
 isPaid?: boolean;
 receipt?:string;
 paymentId?:string
 paymentType?:string
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