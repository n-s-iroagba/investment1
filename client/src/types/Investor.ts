import { Kyc } from "./Kyc";
import { ManagedInvestmentPortfolio } from "./managedPortfolio";
import { VerificationFee } from "./VerificationFee";

export type FullInvestor ={
      id:number;

   lastName: string;
   firstName: string;
   dateOfBirth: Date;
   gender: string;
   countryOfResidence: string;

   referralCode: number | null;
   referrerId: number | null;
   user: {
    email:string
   }



   

   kyc:Kyc
   managedPortfolios?: ManagedInvestmentPortfolio[]
   verificationFees?: VerificationFee[]

  
}