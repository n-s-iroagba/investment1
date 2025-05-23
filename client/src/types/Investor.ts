import { Kyc } from "./Kyc";

import { VerificationFee } from "./VerificationFee";

import { ManagedPortfolio } from "./managedPortfolio";

export type InvestorAndInvestment ={
      id:number;

   lastName: string;
   firstName: string;
   dateOfBirth: Date;
   gender: string;
   countryOfResidence: string;

   referralCode: number | null;

   user: {
    email:string
   }
   kyc?:Kyc
   managedPortfolios?: ManagedPortfolio[]
   verificationFees?: VerificationFee[]

  
}